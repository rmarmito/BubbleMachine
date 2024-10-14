import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline";
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import { useGesture } from "@use-gesture/react";
import useBubbleStore from "../state";

const WaveformVis = ({setAudioDuration, setVizWidth}) => {
  const waveformRef = useRef(null);
  const timelineRef = useRef(null);
  const progressRef = useRef(null);
  const wavesurfer = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wasPlayingBeforeDrag, setWasPlayingBeforeDrag] = useState(false);
  const [audioFileUrl, setAudioFileUrl] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(50); // Initial zoom level
  const [isWaveSurferReady, setIsWaveSurferReady] = useState(false);
  const [cursorTime, setCursorTime] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false); // Dragging state

  const bubbles = useBubbleStore((state) => state.bubbles);
  const addBubble = useBubbleStore((state) => state.addBubble);
  const updateBubble = useBubbleStore((state) => state.updateBubble);

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

      // Set zoom level to the most zoomed-out (1) when a new file is loaded
      setZoomLevel(1);
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

  // Gesture handling using react-use-gesture for waveform
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
            return Math.min(Math.max(newZoomLevel, 1), 500); // Zoom bounds: 1 to 500
          });
        } else {
          // Horizontal scrolling - Pan
          const wrapper = wavesurfer.current.drawer.wrapper;
          if (wrapper) {
            wrapper.scrollLeft += dx; // Adjust sensitivity as needed
          }
        }
      },
      onDragStart: ({ event }) => {
        event.preventDefault();
        if (wavesurfer.current && isWaveSurferReady) {
          if (isPlaying) {
            wavesurfer.current.pause();
          }
          setIsDragging(true);
        }
      },
      onDrag: ({ movement: [mx, my], xy: [x, y], event }) => {
        event.preventDefault();
        if (wavesurfer.current && isWaveSurferReady && isDragging) {
          const bbox = waveformRef.current.getBoundingClientRect();
          const relativeX =
            x - bbox.left + wavesurfer.current.drawer.wrapper.scrollLeft;
          const duration = wavesurfer.current.getDuration();
          
          const width = wavesurfer.current.drawer.width;
          const time = (relativeX / width) * duration;

          // Use seekTo instead of setCurrentTime
          wavesurfer.current.seekTo(time / duration);
          setCurrentTime(time);
        }
      },
      onDragEnd: ({ event }) => {
        event.preventDefault();
        if (wavesurfer.current && isWaveSurferReady) {
          if (isPlaying) {
            wavesurfer.current.play();
          }
          setIsDragging(false);
        }
      },
    },
    {
      eventOptions: { passive: false },
      drag: {
        threshold: 0,
      },
    }
  );

  // Gesture handling for the progress bar
  const progressBind = useGesture(
    {
      onDrag: ({ down, movement: [mx], xy: [x, y], event }) => {
        event.preventDefault();
        event.stopPropagation(); // Prevent event from bubbling up to waveform

        if (!wavesurfer.current || !progressRef.current) return;

        const bbox = progressRef.current.getBoundingClientRect();
        let posX = x - bbox.left;
        posX = Math.max(0, Math.min(posX, bbox.width)); // Clamp x between 0 and width

        const ratio = posX / bbox.width;
        const newTime = ratio * duration;

        // Use seekTo instead of setCurrentTime
        wavesurfer.current.seekTo(ratio);
        setCurrentTime(newTime);

        // Do not alter playback state when seeking via progress bar
        // If you want to maintain playback state, no additional action is needed
      },
      onClick: ({ event }) => {
        event.preventDefault();
        event.stopPropagation(); // Prevent event from bubbling up to waveform

        if (!wavesurfer.current || !progressRef.current) return;

        const bbox = progressRef.current.getBoundingClientRect();
        let posX = event.clientX - bbox.left;
        posX = Math.max(0, Math.min(posX, bbox.width)); // Clamp x between 0 and width

        const ratio = posX / bbox.width;
        const newTime = ratio * duration;

        // Use seekTo instead of setCurrentTime
        wavesurfer.current.seekTo(ratio);
        setCurrentTime(newTime);

        // Do not alter playback state when seeking via progress bar
      },
    },
    {
      eventOptions: { passive: false },
    }
  );

  const regions = RegionsPlugin.create({dragSelection: true, drag: true, resize: true, });

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
      minPxPerSec: 50, // Minimum pixels per second (controls zoom level)
      scrollParent: true, // Enable horizontal scrolling
      autoScroll: false, // Disable auto-scrolling during playback
      autoCenter: false, // Disable auto-centering when zooming or seeking
      plugins: [
        regions,
        TimelinePlugin.create({ container: timelineRef.current }),
        Hover.create({
          formatTimeCallback: ((seconds) => formatTime(seconds)),
          lineColor: '#ff0000',
          lineWidth: 1,
          labelBackground: '#555',
          labelColor: '#fff',
          labelSize: '11px',
        }),
      ],
    });



    // Set WaveSurfer ready state and initial zoom when ready
    wavesurfer.current.on("ready", () => {
      console.log("WaveSurfer is ready");
      setIsWaveSurferReady(true);
      setDuration(wavesurfer.current.getDuration());
      setAudioDuration(wavesurfer.current.getDuration());
      if (wavesurfer.current && waveformRef.current.clientWidth) {
          const containerWidth = waveformRef.current.clientWidth;
          setVizWidth(containerWidth);
      }
      bubbles.map((bubble) => {
        console.log('Region added', convertToSeconds(bubble.startTime), convertToSeconds(bubble.stopTime), bubble.bubbleName, colorToRGB(bubble.color));
          regions.addRegion({
            start: convertToSeconds(bubble.startTime),
            end: convertToSeconds(bubble.stopTime),
            content: bubble.bubbleName,
            color: colorToRGB(bubble.color),
            drag: false,
            resize: true,        
          });
      });
      // Apply the default zoom level (1) after the audio is loaded
      wavesurfer.current.zoom(1);
    });



    wavesurfer.current.on("redraw", () => {
      if (wavesurfer.current && waveformRef.current.clientWidth) {
        const containerWidth = waveformRef.current.clientWidth;
        setVizWidth(containerWidth);
      }
    });

    // Update current time during playback
    wavesurfer.current.on("audioprocess", (time) => {
      setCurrentTime(time);
    });

    // Update current time when seeking
    wavesurfer.current.on("seek", () => {
      setCurrentTime(wavesurfer.current.getCurrentTime());
    });

    // Update play/pause state
    wavesurfer.current.on("play", () => {
      setIsPlaying(true);
    });

    wavesurfer.current.on("pause", () => {
      setIsPlaying(false);
    });

    wavesurfer.current.on("audioprocess", () => {
      bubbles.map((bubble) => {
        console.log('Region added', convertToSeconds(bubble.startTime), convertToSeconds(bubble.stopTime), bubble.bubbleName, colorToRGB(bubble.color));
          regions.addRegion({
            start: convertToSeconds(bubble.startTime),
            end: convertToSeconds(bubble.stopTime),
            content: bubble.bubbleName,
            color: colorToRGB(bubble.color),
            drag: false,
            resize: true,        
          });
      });
      regions.clearRegions();
    });
    
    
    // Cleanup function to destroy the WaveSurfer instance when the component unmounts
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        setIsWaveSurferReady(false);
      }
    };
  }, [bubbles]);
  
  // Display all bubbles using .map function
