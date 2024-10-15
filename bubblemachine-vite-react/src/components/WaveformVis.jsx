// src/components/WaveformVis.jsx
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.js";
import HoverPlugin from "wavesurfer.js/dist/plugins/hover.js";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.js"; // Import Zoom Plugin
import { Button } from "@mui/material";
import { useGesture } from "@use-gesture/react";

const WaveformVis = () => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);

  // Initialize WaveSurfer instance when the component mounts
  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#2196f3",
        cursorColor: "#2196f3",
        height: 128,
        plugins: [
          RegionsPlugin.create({ dragSelection: false }),
          TimelinePlugin.create({ container: waveformRef.current }),
          HoverPlugin.create({
            formatTimeCallback: (seconds) => formatTime(seconds),
          }),
          ZoomPlugin.create({
            // Initialize Zoom Plugin
            scale: 0.5,
            maxZoom: 1000,
          }),
        ],
      });

      wavesurfer.current.on("ready", () => {
        setDuration(wavesurfer.current.getDuration());
      });

      wavesurfer.current.on("audioprocess", (time) => {
        setCurrentTime(time);
      });

      wavesurfer.current.on("play", () => setIsPlaying(true));
      wavesurfer.current.on("pause", () => setIsPlaying(false));
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, []);

  // Load audio file when audioFile state changes
  useEffect(() => {
    if (wavesurfer.current && audioFile) {
      wavesurfer.current.load(audioFile);
    }
  }, [audioFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setAudioFile(fileUrl);
    }
  };

  // Mark start time
  const markStartTime = () => {
    if (wavesurfer.current) {
      const time = wavesurfer.current.getCurrentTime();
      console.log("Marking start time:", time);
      setSelectedStartTime(time);
      setSelectedEndTime(null); // Reset end time
    }
  };

  // Mark end time and create region
  const markEndTime = () => {
    if (wavesurfer.current && selectedStartTime !== null) {
      const time = wavesurfer.current.getCurrentTime();
      console.log("Marking end time:", time);
      setSelectedEndTime(time);
      createRegion(selectedStartTime, time);
    }
  };

  // Create a region based on start and end times
  const createRegion = (start, end) => {
    if (start > end) [start, end] = [end, start];

    wavesurfer.current.addRegion({
      start,
      end,
      loop: true,
      color: "rgba(0,123,255,0.5)",
    });

    console.log("Created region:", { start, end });
  };

  // Handle play/pause functionality
  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div id="waveform" ref={waveformRef} style={{ touchAction: "none" }} />

      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <span>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <Button variant="contained" color="primary" onClick={markStartTime}>
          Mark Start Time
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={markEndTime}
          disabled={selectedStartTime === null}
        >
          Mark End Time
        </Button>

        <Button variant="contained" color="primary" onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </Button>

        <input
          accept="audio/*"
          id="audio-file-input"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <label htmlFor="audio-file-input">
          <Button variant="contained" color="primary" component="span">
            Upload Audio
          </Button>
        </label>

        {/* Display selected start and end times */}
        {selectedStartTime !== null && (
          <div>
            <span>Marked Start Time: {formatTime(selectedStartTime)}</span>
            {selectedEndTime !== null && (
              <span>, End Time: {formatTime(selectedEndTime)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Format time in minutes and seconds
const formatTime = (time) => {
  if (isNaN(time)) return "0:00.000";
  const minutes = Math.floor(time / 60).toString();
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default WaveformVis;
