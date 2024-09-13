import React from "react";
import WaveformVisualizer from "../components/WaveformVisualizer";

const WaveformPage = () => {
  const audioFile = "./assets/RickRoll.mp3";

  return (
    <div>
      <h1>Waveform Visualizer</h1>
      <WaveformVisualizer audioFile={audioFile} />
    </div>
  );
};

export default WaveformPage;
