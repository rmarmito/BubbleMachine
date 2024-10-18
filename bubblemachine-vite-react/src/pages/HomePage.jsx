import React, { useState } from "react";
import BubbleBox from "../components/BubbleBox";
import WaveformVis from "../components/WaveformVis";
import BubbleTable from "../components/ZTable";
import BubbleRender from "../components/BubbleRender";
import { Box } from "@mui/material";

export default function HomePage() {
  const audioFile = "https://www.kozco.com/tech/LRMonoPhase4.mp3";
  const [audioDuration, setAudioDuration] = useState(0);
  const [vizWidth, setVizWidth] = useState(800);

  return (
    <div>
      <BubbleBox
        label="Current File:"
        labelColor="white"
        title=""
        titleColor="#00FF00" // Use a valid color
      >
        <Box sx={{ display: "flex", justifyContent: "center", position:"relative" }}>
          <BubbleRender audioDuration={audioDuration} vizWidth={vizWidth} />
        </Box>
        <WaveformVis setAudioDuration={setAudioDuration} setVizWidth={setVizWidth}/>
      </BubbleBox>

      <BubbleBox
        label="New Bubble"
        labelColor="white"
        title=""
        titleColor="#FF0000" // Use a valid color
      >
        <BubbleTable/>
      </BubbleBox>

      <BubbleBox />
    </div>
  );
}