/*  useEffect(() => {
    if (wavesurfer.current && isWaveSurferReady) {
      bubbles.map((bubble) => {
            regions.addRegion({
            start: convertToSeconds(bubble.startTime),
            end: convertToSeconds(bubble.stopTime),
            content: bubble.bubbleName,
            color: colorToRGB(bubble.color),
            drag: false,
            resize: true,        
          });
      });     
    }
  }, [bubbles, isWaveSurferReady]);*/

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
/*  const handleMouseMove = (e) => {
    if (!wavesurfer.current || !wavesurfer.current.drawer) return;

    const bbox = e.currentTarget.getBoundingClientRect();
    const x =
      e.clientX - bbox.left + wavesurfer.current.drawer.wrapper.scrollLeft;

    const duration = wavesurfer.current.getDuration();
    const width = wavesurfer.current.drawer.width;
    const time = (x / width) * duration;

    setCursorTime(time);
    setCursorPosition({ x: x - wavesurfer.current.drawer.wrapper.scrollLeft });
  };

  const handleMouseLeave = () => {
    setCursorTime(null);
  };
*/
  // Play/pause functionality
  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
    }
  };

  const colorToRGB = (color) => {
    const colors = {
        Red: 'rgb(255, 0, 0, 0.2)',
        Green: 'rgb(0, 255, 0, 0.2)',
        Blue: 'rgb(0, 0, 255, 0.2)',
        Yellow: 'rgb(255, 255, 0, 0.2)',
        Black: 'rgb(0, 0, 0, 0.2)',
        White: 'rgb(255, 255, 255, 0.2)',
        Purple: 'rgb(128, 0, 128, 0.2)',
        Orange: 'rgb(255, 165, 0, 0.2)',
        Pink: 'rgb(255, 192, 203, 0.2)',
        Brown: 'rgb(165, 42, 42, 0.2)',
    };

    return colors[color] || color; // Return the hex code if found, otherwise return the original color
  };

  const convertToSeconds = (time) => {
    if (!time) return 0; // Return 0 if time is undefined or null
    const [minutes, seconds, milliseconds] = time.split(':').map(Number);
    return (minutes * 60) + (seconds) + (milliseconds/1000);
};

  return (
    <div style={{ padding: "20px" }}>
      

      <div
        id="waveform"
        ref={waveformRef}
        {...bind()}
        style={{ touchAction: "none", position: "relative" }}
        //onMouseMove={handleMouseMove}
        //onMouseLeave={handleMouseLeave}
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
        {...progressBind()}
        style={{
          position: "relative",
          height: "10px",
          backgroundColor: "#ccc",
          cursor: "pointer",
          marginTop: "10px",
        }}
        ref={progressRef}
      >
        <div
          style={{
            width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
            height: "100%",
            backgroundColor: "#2196f3",
            pointerEvents: "none", // Ensure clicks pass through
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
      <input type="file" accept="audio/*" onChange={handleFileChange} />
    </div>
  );
};


/* HEXCODE to RGB conversion function
const convertToRGB = (color) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  const rgb = {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
};*/

export default WaveformVis;
