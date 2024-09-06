import React from "react";
import WaveformVisualizer from "./components/WaveformVisualizer.jsx"; // Adjust the path as necessary

const WaveformPage = () => {
  const audioFile = "/path/to/your/audiofile.mp3"; // Replace with your actual audio file path

  return (
    <div>
      <h1>Waveform Visualizer</h1>
      <WaveformVisualizer audioFile={audioFile} />
    </div>
  );
};

export default WaveformPage;
