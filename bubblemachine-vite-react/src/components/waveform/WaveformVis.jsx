import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.js";
import HoverPlugin from "wavesurfer.js/dist/plugins/hover.js";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.js";
import { Button } from "@mui/material";
import ProgressBar from "./Progressbar";
import {
  formatTime,
  createID,
  convertToSeconds,
  colorToRGB,
} from "../../helpers/utils.jsx";
import CommentDisplay from "../timestamped-comments/CommentsDisplay.jsx";
import useBubbleStore from "../zustand/bubbleStore.jsx";

const WaveformVis = ({
  setAudioDuration,
  setVizWidth,
  setAudioFileName,
  setVisibleStartTime,
  setVisibleEndTime,
  selectedBubble,
}) => {
  const waveformRef = useRef(null);
  const timelineRef = useRef(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const regionsPluginRef = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const bubbles = useBubbleStore((state) => state.bubbles);
  const updateBubble = useBubbleStore((state) => state.updateBubble);
  const addBubble = useBubbleStore((state) => state.addBubble);

  useEffect(() => {
    if (waveformRef.current && timelineRef.current) {
      regionsPluginRef.current = RegionsPlugin.create({ dragSelection: false });
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#2196f3",
        cursorColor: "#2196f3",
        height: 128,
        plugins: [
          regionsPluginRef.current,
          TimelinePlugin.create({ container: timelineRef.current }),
          HoverPlugin.create({
            lineColor: "#ff0000",
            lineWidth: 2,
            labelBackground: "#555",
            labelColor: "#fff",
            labelSize: "11px",
            formatTimeCallback: (seconds) => formatTime(seconds),
          }),
          ZoomPlugin.create({
            scale: 0.5,
            maxZoom: 1000,
            autoCenter: false,
          }),
        ],
      });

      setWavesurfer(ws);

      ws.on("ready", () => {
        setDuration(ws.getDuration());
        setAudioDuration(ws.getDuration());
        regionsPluginRef.current.clearRegions();
        renderBubbles();
      });

      ws.on("redraw", () => {
        setVizWidth(waveformRef.current.clientWidth);
      });

      ws.on("audioprocess", (time) => {
        setCurrentTime(time);
      });

      ws.on("play", () => {
        setIsPlaying(true);
      });

      ws.on("pause", () => {
        setIsPlaying(false);
      });

      ws.on("scroll", (visibleStartTime, visibleEndTime) => {
        setVisibleStartTime(formatTime(visibleStartTime));
        setVisibleEndTime(formatTime(visibleEndTime));
      });

      ws.on("zoom", (minPxPerSec) => {
        const visibleDuration = waveformRef.current.clientWidth / minPxPerSec;
        let visibleStartTime = ws.getCurrentTime() - visibleDuration / 2;
        let visibleEndTime = ws.getCurrentTime() + visibleDuration / 2;

        if (visibleStartTime < 0) {
          visibleStartTime = 0;
          visibleEndTime = visibleDuration;
        }

        setVisibleStartTime(formatTime(visibleStartTime));
        setVisibleEndTime(formatTime(visibleEndTime));
        renderBubbles();
      });

      regionsPluginRef.current.on("region-updated", (region) => {
        const id = region.id;
        const startTime = formatTime(region.start);
        const stopTime = formatTime(region.end);
        const values = { startTime, stopTime };
        updateBubble(id, values);
      });

      return () => {
        if (ws) {
          ws.destroy();
        }
      };
    }
  }, []);

  useEffect(() => {
    if (wavesurfer && audioFile) {
      wavesurfer.load(audioFile);
    }
  }, [audioFile, wavesurfer]);

  useEffect(() => {
    if (wavesurfer && selectedBubble) {
      regionsPluginRef.current.clearRegions();
      const { startTime, stopTime, color } = selectedBubble;
      regionsPluginRef.current.addRegion({
        id: selectedBubble.id,
        start: convertToSeconds(startTime),
        end: convertToSeconds(stopTime),
        color: colorToRGB(color),
        drag: false,
        resize: true,
      });
    }
  }, [selectedBubble, wavesurfer]);

  const renderBubbles = () => {
    if (wavesurfer && regionsPluginRef.current) {
      regionsPluginRef.current.clearRegions();
      bubbles.forEach((bubble) => {
        regionsPluginRef.current.addRegion({
          id: bubble.id,
          start: convertToSeconds(bubble.startTime),
          end: convertToSeconds(bubble.stopTime),
          color: colorToRGB(bubble.color),
          drag: false,
          resize: true,
        });
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setAudioFile(fileUrl);
      setAudioFileName(file.name);
    }
  };

  const markStartTime = () => {
    if (wavesurfer) {
      const time = wavesurfer.getCurrentTime();
      setSelectedStartTime(time);
      setSelectedEndTime(null);
    }
  };

  const markEndTime = () => {
    if (wavesurfer && selectedStartTime !== null) {
      const time = wavesurfer.getCurrentTime();
      setSelectedEndTime(time);
      createRegion(selectedStartTime, time);
    }
  };

  const createRegion = (start, end) => {
    if (start > end) [start, end] = [end, start];
    const id = createID();
    addBubble({
      id,
      startTime: formatTime(start),
      stopTime: formatTime(end),
      color: "Blue",
      layer: 1,
    });
  };

  const addRegion = () => {
    if (regionsPluginRef.current && wavesurfer) {
      const id = createID();
      const currentTime = wavesurfer.getCurrentTime();
      const regionDuration = 5;
      const endTime =
        currentTime + regionDuration <= duration
          ? currentTime + regionDuration
          : duration;
      addBubble({
        id,
        startTime: formatTime(currentTime),
        stopTime: formatTime(endTime),
        color: "Red",
        layer: 1,
      });
    }
  };

  const handlePlayPause = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", paddingTop: 0 }}>
      <div
        style={{ position: "relative", display: "inline-block", width: "100%" }}
      >
        <div id="waveform" ref={waveformRef} style={{ touchAction: "none" }} />
        <div id="timeline" ref={timelineRef} />
      </div>

      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        wavesurfer={wavesurfer}
      />
      <span>
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
      <div style={{ position: "relative" }}>
        <CommentDisplay
          wavesurfer={wavesurfer}
          currentTime={currentTime}
          style={{ position: "absolute", right: 0, marginBottom: "10px" }}
        />
      </div>
      <div style={{ marginTop: "10px", position: "relative" }}>
        <div />
        <div style={{ marginTop: "10px", top: 0 }}>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlayPause}
              style={{ position: "absolute", left: 0 }}
            >
              {isPlaying ? "Pause" : "Play"}
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
              <Button
                variant="contained"
                color="primary"
                component="span"
                style={{ position: "absolute", right: 0 }}
              >
                Upload Audio
              </Button>
            </label>
          </div>
          <div>
            <Button variant="contained" color="primary" onClick={markStartTime}>
              Mark Start Time
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={markEndTime}
              disabled={selectedStartTime === null}
              style={{ marginLeft: "10px", marginRight: "10px" }}
            >
              Mark End Time
            </Button>

            <Button variant="contained" color="primary" onClick={addRegion}>
              Add Region
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveformVis;
