import { useEffect, useRef, useState, useCallback } from "react";
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
import CommentCreator from "../timestamped-comments/CommentCreator";
import useCommentsStore from "../zustand/commentsStore.jsx";

const ZOOM_SETTINGS = {
  FULL: {
    level: 1,
    pixelsPerSecond: 1,
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
  setSelectedBubble,
  selectedBubble,
  setIsAudioLoaded,
  bubbleTrigger,
  audioFile,
}) => {
  // Refs
  const waveformRef = useRef(null);
  const regionsPluginRef = useRef(null);
  const [isCreating, setIsCreating] = useState(false);
  const [commentText, setCommentText] = useState("");
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
  const clearComments = useCommentsStore((state) => state.clearComments);
  const setBubbleTrigger = useBubbleStore((state) => state.setBubbleTrigger);

  // Region Management
  const updateRegions = useCallback(() => {
    if (!wavesurfer || !regionsPluginRef.current) return;

    // Get all current regions
    const currentRegions = regionsPluginRef.current.getRegions();

    // Clear all existing regions
    regionsPluginRef.current.clearRegions();

    // Create regions for all bubbles in the store that match the selected bubble
    bubbles.forEach((bubble) => {
      if (selectedBubble && bubble.id === selectedBubble.id) {
        regionsPluginRef.current.addRegion({
          id: bubble.id,
          start: convertToSeconds(bubble.startTime),
          end: convertToSeconds(bubble.stopTime),
          color: colorToRGB(bubble.color),
          resize: true,
          drag: false,
        });
      }
    });
  }, [selectedBubble, bubbles, wavesurfer]);

  const TimestampDisplay = ({ currentTime }) => {
    return (
      <Box
        sx={{
          fontFamily: "monospace",
          fontSize: "1.2rem",
          padding: "8px 16px",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1E1E2E" : "#f5f5f5",
          borderRadius: "4px",
          display: "inline-block",
          minWidth: "120px",
          textAlign: "center",
          border: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "#2A2A3E" : "grey.300",
          color: (theme) =>
            theme.palette.mode === "dark" ? "#fff" : "inherit",
        }}
      >
        {formatTime(currentTime)}
      </Box>
    );
  };

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
      } catch (error) {
        console.error("Error during zoom:", error);
      }
    },
    [wavesurfer, setVisibleStartTime, setVisibleEndTime, duration]
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
    if (!waveformRef.current) return;

    const initializeWavesurfer = () => {
      // Initialize new WaveSurfer instance
      regionsPluginRef.current = RegionsPlugin.create({
        drag: false,
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
        autoCenter: false,
        fillParent: true,
        scrollParent: false,
        renderer: "WebGL2",
        pixelRatio: 100,
        normalize: true,
        plugins: [regionsPluginRef.current, hoverPlugin],
      });

      // Set up event listeners
      ws.on("ready", () => {
        console.log("WaveSurfer ready event fired");
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
        // Immediately update bubble state when region is updated
        updateBubble(region.id, {
          startTime: formatTime(region.start),
          stopTime: formatTime(region.end),
        });
      });

      regionsPluginRef.current.on("region-update-end", (region) => {
        // Force region to match store values after update
        const bubble = bubbles.find((b) => b.id === region.id);
        if (bubble) {
          region.setOptions({
            start: convertToSeconds(bubble.startTime),
            end: convertToSeconds(bubble.stopTime),
          });
        }
      });

      return ws;
    };

    // Cleanup and initialize
    if (audioFile) {
      // Cleanup previous instance if it exists
      if (wavesurfer) {
        wavesurfer.destroy();
      }

      // Initialize new instance
      const ws = initializeWavesurfer();
      setWavesurfer(ws);
      ws.load(audioFile);
      setZoomLevel(ZOOM_SETTINGS.FULL.level);
    } else {
      // Handle file removal
      if (wavesurfer) {
        wavesurfer.destroy();
        setWavesurfer(null);
      }

      // Reset states
      setIsAudioLoaded?.(false);
      setDuration(0);
      setCurrentTime(0);
      setSelectedBubble?.(null);
      clearBubbles();
      clearComments();

      // Clear DOM
      if (waveformRef.current) {
        waveformRef.current.innerHTML = "";
      }
    }

    // Cleanup on effect cleanup
    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
    };
  }, [audioFile]); // Minimal dependencies to prevent re-runs

  // Update regions when selected bubble changes
  useEffect(() => {
    updateRegions();
  }, [selectedBubble, updateRegions]);

  // Handle window resize
  useEffect(() => {
    if (!wavesurfer) return;

    const currentZoomSetting =
      zoomLevel === ZOOM_SETTINGS.FULL.level
        ? ZOOM_SETTINGS.FULL
        : ZOOM_SETTINGS.HALF;

    const intervalId = setInterval(() => {
      calculateZoom(currentZoomSetting);
    }, 3000);

    // Cleanup on unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [wavesurfer, zoomLevel, calculateZoom]);

  // Play from selected bubble's start time
  useEffect(() => {
    if (selectedBubble && wavesurfer) {
      const startTime = convertToSeconds(selectedBubble.startTime);
      wavesurfer.pause();
      wavesurfer.seekTo(startTime / wavesurfer.getDuration());
      wavesurfer.play(startTime);
      console.log("Bubble Trigger", bubbleTrigger);
    }
  }, [selectedBubble, wavesurfer, bubbleTrigger]);

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

      {/* 5-Column Layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 2fr 1fr 1fr",
          gap: 2,
          mt: 4,
          alignItems: "start",
        }}
      >
        {/* Column 1 - Playback Controls */}
        <Stack spacing={2} alignItems="left">
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

            <TimestampDisplay currentTime={currentTime} />

            {/* Play/Pause Button */}
            <IconButton
              onClick={handlePlayPause}
              disabled={!audioFile}
              sx={(theme) => ({
                width: 75,
                height: 75,
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

        {/* Column 2 - Empty */}
        <Box />

        {/* Column 3 - Comment Display */}
        <Box
          sx={{
            maxWidth: "700px",
            width: "100%",
          }}
        >
          <CommentDisplay
            wavesurfer={wavesurfer}
            isCreating={isCreating}
            commentText={commentText}
            setCommentText={setCommentText}
          />
        </Box>

        {/* Column 4 - Comment Creator */}
        <Box>
          <CommentCreator wavesurfer={wavesurfer} disabled={!audioFile} />
        </Box>

        {/* Column 5 - Bubble Creator */}
        <Box>
          <BubbleCreator wavesurfer={wavesurfer} disabled={!audioFile} />
        </Box>
      </Box>
    </Box>
  );
};

export default WaveformVis;
