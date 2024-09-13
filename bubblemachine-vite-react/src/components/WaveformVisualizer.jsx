import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const WaveformVisualizer = ({ audioFile }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "violet",
        progressColor: "purple",
        height: 150,
        responsive: true,
      });

      wavesurferRef.current.load(audioFile);

      wavesurferRef.current.on("ready", () => {
        console.log("WaveSurfer is ready");
      });

      wavesurferRef.current.on("error", (e) => {
        console.error("WaveSurfer error: ", e);
      });
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [audioFile]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setPlaying(!playing);
    }
  };

  return (
    <div>
      <div
        ref={waveformRef}
        style={{ width: "100%", height: "150px", border: "1px solid black" }}
      />
      <button onClick={handlePlayPause}>{playing ? "Pause" : "Play"}</button>
    </div>
  );
};

export default WaveformVisualizer;
