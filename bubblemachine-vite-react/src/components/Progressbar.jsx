// src/components/ProgressBar.jsx
import React from "react";

const ProgressBar = ({ currentTime, duration, isPlaying, wavesurfer }) => {
  const handleProgressMouseDown = (e) => {
    if (wavesurfer.current) {
      seekToMousePosition(e);
    }
  };

  const seekToMousePosition = (e) => {
    if (wavesurfer.current) {
      const progressBar = e.target;
      const rect = progressBar.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const ratio = offsetX / rect.width;

      wavesurfer.current.seekTo(ratio);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "10px",
        backgroundColor: "#ccc",
        cursor: "pointer",
        marginTop: "10px",
      }}
      onMouseDown={handleProgressMouseDown}
    >
      <div
        style={{
          width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
          height: "100%",
          backgroundColor: "#2196f3",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default ProgressBar;
