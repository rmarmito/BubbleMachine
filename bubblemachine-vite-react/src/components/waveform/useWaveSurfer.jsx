import { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom";

const useWaveSurfer = ({ containerRef, timelineContainerRef, onReady }) => {
  const [wavesurfer, setWavesurfer] = useState(null);

  useEffect(() => {
    if (containerRef.current && timelineContainerRef.current) {
      const ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "#ddd",
        progressColor: "#2196f3",
        cursorColor: "#2196f3",
        height: 128,
        plugins: [
          RegionsPlugin.create({ dragSelection: false }),
          TimelinePlugin.create({ container: timelineContainerRef.current }),
          ZoomPlugin.create({
            scale: 0.5,
            maxZoom: 1000,
            autoCenter: false,
          }),
        ],
      });

      ws.on("ready", () => {
        onReady(ws);
      });

      setWavesurfer(ws);

      return () => {
        if (ws) ws.destroy();
      };
    }
  }, [containerRef, timelineContainerRef, onReady]);

  return wavesurfer;
};

export default useWaveSurfer;
