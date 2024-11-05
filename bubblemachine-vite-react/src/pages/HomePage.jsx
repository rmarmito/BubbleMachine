import React, { useState } from "react";
import { Box } from "@mui/material";
import BubbleRender from "../components/bubbles/BubbleRender";
import PrimaryContainer from "../components/layout/PrimaryContainer";
import WaveformVis from "../components/waveform/WaveformVis";
import BubbleTable from "../components/table/BubbleTable";
import PopUpLayer from "../components/table/PopUpLayer";

export default function HomePage() {
  const [audioDuration, setAudioDuration] = useState(0);
  const [vizWidth, setVizWidth] = useState(800);
  const [audioFileName, setAudioFileName] = useState("");
  const [visibleStartTime, setVisibleStartTime] = useState(0);
  const [visibleEndTime, setVisibleEndTime] = useState(0);
  const [selectedBubble, setSelectedBubble] = useState(null);

  return (
    <div>
      <PrimaryContainer
        label="Current File:"
        labelColor="white"
        title={audioFileName || ""}
        titleColor="#00FF00"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            marginBottom: 0,
          }}
        >
          <BubbleRender
            audioDuration={audioDuration}
            vizWidth={vizWidth}
            visibleStartTime={visibleStartTime}
            visibleEndTime={visibleEndTime}
            setSelectedBubble={setSelectedBubble}
          />
        </Box>
        <WaveformVis
          setAudioDuration={setAudioDuration}
          setVizWidth={setVizWidth}
          setVisibleStartTime={setVisibleStartTime}
          setVisibleEndTime={setVisibleEndTime}
          selectedBubble={selectedBubble}
          setAudioFileName={setAudioFileName}
          sx={{ marginTop: 0 }}
        />
      </PrimaryContainer>

      <PrimaryContainer
        label="New Bubble"
        labelColor="white"
        title=""
        titleColor="#FF0000"
      >
        <BubbleTable />
      </PrimaryContainer>

      {[...Array(6)].map((_, index) => (
        <PopUpLayer key={index} layer={`${index + 1}`} />
      ))}
    </div>
  );
}
