import React, { useState } from "react";
import BubbleTable from "../components/ZTable";
import BubbleRender from "../components/BubbleRender";
import { Box } from "@mui/material";
import PrimaryContainer from "../components/layout/PrimaryContainer";
import WaveformVis from "../components/waveform/WaveformVis";
import BubbleTable from "../components/table/ZTable";

export default function HomePage() {
  const audioFile = "https://www.kozco.com/tech/LRMonoPhase4.mp3";
  const [audioDuration, setAudioDuration] = useState(0);
  const [vizWidth, setVizWidth] = useState(800);

  return (
    <div>
      <PrimaryContainer
        label="Current File:"
        labelColor="white"
        title=""
        titleColor="#00FF00" // Use a valid color
      >
        <Box sx={{ display: "flex", justifyContent: "center", position:"relative" }}>
          <BubbleRender audioDuration={audioDuration} vizWidth={vizWidth} />
        </Box>
        <WaveformVis />
      </PrimaryContainer>

      <PrimaryContainer
        label="New Bubble"
        labelColor="white"
        title=""
        titleColor="#FF0000" // Use a valid color
      >
        <BubbleTable />
      </PrimaryContainer>

      <PrimaryContainer />
    </div>
  );
}
