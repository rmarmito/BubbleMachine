// src/components/WaveformVis.jsx
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.js";
import HoverPlugin from "wavesurfer.js/dist/plugins/hover.js";
import WaveformControls from "./WaveformControls";
import ProgressBar from "./ProgressBar";
import Timeline from "./Timeline";
import RegionMarkers from "./RegionMarkers";

const WaveformVis = () => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);

  // Initialize WaveSurfer instance
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
          HoverPlugin.create({ formatTimeCallback: formatTime }),
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

  const handleFileChange = (file) => {
    setAudioFile(URL.createObjectURL(file));
  };

  // Functions to mark start and end times
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
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div id="waveform" ref={waveformRef} />
      <Timeline />
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        wavesurfer={wavesurfer}
      />
      <RegionMarkers
        wavesurfer={wavesurfer}
        markStartTime={markStartTime}
        markEndTime={markEndTime}
        selectedStartTime={selectedStartTime}
        selectedEndTime={selectedEndTime}
      />
      <WaveformControls onFileChange={handleFileChange} isPlaying={isPlaying} />
    </div>
  );
};

const formatTime = (time) => {
  if (isNaN(time)) return "0:00.000";
  const minutes = Math.floor(time / 60).toString();
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  const milliseconds = Math.floor((time % 1) * 1000)
    .toString()
    .padStart(3, "0");
  return `${minutes}:${seconds}.${milliseconds}`;
};

export default WaveformVis;
