// src/pages/WaveformVis.jsx
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline";

const WaveformVis = () => {
  const waveformRef = useRef(null);
  const timelineRef = useRef(null);
  const wavesurfer = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFileUrl, setAudioFileUrl] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (audioFileUrl) {
        URL.revokeObjectURL(audioFileUrl);
      }
      const fileUrl = URL.createObjectURL(file);
      setAudioFile(fileUrl);
      setAudioFileUrl(fileUrl);
    }
  };

  // Initialize WaveSurfer instance when the component mounts
  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ddd",
      progressColor: "#2196f3",
      cursorColor: "#2196f3",
      responsive: true,
      height: 128,
      normalize: true,
      partialRender: true,
      plugins: [
        RegionsPlugin.create({
          dragSelection: true,
        }),
        TimelinePlugin.create({
          container: timelineRef.current,
        }),
      ],
    });

    // Cleanup function to destroy the wavesurfer instance when component unmounts
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

  // Add event listeners for play/pause and region creation
  useEffect(() => {
    if (wavesurfer.current) {
      // Update play/pause state
      wavesurfer.current.on("play", () => {
        setIsPlaying(true);
      });
      wavesurfer.current.on("pause", () => {
        setIsPlaying(false);
      });

      // Handle region creation
      wavesurfer.current.on("region-created", (region) => {
        console.log("Region created:", region);
        // Additional logic for regions can be added here
      });

      // Cleanup event listeners on unmount
      return () => {
        wavesurfer.current.unAll();
      };
    }
  }, []);

  // Cleanup audio file URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioFileUrl) {
        URL.revokeObjectURL(audioFileUrl);
      }
    };
  }, [audioFileUrl]);

  // Play/pause functionality
  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <div id="waveform" ref={waveformRef} />
      <div id="timeline" ref={timelineRef} />
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
};

export default WaveformVis;
