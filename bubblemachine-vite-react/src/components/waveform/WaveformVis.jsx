import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.js";
import HoverPlugin from "wavesurfer.js/dist/plugins/hover.js";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.js";
import { Button } from "@mui/material";
import ProgressBar from "./Progressbar";
import { formatTime } from "../../helpers/utils";
import CommentDisplay from "../timestamped-comments/CommentsDisplay";

const WaveformVis = () => {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setAudioFile(fileUrl);
    }
  };

  const markStartTime = () => {
    if (wavesurfer) {
      const time = wavesurfer.getCurrentTime();
      console.log("Marking start time:", time);
      setSelectedStartTime(time);
      setSelectedEndTime(null);
    }
  };

  const markEndTime = () => {
    if (wavesurfer && selectedStartTime !== null) {
      const time = wavesurfer.getCurrentTime();
      console.log("Marking end time:", time);
      setSelectedEndTime(time);
      createRegion(selectedStartTime, time);
    }
  };

  const createRegion = (start, end) => {
    if (start > end) [start, end] = [end, start];

    regionsPluginRef.current.addRegion({
      start,
      end,
      loop: true,
      color: "rgba(0,123,255,0.5)",
    });

    console.log("Created region:", { start, end });
  };

  const addRegion = () => {
    if (regionsPluginRef.current && wavesurfer) {
      const currentTime = wavesurfer.getCurrentTime();
      const regionDuration = 5; // Duration of the region
      const endTime =
        currentTime + regionDuration <= duration
          ? currentTime + regionDuration
          : duration;
      regionsPluginRef.current.addRegion({
        start: currentTime,
        end: endTime,
        color: "rgba(255, 0, 0, 0.5)",
      });
    }
  };

  const handlePlayPause = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
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

      <CommentDisplay wavesurfer={wavesurfer} currentTime={currentTime} />
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

        <Button variant="contained" color="primary" onClick={addRegion}>
          Add Region
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
