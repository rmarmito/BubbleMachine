import React, { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import HoverPlugin from "wavesurfer.js/dist/plugins/hover.js";
import { Box, IconButton, Paper, Stack, Button, Fab } from "@mui/material";
import {
  PlayArrow,
  Pause,
  RestartAlt,
  ZoomIn,
  ZoomOut,
  Upload,
  Flag,
  Comment,
} from "@mui/icons-material";
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
  setAudioFileName,
  setVisibleStartTime,
  setVisibleEndTime,
  selectedBubble,
  setIsAudioLoaded,
  setSelectedBubble,
}) => {
  const waveformRef = useRef(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const regionsPluginRef = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(ZOOM_SETTINGS.FULL.level);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  const bubbles = useBubbleStore((state) => state.bubbles);
  const updateBubble = useBubbleStore((state) => state.updateBubble);
  const addBubble = useBubbleStore((state) => state.addBubble);

  // Update regions
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

  // Handle scroll updates
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

  // Calculate zoom
  const calculateZoom = useCallback(
    (zoomSetting) => {
      if (!wavesurfer || !waveformRef.current) return;

      try {
        const containerWidth = waveformRef.current.clientWidth;
        const currentDuration = wavesurfer.getDuration() || duration;
        if (!currentDuration) return;

        const zoomValue =
          (containerWidth / currentDuration) * zoomSetting.level;

        // Apply zoom
        wavesurfer.zoom(zoomValue);

        // Get the current scroll position
        const scrollPosition = wavesurfer.getScroll();
        setScrollLeft(scrollPosition);

        // Calculate visible time range based on zoom and scroll
        const secondsPerPixel =
          currentDuration / (containerWidth * zoomSetting.level);
        const visibleStartSeconds = scrollPosition * secondsPerPixel;
        const visibleEndSeconds =
          visibleStartSeconds + containerWidth * secondsPerPixel;

        // Update visible time range
        setVisibleStartTime?.(formatTime(Math.max(0, visibleStartSeconds)));
        setVisibleEndTime?.(
          formatTime(Math.min(currentDuration, visibleEndSeconds))
        );

        // Update regions
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

  // Initialize WaveSurfer
  useEffect(() => {
    if (!waveformRef.current || wavesurfer) return;

    regionsPluginRef.current = RegionsPlugin.create({
      dragSelection: false,
      snapToGrid: 0.1,
    });
    const hoverPlugin = HoverPlugin.create({
      lineColor: "#ff0000", // Red line for hover
      lineWidth: 2,
      labelBackground: "rgba(0, 0, 0, 0.75)",
      labelColor: "#fff",
      labelSize: "11px",
      formatTimeCallback: (seconds) => formatTime(seconds), // Use your formatTime function
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

    setWavesurfer(ws);

    ws.on("ready", () => {
      const audioDuration = ws.getDuration();
      setDuration(audioDuration);
      setAudioDuration?.(audioDuration);
      setIsAudioLoaded?.(true);

      if (waveformRef.current) {
        setVizWidth?.(waveformRef.current.clientWidth);
      }

      // Initialize zoom after duration is set
      calculateZoom(ZOOM_SETTINGS.FULL);
    });

    ws.on("scroll", handleScroll);
    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on(
      "audioprocess",
      throttle((time) => setCurrentTime(time), 16)
    );

    // Handle region updates
    regionsPluginRef.current.on("region-updated", (region) => {
      updateBubble(region.id, {
        startTime: formatTime(region.start),
        stopTime: formatTime(region.end),
      });
    });

    return () => {
      ws.destroy();
      setIsAudioLoaded?.(false);
    };
  }, []);

  // Handle audio file loading
  useEffect(() => {
    if (wavesurfer && audioFile) {
      wavesurfer.load(audioFile);
      setZoomLevel(ZOOM_SETTINGS.FULL.level);
    }
  }, [audioFile, wavesurfer]);

  // Update regions when selected bubble changes
  useEffect(() => {
    updateRegions();
  }, [selectedBubble, updateRegions]);

  // Handle window resize
  useEffect(() => {
    const handleResize = throttle(() => {
      if (!wavesurfer || !waveformRef.current) return;

      // Update container width
      const containerWidth = waveformRef.current.clientWidth;
      setVizWidth?.(containerWidth);

      // Recalculate zoom based on new container width
      const currentZoomSetting =
        zoomLevel === ZOOM_SETTINGS.FULL.level
          ? ZOOM_SETTINGS.FULL
          : ZOOM_SETTINGS.HALF;

      calculateZoom(currentZoomSetting);
    }, 100);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [wavesurfer, zoomLevel]);
  // Handle zoom toggle
  const toggleZoom = useCallback(() => {
    const newZoomSetting =
      zoomLevel === ZOOM_SETTINGS.FULL.level
        ? ZOOM_SETTINGS.HALF
        : ZOOM_SETTINGS.FULL;

    setZoomLevel(newZoomSetting.level);
    calculateZoom(newZoomSetting);
  }, [zoomLevel, calculateZoom]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setAudioFile(fileUrl);
      setAudioFileName?.(file.name);
      setIsAudioLoaded?.(false);
      setZoomLevel(ZOOM_SETTINGS.FULL.level);
    }
  };

  const handlePlayPause = () => wavesurfer?.playPause();
  const handleRestart = () => {
    if (wavesurfer) {
      wavesurfer.seekTo(0);
      setCurrentTime(0);
    }
  };

  const markStartTime = () => {
    if (wavesurfer) {
      setSelectedStartTime(wavesurfer.getCurrentTime());
    }
  };

  const markEndTime = () => {
    if (!wavesurfer || selectedStartTime === null) return;

    const endTime = wavesurfer.getCurrentTime();
    const [start, end] = [selectedStartTime, endTime].sort((a, b) => a - b);

    addBubble({
      id: createID(),
      startTime: formatTime(start),
      stopTime: formatTime(end),
      color: "#4E9EE7",
      layer: 1,
    });

    setSelectedStartTime(null);
  };

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
          gridTemplateColumns: "200px 1fr 200px",
          gap: 2,
          mt: 4,
          alignItems: "start",
        }}
      >
        {/* Left Column - Playback Controls */}
        <Stack spacing={2} alignItems="center">
          {/* Play Controls Group */}
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Reset and Zoom Controls */}
            <IconButton
              utton
              onClick={handleRestart}
              size="medium"
              sx={{
                border: "1px solid",
                borderColor: "grey.300",
                "&:hover": {
                  bgcolor: "grey.100",
                },
              }}
            >
              <RestartAlt />
            </IconButton>

            {/* Play/Pause Button */}
            <IconButton
              color="primary"
              onClick={handlePlayPause}
              sx={{
                width: 56,
                height: 56,
                bgcolor: "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={toggleZoom}
                size="medium"
                sx={{
                  border: "1px solid",
                  borderColor: "grey.300",
                  "&:hover": {
                    bgcolor: "grey.100",
                  },
                }}
              >
                {zoomLevel === ZOOM_SETTINGS.FULL.level ? (
                  <ZoomIn />
                ) : (
                  <ZoomOut />
                )}
              </IconButton>
            </Stack>
          </Stack>

          {/* Upload Button */}
          <Box sx={{ width: "100%" }}>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="audio-upload"
            />
            <label htmlFor="audio-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<Upload />}
                fullWidth
                size="small"
              >
                UPLOAD
              </Button>
            </label>
          </Box>
        </Stack>

        {/* Center Column - Comments */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "400px",
            mx: "auto",
          }}
        >
          <CommentDisplay wavesurfer={wavesurfer} />
        </Box>

        {/* Right Column - Region Markers */}
        <Stack spacing={1}>
          <Button
            variant="contained"
            onClick={markStartTime}
            startIcon={<Flag />}
            fullWidth
            sx={{ justifyContent: "flex-start" }}
          >
            START
          </Button>
          <Button
            variant="contained"
            onClick={markEndTime}
            disabled={selectedStartTime === null}
            startIcon={<Flag />}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              bgcolor: "grey.300",
              "&:not(:disabled)": {
                bgcolor: "primary.main",
              },
            }}
          >
            END
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default WaveformVis;
