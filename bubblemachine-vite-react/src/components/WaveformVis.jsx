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
  const [zoomLevel, setZoomLevel] = useState(50); // Initial zoom level
  const [isWaveSurferReady, setIsWaveSurferReady] = useState(false);

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
      pixelRatio: 1,
      minPxPerSec: 50,
      scrollParent: true, // Enable horizontal scrolling
      plugins: [
        RegionsPlugin.create({
          dragSelection: true,
        }),
        TimelinePlugin.create({
          container: timelineRef.current,
        }),
      ],
    });

    // Set WaveSurfer ready state and initial zoom when ready
    wavesurfer.current.on("ready", () => {
      setIsWaveSurferReady(true);
      wavesurfer.current.zoom(zoomLevel);
    });

    // Cleanup function to destroy the WaveSurfer instance when the component unmounts
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

  // Update zoom when zoomLevel changes
  useEffect(() => {
    if (wavesurfer.current && isWaveSurferReady) {
      wavesurfer.current.zoom(zoomLevel);
    }
  }, [zoomLevel, isWaveSurferReady]);

  // Add event listeners for play/pause, region creation, and mouse wheel zoom/panning
  useEffect(() => {
    if (wavesurfer.current && isWaveSurferReady) {
      const waveformContainer = waveformRef.current;

      const handleWheel = (e) => {
        e.preventDefault(); // Prevent default scrolling

        const deltaX = e.deltaX;
        const deltaY = e.deltaY;

        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (absDeltaX > absDeltaY) {
          // Gesture is primarily horizontal - Pan
          const wrapper = wavesurfer.current.drawer.wrapper;
          if (wrapper) {
            wrapper.scrollLeft += deltaX * 0.5; // Adjust panning sensitivity if needed
          }
        } else {
          // Gesture is primarily vertical - Zoom
          const zoomChange = -deltaY * 0.01; // Adjust multiplier for sensitivity
          setZoomLevel((prevZoomLevel) => {
            let newZoomLevel = prevZoomLevel + zoomChange;
            if (newZoomLevel < 1) newZoomLevel = 1; // Minimum zoom level
            if (newZoomLevel > 500) newZoomLevel = 500; // Maximum zoom level
            return newZoomLevel;
          });
        }
      };

      waveformContainer.addEventListener("wheel", handleWheel);

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
      });

      // Cleanup event listeners on unmount
      return () => {
        wavesurfer.current.unAll();
        waveformContainer.removeEventListener("wheel", handleWheel);
      };
    }
  }, [isWaveSurferReady]);

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

      {/* Zoom Slider (Optional) */}
      {/* <div style={{ margin: "20px 0" }}>
        <label htmlFor="zoomSlider">Zoom: </label>
        <input
          id="zoomSlider"
          type="range"
          min="1"
          max="500"
          value={zoomLevel}
          onChange={(e) => {
            const newZoomLevel = Number(e.target.value);
            setZoomLevel(newZoomLevel);
          }}
        />
      </div> */}

      <div id="waveform" ref={waveformRef} />
      <div id="timeline" ref={timelineRef} />
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
};

export default WaveformVis;
