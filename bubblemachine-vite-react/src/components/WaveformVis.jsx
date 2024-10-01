import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline";
import { useGesture } from "@use-gesture/react";

const WaveformVis = () => {
  const waveformRef = useRef(null);
  const timelineRef = useRef(null);
  const progressRef = useRef(null);
  const wavesurfer = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFileUrl, setAudioFileUrl] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(50); // Initial zoom level
  const [isWaveSurferReady, setIsWaveSurferReady] = useState(false);
  const [cursorTime, setCursorTime] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  // Format time in minutes:seconds:milliseconds
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00:000";
    const minutes = Math.floor(time / 60).toString();
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    const milliseconds = Math.floor((time * 1000) % 1000)
      .toString()
      .padStart(3, "0");
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  // Gesture handling using react-use-gesture
  const bind = useGesture(
    {
      onWheel: ({ delta: [dx, dy], event }) => {
        event.preventDefault();

        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (absDy > absDx) {
          // Vertical scrolling - Zoom
          const zoomChange = -dy * 0.5; // Adjust sensitivity
          setZoomLevel((prevZoomLevel) => {
            let newZoomLevel = prevZoomLevel + zoomChange;
            return Math.min(Math.max(newZoomLevel, 1), 500);
          });
        } else {
          // Horizontal scrolling - Pan
          const wrapper = wavesurfer.current.drawer.wrapper;
          if (wrapper) {
            wrapper.scrollLeft += dx; // Adjust sensitivity as needed
          }
        }
      },
    },
    {
      eventOptions: { passive: false }, // Allows event.preventDefault()
    }
  );

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
      autoScroll: false, // Disable auto-scrolling during playback
      autoCenter: false, // Disable auto-centering when zooming or seeking
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
      setDuration(wavesurfer.current.getDuration());
    });

    // Update current time during playback
    wavesurfer.current.on("audioprocess", (time) => {
      setCurrentTime(time);
    });

    wavesurfer.current.on("seek", () => {
      setCurrentTime(wavesurfer.current.getCurrentTime());
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

  // Handle mouse move over waveform to show cursor time
  const handleMouseMove = (e) => {
    if (!wavesurfer.current || !wavesurfer.current.drawer) return;

    const bbox = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bbox.left;

    const duration = wavesurfer.current.getDuration();
    const width = wavesurfer.current.drawer.width;
    const time = (x / width) * duration;

    setCursorTime(time);
    setCursorPosition({ x });
  };

  const handleMouseLeave = () => {
    setCursorTime(null);
  };

  // Handle progress bar click for seeking
  const handleProgressClick = (e) => {
    if (!wavesurfer.current || !wavesurfer.current.drawer) return;

    const bbox = progressRef.current.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const ratio = x / bbox.width;

    wavesurfer.current.seekTo(ratio);
    setCurrentTime(ratio * duration);
  };

  // Add event listeners for play/pause and region creation
  useEffect(() => {
    if (wavesurfer.current && isWaveSurferReady) {
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

      <div
        id="waveform"
        ref={waveformRef}
        {...bind()}
        style={{ touchAction: "none", position: "relative" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Display cursor time */}
        {cursorTime !== null && (
          <div
            style={{
              position: "absolute",
              left: `${cursorPosition.x}px`,
              top: "0px",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "#fff",
              padding: "2px 4px",
              fontSize: "12px",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {formatTime(cursorTime)}
          </div>
        )}
      </div>
      <div id="timeline" ref={timelineRef} />

      {/* Progress bar */}
      <div
        style={{
          position: "relative",
          height: "10px",
          backgroundColor: "#ccc",
          cursor: "pointer",
          marginTop: "10px",
        }}
        onClick={handleProgressClick}
        ref={progressRef}
      >
        <div
          style={{
            width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
            height: "100%",
            backgroundColor: "#2196f3",
          }}
        />
      </div>

      {/* Display current time and duration */}
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <span>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <button onClick={handlePlayPause} style={{ marginTop: "10px" }}>
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default WaveformVis;
