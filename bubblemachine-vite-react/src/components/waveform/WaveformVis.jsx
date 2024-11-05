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
}) => {
  const waveformRef = useRef(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const regionsPluginRef = useRef(null);
  const hoverPluginRef = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(0.5);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);

  // Zustand store
  const bubbles = useBubbleStore((state) => state.bubbles);
  const updateBubble = useBubbleStore((state) => state.updateBubble);
  const addBubble = useBubbleStore((state) => state.addBubble);

  // Memoized render bubbles function
  const renderBubbles = useCallback(
    throttle(() => {
      if (wavesurfer && regionsPluginRef.current) {
        regionsPluginRef.current.clearRegions();
        bubbles.forEach((bubble) => {
          regionsPluginRef.current.addRegion({
            id: bubble.id,
            start: convertToSeconds(bubble.startTime),
            end: convertToSeconds(bubble.stopTime),
            color: colorToRGB(bubble.color, 0.3),
            drag: false,
            resize: true,
          });
        });
      }
    }, 200),
    [bubbles, wavesurfer]
  );

  // Initialize WaveSurfer
  useEffect(() => {
    if (waveformRef.current && audioFile) {
      // Clean up the previous WaveSurfer instance
      if (wavesurfer) {
        wavesurfer.destroy();
      }

      // Initialize plugins
      regionsPluginRef.current = RegionsPlugin.create({
        dragSelection: false,
      });

      hoverPluginRef.current = HoverPlugin.create({
        lineColor: "#4E9EE7", // Your brand blue
        lineWidth: 2,
        labelBackground: "#555",
        labelColor: "#fff",
        labelSize: "11px",
        formatTimeCallback: formatTime,
        opacity: 0.2, // Start with hover visible
      });

      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#2196f3",
        cursorColor: "#2196f3",
        height: 128,
        plugins: [
          regionsPluginRef.current,
          hoverPluginRef.current,
          ZoomPlugin.create({
            scale: zoomLevel,
            maxZoom: 1000,
            autoCenter: false,
          }),
        ],
      });

      // Set the wavesurfer state before adding event listeners
      setWavesurfer(ws);

      // Attach event listeners to the regions plugin
      regionsPluginRef.current.on("region-updated", (region) => {
        updateBubble(region.id, {
          startTime: formatTime(region.start),
          stopTime: formatTime(region.end),
        });
      });

      // Load the audio file
      ws.load(audioFile);

      // Event listeners
      ws.on("ready", () => {
        const audioDuration = ws.getDuration();
        setDuration(audioDuration);
        setAudioDuration(audioDuration);
        setIsAudioLoaded(true);
        renderBubbles();
      });

      ws.on("redraw", () => {
        setVizWidth(waveformRef.current.clientWidth);
      });

      ws.on("audioprocess", (time) => {
        setCurrentTime(time);
      });

      ws.on("play", () => setIsPlaying(true));
      ws.on("pause", () => setIsPlaying(false));

      ws.on(
        "scroll",
        throttle((visibleStartTime, visibleEndTime) => {
          setVisibleStartTime(formatTime(visibleStartTime));
          setVisibleEndTime(formatTime(visibleEndTime));
        }, 200)
      );

      ws.on(
        "zoom",
        debounce(() => handleZoomCheck(ws), 200)
      );

      return () => {
        ws.destroy();
        setIsAudioLoaded(false);
      };
    }
  }, [audioFile, zoomLevel]);

  // Handle selected bubble
  useEffect(() => {
    if (wavesurfer && selectedBubble) {
      const startSeconds = convertToSeconds(selectedBubble.startTime);
      wavesurfer.seekTo(startSeconds / duration);
      wavesurfer.play();
    }
  }, [selectedBubble, wavesurfer, duration]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setAudioFile(fileUrl);
      setAudioFileName(file.name);
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

  const handlePlayPause = () => wavesurfer?.playPause();
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
      layer: "1",
    });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", paddingTop: 0 }}>
      <div
        style={{ position: "relative", display: "inline-block", width: "100%" }}
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
