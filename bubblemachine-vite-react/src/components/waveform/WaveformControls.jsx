import { Button } from "@mui/material";
import { formatTime } from "../helpers/utils";
// Simple timestamp display component
const TimestampDisplay = ({ currentTime }) => {
  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: "1.2rem",
        padding: "8px 16px",
        backgroundColor: "#f5f5f5",
        borderRadius: "4px",
        display: "inline-block",
        minWidth: "120px",
        textAlign: "center",
      }}
    >
      {formatTime(currentTime)}
    </div>
  );
};

const WaveformControls = ({
  onFileChange,
  isPlaying,
  currentTime,
  wavesurfer,
}) => {
  const handlePlayPause = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  };

  return (
    <div
      style={{
        marginTop: "10px",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      <input
        accept="audio/*"
        id="audio-file-input"
        type="file"
        style={{ display: "none" }}
        onChange={(e) => onFileChange(e.target.files[0])}
      />
      <label htmlFor="audio-file-input">
        <Button variant="contained" color="primary" component="span">
          Upload Audio
        </Button>
      </label>
      <TimestampDisplay currentTime={currentTime} />
      <Button variant="contained" color="primary" onClick={handlePlayPause}>
        {isPlaying ? "Pause" : "Play"}
      </Button>
    </div>
  );
};

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

export { WaveformControls, ProgressBar };
