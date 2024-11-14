import React, { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import HoverPlugin from "wavesurfer.js/dist/plugins/hover.js";
import { Button } from "@mui/material";
import ProgressBar from "./Progressbar";
import CommentDisplay from "../timestamped-comments/CommentDisplay.jsx";
import {
  formatTime,
  createID,
  convertToSeconds,
  colorToRGB,
} from "../../helpers/utils.jsx";
import useBubbleStore from "../zustand/bubbleStore.jsx";
import throttle from "lodash/throttle";

const ZOOM_SETTINGS = {
  FULL: {
    level: 1,
    pixelsPerSecond: 50,
  },
  HALF: {
    level: 2,
    pixelsPerSecond: 100,
  },
};

const WaveformVis = ({
  setAudioDuration,
  setVizWidth,
  setAudioFileName,
  setVisibleStartTime,
  setVisibleEndTime,
  selectedBubble,
  setIsAudioLoaded,
  setSelectedBubble,
}) => {
  const waveformRef = useRef(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const regionsPluginRef = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(ZOOM_SETTINGS.FULL.level);
  const [selectedStartTime, setSelectedStartTime] = useState(null);

  const bubbles = useBubbleStore((state) => state.bubbles);
  const updateBubble = useBubbleStore((state) => state.updateBubble);
  const addBubble = useBubbleStore((state) => state.addBubble);

  // Clear all regions except selected bubble
  const updateRegions = useCallback(() => {
    if (!wavesurfer || !regionsPluginRef.current) return;

    regionsPluginRef.current.clearRegions();

    if (selectedBubble) {
      regionsPluginRef.current.addRegion({
        id: selectedBubble.id,
        start: convertToSeconds(selectedBubble.startTime),
        end: convertToSeconds(selectedBubble.stopTime),
        color: colorToRGB(selectedBubble.color),
        resize: true,
      });
    }
  }, [selectedBubble, wavesurfer]);

  // Handle zoom changes
  const calculateZoom = useCallback(
    (zoomSetting) => {
      if (!wavesurfer || !duration || !waveformRef.current) return;

      try {
        const containerWidth = waveformRef.current.clientWidth;
        const zoomValue = (containerWidth / duration) * zoomSetting.level;

        // Apply zoom
        wavesurfer.zoom(zoomValue);

        // Calculate visible time range
        const currentTime = wavesurfer.getCurrentTime();
        const visibleDuration = containerWidth / zoomValue;
        const startTime = Math.max(0, currentTime - visibleDuration / 2);
        const endTime = Math.min(duration, startTime + visibleDuration);

        // Update visible time range
        setVisibleStartTime?.(formatTime(startTime));
        setVisibleEndTime?.(formatTime(endTime));

        // Make sure regions are properly displayed
        updateRegions();
      } catch (error) {
        console.error("Error during zoom:", error);
      }
    },
    [
      duration,
      wavesurfer,
      setVisibleStartTime,
      setVisibleEndTime,
      updateRegions,
    ]
  );

  // Initialize WaveSurfer
  useEffect(() => {
    if (!waveformRef.current || wavesurfer) return;

    regionsPluginRef.current = RegionsPlugin.create({
      dragSelection: false,
      snapToGrid: 0.1,
    });

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ddd",
      progressColor: "#4E9EE7",
      cursorColor: "#4E9EE7",
      height: 128,
      autoCenter: true,
      fillParent: true,
      scrollParent: true,
      renderer: "WebGL2",
      pixelRatio: 1,
      normalize: true,
      plugins: [regionsPluginRef.current, HoverPlugin.create()],
    });

    setWavesurfer(ws);

    ws.on("ready", () => {
      const audioDuration = ws.getDuration();
      setDuration(audioDuration);
      setAudioDuration?.(audioDuration);
      setIsAudioLoaded?.(true);

      // Set initial zoom level
      calculateZoom(ZOOM_SETTINGS.FULL);

      if (waveformRef.current) {
        setVizWidth?.(waveformRef.current.clientWidth);
      }
    });

    ws.on("redraw", () => {
      if (waveformRef.current) {
        setVizWidth?.(waveformRef.current.clientWidth);
      }
    });

    ws.on(
      "audioprocess",
      throttle((time) => {
        setCurrentTime(time);
      }, 16)
    );

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));

    // Update visible time range on scroll
    ws.on(
      "scroll",
      throttle(() => {
        if (!ws) return;
        const time = ws.getCurrentTime();
        const visibleWidth = waveformRef.current?.clientWidth || 0;
        const scrollDuration =
          visibleWidth /
          (ZOOM_SETTINGS.FULL.pixelsPerSecond *
            (zoomLevel === ZOOM_SETTINGS.FULL.level ? 1 : 2));

        setVisibleStartTime?.(
          formatTime(Math.max(0, time - scrollDuration / 2))
        );
        setVisibleEndTime?.(
          formatTime(Math.min(duration, time + scrollDuration / 2))
        );
      }, 100)
    );

    // Handle region updates
    regionsPluginRef.current.on("region-updated", (region) => {
      updateBubble(region.id, {
        startTime: formatTime(region.start),
        stopTime: formatTime(region.end),
      });
    });

    return () => {
      ws.destroy();
      setIsAudioLoaded?.(false);
    };
  }, []);

  // Handle audio file loading
  useEffect(() => {
    if (wavesurfer && audioFile) {
      wavesurfer.load(audioFile);
      setZoomLevel(ZOOM_SETTINGS.FULL.level);
    }
  }, [audioFile, wavesurfer]);

  // Update regions when selected bubble changes
  useEffect(() => {
    updateRegions();
  }, [selectedBubble, updateRegions]);

  // Handle zoom toggle
  const toggleZoom = useCallback(() => {
    const newZoomSetting =
      zoomLevel === ZOOM_SETTINGS.FULL.level
        ? ZOOM_SETTINGS.HALF
        : ZOOM_SETTINGS.FULL;

    setZoomLevel(newZoomSetting.level);
    calculateZoom(newZoomSetting);
  }, [zoomLevel, calculateZoom]);

  // Handle audio file loading
  useEffect(() => {
    if (wavesurfer && audioFile) {
      wavesurfer.load(audioFile);
    }
  }, [audioFile, wavesurfer]);

  // Handle regions/bubbles
  useEffect(() => {
    if (!wavesurfer || !regionsPluginRef.current) return;

    regionsPluginRef.current.clearRegions();
    bubbles.forEach((bubble) => {
      regionsPluginRef.current.addRegion({
        id: bubble.id,
        start: convertToSeconds(bubble.startTime),
        end: convertToSeconds(bubble.stopTime),
        color: colorToRGB(bubble.color),
        resize: true,
      });
    });
  }, [bubbles, wavesurfer]);

  // Handle selected bubble
  useEffect(() => {
    if (!wavesurfer || !selectedBubble) return;

    const startSeconds = convertToSeconds(selectedBubble.startTime);
    wavesurfer.seekTo(startSeconds / duration);
  }, [selectedBubble, wavesurfer, duration]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setAudioFile(fileUrl);
      setAudioFileName?.(file.name);
      setIsAudioLoaded?.(false);
      setZoomLevel(ZOOM_SETTINGS.FULL.level);
    }
  };

  const handlePlayPause = () => wavesurfer?.playPause();

  const handleRestart = () => {
    if (wavesurfer) {
      wavesurfer.seekTo(0);
      setCurrentTime(0);
    }
  };

  const markStartTime = () => {
    if (wavesurfer) {
      setSelectedStartTime(wavesurfer.getCurrentTime());
    }
  };

  const markEndTime = () => {
    if (!wavesurfer || selectedStartTime === null) return;

    const endTime = wavesurfer.getCurrentTime();
    const [start, end] = [selectedStartTime, endTime].sort((a, b) => a - b);

    addBubble({
      id: createID(),
      startTime: formatTime(start),
      stopTime: formatTime(end),
      color: "#4E9EE7",
      layer: 1,
    });

    setSelectedStartTime(null);
  };

  return (
    <div className="waveform-container p-5 pt-0 text-center">
      <div className="relative inline-block w-full">
        <div id="waveform" ref={waveformRef} style={{ touchAction: "none" }} />
      </div>

      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        wavesurfer={wavesurfer}
      />

      <div className="relative mt-2.5">
        <CommentDisplay wavesurfer={wavesurfer} />
      </div>

      <div className="flex gap-2.5 justify-center mt-2.5">
        <Button variant="contained" color="primary" onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </Button>

        <Button variant="contained" color="primary" onClick={handleRestart}>
          Reset
        </Button>

        <Button variant="contained" color="primary" onClick={toggleZoom}>
          {zoomLevel === ZOOM_SETTINGS.FULL.level ? "Zoom In" : "Zoom Out"}
        </Button>

        <Button variant="contained" color="primary" component="label">
          Upload Audio
          <input
            type="file"
            hidden
            accept="audio/*"
            onChange={handleFileChange}
          />
        </Button>

        <Button variant="contained" color="primary" onClick={markStartTime}>
          Mark Start
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={markEndTime}
          disabled={selectedStartTime === null}
        >
          Mark End
        </Button>
      </div>
    </div>
  );
};

export default WaveformVis;
