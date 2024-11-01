import React from "react";
import { Button } from "@mui/material";

const WaveformControls = ({ onFileChange, isPlaying, handlePlayPause }) => {
  return (
    <div style={{ marginTop: "10px", textAlign: "center" }}>
      <input
        accept="audio/*"
        id="audio-file-input"
        type="file"
        style={{ display: "none" }}
        onChange={(e) => onFileChange(e.target.files[0])}
      />
      <label htmlFor="audio-file-input">
        <Button
          variant="contained"
          color="primary"
          component="span"
          style={{ marginRight: "10px" }}
        >
          Upload Audio
        </Button>
      </label>

      <Button
        variant="contained"
        color="primary"
        onClick={handlePlayPause}
        style={{ marginRight: "10px" }}
      >
        {isPlaying ? "Pause" : "Play"}
      </Button>
    </div>
  );
};

export default WaveformControls;
