import React, { useState } from "react";
import { Box } from "@mui/material";
import BubbleRender from "../components/bubbles/BubbleRender";
import PrimaryContainer from "../components/layout/PrimaryContainer";
import WaveformVis from "../components/waveform/WaveformVis";
import BubbleTable from "../components/table/ZTable";
import LayerTable from "../components/table/LayerTable";
import PopUpLayer from "../components/table/PopUpLayer";

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
        <Box sx={{ display: "flex", justifyContent: "center", position:"relative", marginBottom:0 }}>
          <BubbleRender audioDuration={audioDuration} vizWidth={vizWidth} />
        </Box>
        <WaveformVis setAudioDuration={setAudioDuration} setVizWidth={setVizWidth} sx={{marginTop: 0}}/>
        <BubbleTable />
      </PrimaryContainer>
{/*
      <PrimaryContainer
        label="New Bubble"
        labelColor="white"
        title=""
        titleColor="#FF0000" // Use a valid color
      >
        <BubbleTable />
      </PrimaryContainer>*/}
      <PopUpLayer layer={'1'} />
      <PopUpLayer layer={'2'} />
      <PopUpLayer layer={'3'} />
      <PopUpLayer layer={'4'} />
      <PopUpLayer layer={'5'} />
      <PopUpLayer layer={'6'} />
    </div>
  );
}
