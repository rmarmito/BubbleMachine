import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const WaveformVisualizer = ({ audioFile }) => {
  const wavesurfer = WaveSurfer.create({
    container: document.body,
    waveColor: "rgb(200, 0, 200)",
    progressColor: "rgb(100, 0, 100)",
    url: "./assets/RickRoll.mp3",
  });

  wavesurfer.on("click", () => {
    wavesurfer.play();
  });
};

export default WaveformVisualizer;
