import React, { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import HoverPlugin from "wavesurfer.js/dist/plugins/hover.js";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.js";
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
import debounce from "lodash/debounce";

const WaveformVis = ({
  setAudioDuration,
  setVizWidth,
  setAudioFileName,
  setVisibleStartTime,
  setVisibleEndTime,
  selectedBubble,
  setIsAudioLoaded,
  setSelectedBubble, // Add this prop
}) => {
  const waveformRef = useRef(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const regionsPluginRef = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(0.5);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);

  // Zustand store for managing bubbles
  const bubbles = useBubbleStore((state) => state.bubbles);
  const updateBubble = useBubbleStore((state) => state.updateBubble);
  const addBubble = useBubbleStore((state) => state.addBubble);

  // Memoized function to render bubbles only when bubbles change
  const renderBubbles = useCallback(
    throttle(() => {
      if (wavesurfer && regionsPluginRef.current) {
        regionsPluginRef.current.clearRegions();
        bubbles.forEach((bubble) => {
          regionsPluginRef.current.addRegion({
            id: bubble.id,
            start: convertToSeconds(bubble.startTime),
            end: convertToSeconds(bubble.stopTime),
            color: colorToRGB(bubble.color),
            drag: false,
            resize: true,
          });
        });
      }
    }, 200),
    [bubbles, wavesurfer]
  );

  // Initialize WaveSurfer with plugins
  useEffect(() => {
    if (waveformRef.current) {
      // Clean up previous instance
      if (wavesurfer) {
        wavesurfer.destroy();
      }

      regionsPluginRef.current = RegionsPlugin.create({ dragSelection: false });

      const hoverPlugin = HoverPlugin.create({
        lineColor: "#ff0000", // Set hover line color to red
        lineWidth: 2,
        labelBackground: "#555",
        labelColor: "#fff",
        labelSize: "11px",
        formatTimeCallback: formatTime,
      });

      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#4E9EE7", // Set played waveform color to your brand blue
        cursorColor: "#4E9EE7",
        height: 128,
        plugins: [
          regionsPluginRef.current,
          hoverPlugin,
          ZoomPlugin.create({
            scale: zoomLevel,
            maxZoom: 1000,
            autoCenter: false,
          }),
        ],
      });

      setWavesurfer(ws);

      // Event listeners
      ws.on("ready", () => {
        const audioDuration = ws.getDuration();
        setDuration(audioDuration);
        setAudioDuration && setAudioDuration(audioDuration);
        setIsAudioLoaded && setIsAudioLoaded(true);
        renderBubbles();
      });

      ws.on("redraw", () => {
        setVizWidth && setVizWidth(waveformRef.current.clientWidth);
      });

      ws.on("audioprocess", (time) => {
        setCurrentTime(time);
      });

      ws.on("play", () => setIsPlaying(true));

      ws.on("pause", () => setIsPlaying(false));

      ws.on(
        "scroll",
        throttle((visibleStartTime, visibleEndTime) => {
          setVisibleStartTime &&
            setVisibleStartTime(formatTime(visibleStartTime));
          setVisibleEndTime && setVisibleEndTime(formatTime(visibleEndTime));
        }, 200)
      );

      ws.on(
        "zoom",
        debounce(() => handleZoomCheck(ws), 200)
      );

      regionsPluginRef.current.on("region-updated", (region) => {
        updateBubble(region.id, {
          startTime: formatTime(region.start),
          stopTime: formatTime(region.end),
        });
      });

      return () => {
        ws.destroy();
        setIsAudioLoaded && setIsAudioLoaded(false);
      };
    }
  }, [zoomLevel]);

  // Handle audio file loading
  useEffect(() => {
    if (wavesurfer && audioFile) {
      wavesurfer.load(audioFile);
    }
  }, [audioFile, wavesurfer]);

  // Handle selected bubble
  useEffect(() => {
    if (wavesurfer) {
      if (selectedBubble) {
        // Clear existing regions and add selected bubble's region
        regionsPluginRef.current.clearRegions();
        const { startTime, stopTime, color } = selectedBubble;

        regionsPluginRef.current.addRegion({
          id: selectedBubble.id,
          start: convertToSeconds(startTime),
          end: convertToSeconds(stopTime),
          color: colorToRGB(color),
          drag: false,
          resize: true,
        });

        // Set the playback to the bubble's start time and play
        const startSeconds = convertToSeconds(startTime);
        const seekRatio = startSeconds / duration;
        wavesurfer.seekTo(seekRatio);
        wavesurfer.play();
      } else {
        // Clear regions when no bubble is selected
        regionsPluginRef.current.clearRegions();
      }
    }
  }, [selectedBubble, wavesurfer, duration]);

  // Deselect bubble when clicking outside the waveform
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (waveformRef.current && !waveformRef.current.contains(event.target)) {
        // Clicked outside the waveform
        setSelectedBubble(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside); // For mobile devices

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [setSelectedBubble]);

  // Prevent deselecting when clicking inside the waveform
  useEffect(() => {
    const waveformElement = waveformRef.current;

    const handleWaveformClick = (event) => {
      event.stopPropagation();
    };

    if (waveformElement) {
      waveformElement.addEventListener("mousedown", handleWaveformClick);
      waveformElement.addEventListener("touchstart", handleWaveformClick);
    }

    return () => {
      if (waveformElement) {
        waveformElement.removeEventListener("mousedown", handleWaveformClick);
        waveformElement.removeEventListener("touchstart", handleWaveformClick);
      }
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setAudioFile(fileUrl);
      setAudioFileName && setAudioFileName(file.name);
      setIsAudioLoaded && setIsAudioLoaded(false);
    }
  };

  const handleZoomCheck = useCallback(
    (ws) => {
      if (waveformRef.current) {
        const rect = waveformRef.current.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          ws.zoom(zoomLevel);
        }
      }
    },
    [zoomLevel]
  );

  const handlePlayPause = () => {
    if (wavesurfer) wavesurfer.playPause();
  };

  const handleRestart = () => {
    if (wavesurfer) {
      wavesurfer.seekTo(0);
      setCurrentTime(0);
    }
  };

  const markStartTime = () => {
    if (wavesurfer) setSelectedStartTime(wavesurfer.getCurrentTime());
  };

  const markEndTime = () => {
    if (wavesurfer && selectedStartTime !== null) {
      const time = wavesurfer.getCurrentTime();
      setSelectedEndTime(time);
      createRegion(selectedStartTime, time);
    }
  };

  const createRegion = (start, end) => {
    if (start > end) [start, end] = [end, start];
    const id = createID();
    addBubble({
      id,
      startTime: formatTime(start),
      stopTime: formatTime(end),
      color: "#4E9EE7",
      layer: 1,
    });
  };

  return (
    <div
      style={{ padding: "20px", textAlign: "center", paddingTop: 0 }}
      onClick={() => setSelectedBubble(null)} // Deselect when clicking outside
    >
      <div
        style={{ position: "relative", display: "inline-block", width: "100%" }}
        onClick={(e) => e.stopPropagation()} // Prevent deselect when clicking inside
      >
        <div id="waveform" ref={waveformRef} style={{ touchAction: "none" }} />
      </div>

      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        wavesurfer={wavesurfer}
      />

      <div style={{ position: "relative", marginTop: "10px" }}>
        <CommentDisplay wavesurfer={wavesurfer} />
      </div>

      <div style={{ marginTop: "10px" }}>
        <Button variant="contained" color="primary" onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRestart}
          style={{ marginLeft: "10px" }}
        >
          Start from Beginning
        </Button>
        <input
          accept="audio/*"
          id="audio-file-input"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <label htmlFor="audio-file-input">
          <Button
            variant="contained"
            color="primary"
            component="span"
            style={{ marginLeft: "10px" }}
          >
            Upload Audio
          </Button>
        </label>
        <Button
          variant="contained"
          color="primary"
          onClick={markStartTime}
          style={{ marginLeft: "10px" }}
        >
          Mark Start Time
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={markEndTime}
          disabled={selectedStartTime === null}
          style={{ marginLeft: "10px" }}
        >
          Mark End Time
        </Button>
      </div>
    </div>
  );
};

export default WaveformVis;
