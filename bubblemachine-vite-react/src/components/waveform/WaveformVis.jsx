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

  // Initializing WaveSurfer with plugins, without the timeline
  useEffect(() => {
    if (waveformRef.current) {
      regionsPluginRef.current = RegionsPlugin.create({ dragSelection: false });
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#2196f3",
        cursorColor: "#2196f3",
        height: 128,
        plugins: [
          regionsPluginRef.current,
          HoverPlugin.create({
            lineColor: "#ff0000",
            lineWidth: 2,
            labelBackground: "#555",
            labelColor: "#fff",
            labelSize: "11px",
            formatTimeCallback: (seconds) => formatTime(seconds),
          }),
          ZoomPlugin.create({
            scale: zoomLevel,
            maxZoom: 1000,
            autoCenter: false,
          }),
        ],
      });

      setWavesurfer(ws);

      ws.on("ready", () => {
        const audioDuration = ws.getDuration();
        setDuration(audioDuration);
        setAudioDuration(audioDuration);
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

      regionsPluginRef.current.on("region-updated", (region) => {
        const id = region.id;
        updateBubble(id, {
          startTime: formatTime(region.start),
          stopTime: formatTime(region.end),
        });
      });

      return () => ws.destroy();
    }
  }, [zoomLevel]);

  // Function to check and handle zoom rendering
  const handleZoomCheck = (ws) => {
    if (waveformRef.current) {
      const rect = waveformRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        ws.zoom(zoomLevel);
      }
    }
  };

  useEffect(() => {
    if (wavesurfer && audioFile) wavesurfer.load(audioFile);
  }, [audioFile, wavesurfer]);

  useEffect(() => {
    if (wavesurfer && selectedBubble) {
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
      color: "Blue",
      layer: 1,
    });
  };

  const handlePlayPause = () => {
    if (wavesurfer) wavesurfer.playPause();
  };

  const handleRestart = () => {
    if (wavesurfer) {
      wavesurfer.seekTo(0);
      setCurrentTime(0);
    }
  };

  const handleZoomChange = (newZoomLevel) => {
    setZoomLevel(newZoomLevel);
    if (wavesurfer) {
      wavesurfer.zoom(newZoomLevel);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", paddingTop: 0 }}>
      <div
        style={{ position: "relative", display: "inline-block", width: "100%" }}
      >
        <div id="waveform" ref={waveformRef} style={{ touchAction: "none" }} />
      </div>

      {/* Custom progress bar with scrubbing */}
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        wavesurfer={wavesurfer}
      />

      {/* Timestamped Comment Display */}
      <div style={{ position: "relative", marginTop: "10px" }}>
        <CommentDisplay wavesurfer={wavesurfer} />
      </div>

      {/* Audio and Zoom controls */}
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
