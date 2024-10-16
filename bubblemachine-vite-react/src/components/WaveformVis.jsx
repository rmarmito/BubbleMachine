import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.js";
import HoverPlugin from "wavesurfer.js/dist/plugins/hover.js";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.js";
import { Button } from "@mui/material";
import ProgressBar from "./ProgressBar";

import { formatTime } from "../Helpers"; // Import the formatTime helper function

const WaveformVis = () => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [isDragging, setIsDragging] = useState(false); // Track dragging state

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
            lineColor: "#ff0000",
            lineWidth: 2,
            labelBackground: "#555",
            labelColor: "#fff",
            labelSize: "11px",
            formatTimeCallback: (seconds) => formatTime(seconds), // Format with ms accuracy
          }),
          ZoomPlugin.create({
            scale: 0.5,
            maxZoom: 1000,
            autoCenter: false,
          }),
        ],
      });

      wavesurfer.current.on("ready", () => {
        setDuration(wavesurfer.current.getDuration());
      });

      wavesurfer.current.on("audioprocess", (time) => {
        if (!isDragging) {
          setCurrentTime(time); // Update current time only if not dragging
        }
      });

      wavesurfer.current.on("play", () => {
        setIsPlaying(true);
      });

      wavesurfer.current.on("pause", () => {
        setIsPlaying(false);
      });
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, []);

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

  const markStartTime = () => {
    if (wavesurfer.current) {
      const time = wavesurfer.current.getCurrentTime();
      console.log("Marking start time:", time);
      setSelectedStartTime(time);
      setSelectedEndTime(null); // Reset end time
    }
  };

  const markEndTime = () => {
    if (wavesurfer.current && selectedStartTime !== null) {
      const time = wavesurfer.current.getCurrentTime();
      console.log("Marking end time:", time);
      setSelectedEndTime(time);
      createRegion(selectedStartTime, time);
    }
  };

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

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <div id="waveform" ref={waveformRef} style={{ touchAction: "none" }} />

      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        wavesurfer={wavesurfer}
      />

      <div style={{ marginTop: "10px" }}>
        <span>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <div />
        <Button variant="contained" color="primary" onClick={markStartTime}>
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

        <input
          accept="audio/*"
          id="audio-file-input"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <div />
        <label htmlFor="audio-file-input">
          <Button variant="contained" color="primary" component="span">
            Upload Audio
          </Button>
        </label>

        <Button variant="contained" color="primary" onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </Button>

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


export default WaveformVis;
