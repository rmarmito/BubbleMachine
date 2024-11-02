import React from "react";

const ProgressBar = ({ currentTime, duration, wavesurfer }) => {
  const handleProgressMouseDown = (e) => {
    seekToMousePosition(e);
    document.addEventListener("mousemove", handleProgressMouseMove);
    document.addEventListener("mouseup", handleProgressMouseUp);
  };

  const handleProgressMouseMove = (e) => {
    seekToMousePosition(e);
  };

  const handleProgressMouseUp = () => {
    document.removeEventListener("mousemove", handleProgressMouseMove);
    document.removeEventListener("mouseup", handleProgressMouseUp);
  };

  const seekToMousePosition = (e) => {
    if (wavesurfer) {
      const progressBar = e.target;
      const rect = progressBar.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const ratio = offsetX / rect.width;
      wavesurfer.seekTo(ratio);
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
