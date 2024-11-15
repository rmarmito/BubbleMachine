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
  const [scrollLeft, setScrollLeft] = useState(0);

  const bubbles = useBubbleStore((state) => state.bubbles);
  const updateBubble = useBubbleStore((state) => state.updateBubble);
  const addBubble = useBubbleStore((state) => state.addBubble);

  // Update regions
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

  // Handle scroll updates
  const handleScroll = useCallback(
    throttle(() => {
      if (!wavesurfer || !duration || !waveformRef.current) return;

      const containerWidth = waveformRef.current.clientWidth;
      const scrollPosition = wavesurfer.getScroll();
      const currentZoomSetting =
        zoomLevel === ZOOM_SETTINGS.FULL.level
          ? ZOOM_SETTINGS.FULL
          : ZOOM_SETTINGS.HALF;
      const secondsPerPixel =
        duration / (containerWidth * currentZoomSetting.level);

      const visibleStartSeconds = scrollPosition * secondsPerPixel;
      const visibleEndSeconds =
        visibleStartSeconds + containerWidth * secondsPerPixel;

      setVisibleStartTime?.(formatTime(Math.max(0, visibleStartSeconds)));
      setVisibleEndTime?.(formatTime(Math.min(duration, visibleEndSeconds)));
      setScrollLeft(scrollPosition);
    }, 16),
    [wavesurfer, duration, zoomLevel, setVisibleStartTime, setVisibleEndTime]
  );

  // Calculate zoom
  const calculateZoom = useCallback(
    (zoomSetting) => {
      if (!wavesurfer || !waveformRef.current) return;

      try {
        const containerWidth = waveformRef.current.clientWidth;
        const currentDuration = wavesurfer.getDuration() || duration;
        if (!currentDuration) return;

        const zoomValue =
          (containerWidth / currentDuration) * zoomSetting.level;

        // Apply zoom
        wavesurfer.zoom(zoomValue);

        // Get the current scroll position
        const scrollPosition = wavesurfer.getScroll();
        setScrollLeft(scrollPosition);

        // Calculate visible time range based on zoom and scroll
        const secondsPerPixel =
          currentDuration / (containerWidth * zoomSetting.level);
        const visibleStartSeconds = scrollPosition * secondsPerPixel;
        const visibleEndSeconds =
          visibleStartSeconds + containerWidth * secondsPerPixel;

        // Update visible time range
        setVisibleStartTime?.(formatTime(Math.max(0, visibleStartSeconds)));
        setVisibleEndTime?.(
          formatTime(Math.min(currentDuration, visibleEndSeconds))
        );

        // Update regions
        updateRegions();
      } catch (error) {
        console.error("Error during zoom:", error);
      }
    },
    [
      wavesurfer,
      updateRegions,
      setVisibleStartTime,
      setVisibleEndTime,
      duration,
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

      if (waveformRef.current) {
        setVizWidth?.(waveformRef.current.clientWidth);
      }

      // Initialize zoom after duration is set
      calculateZoom(ZOOM_SETTINGS.FULL);
    });

    ws.on("scroll", handleScroll);
    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on(
      "audioprocess",
      throttle((time) => setCurrentTime(time), 16)
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

  // Handle window resize
  useEffect(() => {
    const handleResize = throttle(() => {
      if (!wavesurfer || !waveformRef.current) return;

      // Update container width
      const containerWidth = waveformRef.current.clientWidth;
      setVizWidth?.(containerWidth);

      // Recalculate zoom based on new container width
      const currentZoomSetting =
        zoomLevel === ZOOM_SETTINGS.FULL.level
          ? ZOOM_SETTINGS.FULL
          : ZOOM_SETTINGS.HALF;

      calculateZoom(currentZoomSetting);
    }, 100);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [wavesurfer, zoomLevel]);
  // Handle zoom toggle
  const toggleZoom = useCallback(() => {
    const newZoomSetting =
      zoomLevel === ZOOM_SETTINGS.FULL.level
        ? ZOOM_SETTINGS.HALF
        : ZOOM_SETTINGS.FULL;

    setZoomLevel(newZoomSetting.level);
    calculateZoom(newZoomSetting);
  }, [zoomLevel, calculateZoom]);

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
