import React, { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import HoverPlugin from "wavesurfer.js/dist/plugins/hover.js";
import { Box, IconButton, Stack } from "@mui/material";
import {
  PlayArrow,
  Pause,
  RestartAlt,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material";
import ProgressBar from "./Progressbar";
import CommentDisplay from "../timestamped-comments/CommentDisplay.jsx";
import {
  formatTime,
  convertToSeconds,
  colorToRGB,
} from "../../helpers/utils.jsx";
import useBubbleStore from "../zustand/bubbleStore.jsx";
import throttle from "lodash/throttle";
import BubbleCreator from "../table/BubbleCreator";

const ZOOM_SETTINGS = {
  FULL: {
    level: 1,
    pixelsPerSecond: 50,
  },
  HALF: {
    level: 2,
    pixelsPerSecond: 100,
  },
};

const WaveformVis = ({
  setAudioDuration,
  setVizWidth,
  setVisibleStartTime,
  setVisibleEndTime,
  selectedBubble,
  setIsAudioLoaded,
  setSelectedBubble,
  audioFile, // Receive audioFile as a prop
}) => {
  // Refs
  const waveformRef = useRef(null);
  const regionsPluginRef = useRef(null);

  // State Management
  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(ZOOM_SETTINGS.FULL.level);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Zustand Store
  const bubbles = useBubbleStore((state) => state.bubbles);
  const updateBubble = useBubbleStore((state) => state.updateBubble);
  const clearBubbles = useBubbleStore((state) => state.clearBubbles);

  // Region Management
  const updateRegions = useCallback(() => {
    if (!wavesurfer || !regionsPluginRef.current) return;

    regionsPluginRef.current.clearRegions();

    if (selectedBubble) {
      regionsPluginRef.current.addRegion({
        id: selectedBubble.id,
        start: convertToSeconds(selectedBubble.startTime),
        end: convertToSeconds(selectedBubble.stopTime),
        color: colorToRGB(selectedBubble.color),
        resize: true,
      });
    }
  }, [selectedBubble, wavesurfer]);

  // Scroll Handler
  const handleScroll = useCallback(
    throttle(() => {
      if (!wavesurfer || !duration || !waveformRef.current) return;

      const containerWidth = waveformRef.current.clientWidth;
      const scrollPosition = wavesurfer.getScroll();
      const currentZoomSetting =
        zoomLevel === ZOOM_SETTINGS.FULL.level
          ? ZOOM_SETTINGS.FULL
          : ZOOM_SETTINGS.HALF;
      const secondsPerPixel =
        duration / (containerWidth * currentZoomSetting.level);

      const visibleStartSeconds = scrollPosition * secondsPerPixel;
      const visibleEndSeconds =
        visibleStartSeconds + containerWidth * secondsPerPixel;

      setVisibleStartTime?.(formatTime(Math.max(0, visibleStartSeconds)));
      setVisibleEndTime?.(formatTime(Math.min(duration, visibleEndSeconds)));
      setScrollLeft(scrollPosition);
    }, 16),
    [wavesurfer, duration, zoomLevel, setVisibleStartTime, setVisibleEndTime]
  );

  // Zoom Management
  const calculateZoom = useCallback(
    (zoomSetting) => {
      if (!wavesurfer || !waveformRef.current) return;

      try {
        const containerWidth = waveformRef.current.clientWidth;
        const currentDuration = wavesurfer.getDuration() || duration;
        if (!currentDuration) return;

        const zoomValue =
          (containerWidth / currentDuration) * zoomSetting.level;
        wavesurfer.zoom(zoomValue);

        const scrollPosition = wavesurfer.getScroll();
        setScrollLeft(scrollPosition);

        const secondsPerPixel =
          currentDuration / (containerWidth * zoomSetting.level);
        const visibleStartSeconds = scrollPosition * secondsPerPixel;
        const visibleEndSeconds =
          visibleStartSeconds + containerWidth * secondsPerPixel;

        setVisibleStartTime?.(formatTime(Math.max(0, visibleStartSeconds)));
        setVisibleEndTime?.(
          formatTime(Math.min(currentDuration, visibleEndSeconds))
        );

        updateRegions();
      } catch (error) {
        console.error("Error during zoom:", error);
      }
    },
    [
      wavesurfer,
      updateRegions,
      setVisibleStartTime,
      setVisibleEndTime,
      duration,
    ]
  );

  const toggleZoom = useCallback(() => {
    const newZoomSetting =
      zoomLevel === ZOOM_SETTINGS.FULL.level
        ? ZOOM_SETTINGS.HALF
        : ZOOM_SETTINGS.FULL;
    setZoomLevel(newZoomSetting.level);
    calculateZoom(newZoomSetting);
  }, [zoomLevel, calculateZoom]);

  // Basic Handlers
  const handlePlayPause = () => wavesurfer?.playPause();

  const handleRestart = () => {
    if (wavesurfer) {
      wavesurfer.seekTo(0);
      setCurrentTime(0);
    }
  };

  // Initialize WaveSurfer when audioFile changes
  useEffect(() => {
    if (audioFile) {
      // If there's an existing instance, destroy it first
      if (wavesurfer) {
        wavesurfer.destroy();
        setWavesurfer(null);
      }

      // Initialize new WaveSurfer instance
      regionsPluginRef.current = RegionsPlugin.create({
        dragSelection: false,
        snapToGrid: 0.1,
      });

      const hoverPlugin = HoverPlugin.create({
        lineColor: "#ff0000",
        lineWidth: 2,
        labelBackground: "rgba(0, 0, 0, 0.75)",
        labelColor: "#fff",
        labelSize: "11px",
        formatTimeCallback: (seconds) => formatTime(seconds),
      });

      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#4E9EE7",
        cursorColor: "#4E9EE7",
        height: 128,
        autoCenter: true,
        fillParent: true,
        scrollParent: true,
        renderer: "WebGL2",
        pixelRatio: 1,
        normalize: true,
        plugins: [regionsPluginRef.current, hoverPlugin],
      });

      // Set up event listeners
      ws.on("ready", () => {
        const audioDuration = ws.getDuration();
        setDuration(audioDuration);
        setAudioDuration?.(audioDuration);
        setIsAudioLoaded?.(true);

        if (waveformRef.current) {
          setVizWidth?.(waveformRef.current.clientWidth);
        }

        calculateZoom(ZOOM_SETTINGS.FULL);
      });

      ws.on("scroll", handleScroll);
      ws.on("play", () => setIsPlaying(true));
      ws.on("pause", () => setIsPlaying(false));
      ws.on(
        "audioprocess",
        throttle((time) => setCurrentTime(time), 16)
      );

      regionsPluginRef.current.on("region-updated", (region) => {
        updateBubble(region.id, {
          startTime: formatTime(region.start),
          stopTime: formatTime(region.end),
        });
      });

      // Load the file and update state
      ws.load(audioFile);
      setWavesurfer(ws);
      setIsAudioLoaded?.(false);
      setZoomLevel(ZOOM_SETTINGS.FULL.level);
    } else {
      // If audioFile is null, destroy WaveSurfer instance
      if (wavesurfer) {
        wavesurfer.destroy();
        setWavesurfer(null);
      }
      setIsAudioLoaded?.(false);
      setDuration(0);
      setCurrentTime(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioFile]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
    };
  }, [wavesurfer]);

  // Update regions when selected bubble changes
  useEffect(() => {
    updateRegions();
  }, [selectedBubble, updateRegions]);

  // Handle window resize
  useEffect(() => {
    if (!wavesurfer) return;

    const handleResize = throttle(() => {
      if (!waveformRef.current) return;

      const containerWidth = waveformRef.current.clientWidth;
      setVizWidth?.(containerWidth);

      const currentZoomSetting =
        zoomLevel === ZOOM_SETTINGS.FULL.level
          ? ZOOM_SETTINGS.FULL
          : ZOOM_SETTINGS.HALF;

      calculateZoom(currentZoomSetting);
    }, 100);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [wavesurfer, zoomLevel, calculateZoom, setVizWidth]);

  // Play from selected bubble's start time
  useEffect(() => {
    if (selectedBubble && wavesurfer) {
      const startTime = convertToSeconds(selectedBubble.startTime);
      wavesurfer.pause();
      wavesurfer.seekTo(startTime / wavesurfer.getDuration());
      wavesurfer.play(startTime);
    }
  }, [selectedBubble, wavesurfer]);

  return (
    <Box sx={{ width: "100%", p: 0 }}>
      {/* Waveform */}
      <div className="relative inline-block w-full mb-4">
        <div id="waveform" ref={waveformRef} style={{ touchAction: "none" }} />
      </div>

      {/* Progress Bar */}
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        wavesurfer={wavesurfer}
      />

      {/* Three Column Layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "200px 1fr 300px",
          gap: 2,
          mt: 4,
          alignItems: "start",
        }}
      >
        {/* Left Column - Playback Controls */}
        <Stack spacing={2} alignItems="center">
          {/* Play Controls Group */}
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Reset Control */}
            <IconButton
              onClick={handleRestart}
              size="medium"
              disabled={!audioFile}
              sx={(theme) => ({
                border: "1px solid",
                borderColor:
                  theme.palette.mode === "dark" ? "#2A2A3E" : "grey.300",
                color: theme.palette.mode === "dark" ? "#fff" : "inherit",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#1E1E2E" : "transparent",
                transition: "all 0.2s ease-in-out",
                opacity: !audioFile ? 0.5 : 1,
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#2C3E50" : "grey.100",
                  transform: audioFile ? "translateY(-2px)" : "none",
                },
              })}
            >
              <RestartAlt />
            </IconButton>

            {/* Play/Pause Button */}
            <IconButton
              onClick={handlePlayPause}
              disabled={!audioFile}
              sx={(theme) => ({
                width: 56,
                height: 56,
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(45deg, #1E1E2E, #2C3E50)"
                    : theme.palette.primary.main,
                color: "white",
                border:
                  theme.palette.mode === "dark" ? "1px solid #2A2A3E" : "none",
                opacity: !audioFile ? 0.5 : 1,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 3px 5px 2px rgba(30, 30, 46, 0.3)"
                    : "0 3px 5px 2px rgba(33, 203, 243, .3)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(45deg, #2A2A3E, #34495E)"
                      : theme.palette.primary.dark,
                  transform: audioFile ? "translateY(-2px)" : "none",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 4px 8px 2px rgba(30, 30, 46, 0.4)"
                      : "0 4px 8px 2px rgba(33, 203, 243, .4)",
                },
              })}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>

            {/* Zoom Control */}
            <IconButton
              onClick={toggleZoom}
              size="medium"
              disabled={!audioFile}
              sx={(theme) => ({
                border: "1px solid",
                borderColor:
                  theme.palette.mode === "dark" ? "#2A2A3E" : "grey.300",
                color: theme.palette.mode === "dark" ? "#fff" : "inherit",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#1E1E2E" : "transparent",
                opacity: !audioFile ? 0.5 : 1,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#2C3E50" : "grey.100",
                  transform: audioFile ? "translateY(-2px)" : "none",
                },
              })}
            >
              {zoomLevel === ZOOM_SETTINGS.FULL.level ? (
                <ZoomIn />
              ) : (
                <ZoomOut />
              )}
            </IconButton>
          </Stack>
        </Stack>

        {/* Center Column - Comments */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "600px",
            mx: "auto",
            opacity: !audioFile ? 0.5 : 1,
            pointerEvents: !audioFile ? "none" : "auto",
          }}
        >
          <CommentDisplay wavesurfer={wavesurfer} />
        </Box>

        {/* Right Column - Bubble Creator */}
        <Box
          sx={{
            paddingRight: "16px",
            width: "100%",
            minWidth: 280,
            "& .MuiPaper-root": {
              width: "100%",
            },
            opacity: !audioFile ? 0.5 : 1,
            pointerEvents: !audioFile ? "none" : "auto",
          }}
        >
          <BubbleCreator
            wavesurfer={wavesurfer}
            disabled={!audioFile}
            onCancel={() => {
              // Optional: Add any cleanup needed when canceling bubble creation
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default WaveformVis;
