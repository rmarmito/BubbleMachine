import React from "react";

const ProgressBar = ({ currentTime, duration, wavesurfer }) => {
  const handleProgressMouseDown = (e) => {
    seekToMousePosition(e);
    document.addEventListener("mousemove", handleProgressMouseMove); // Add mousemove listener
    document.addEventListener("mouseup", handleProgressMouseUp); // Add mouseup listener
  };

  const handleProgressMouseMove = (e) => {
    seekToMousePosition(e); // Update position while dragging
  };

  const handleProgressMouseUp = () => {
    document.removeEventListener("mousemove", handleProgressMouseMove); // Remove mousemove listener
    document.removeEventListener("mouseup", handleProgressMouseUp); // Remove mouseup listener
  };

  const seekToMousePosition = (e) => {
    if (wavesurfer.current) {
      const progressBar = e.target;
      const rect = progressBar.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const ratio = offsetX / rect.width;

      wavesurfer.current.seekTo(ratio); // Seek to the new position
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
