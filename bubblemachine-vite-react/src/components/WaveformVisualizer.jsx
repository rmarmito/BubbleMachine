import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const WaveformVisualizer = ({ audioFile }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      // Create the WaveSurfer instance
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "rgb(200, 0, 200)",
        progressColor: "rgb(100, 0, 100)",
        responsive: true, // Makes it responsive
      });

      // Load the audio file
      wavesurferRef.current.load(audioFile);

      // Optional: Log when ready
      wavesurferRef.current.on("ready", () => {
        console.log("WaveSurfer is ready");
        wavesurferRef.current.play();
      });

      // Handle loading errors
      wavesurferRef.current.on("error", (e) => {
        console.error("WaveSurfer error: ", e);
      });
    }

    // Cleanup on unmount
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [audioFile]);

  return (
    <div
      ref={waveformRef}
      style={{ width: "100%", height: "150px", border: "1px solid black" }}
    />
  );
};

export default WaveformVisualizer;
