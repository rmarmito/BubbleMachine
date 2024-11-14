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
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

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
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          {/* Bubble render area */}
          <Box
            sx={{
              width: "100%",
              height: "200px", // Space for bubbles
              position: "relative",
              marginBottom: -2, // Reduce gap between bubbles and waveform
            }}
          >
            <BubbleRender
              audioDuration={audioDuration}
              vizWidth={vizWidth}
              visibleStartTime={visibleStartTime}
              visibleEndTime={visibleEndTime}
              setSelectedBubble={setSelectedBubble}
              isAudioLoaded={isAudioLoaded}
            />
          </Box>

          {/* Waveform area */}
          <Box sx={{ width: "100%" }}>
            <WaveformVis
              setAudioDuration={setAudioDuration}
              setVizWidth={setVizWidth}
              setVisibleStartTime={setVisibleStartTime}
              setVisibleEndTime={setVisibleEndTime}
              selectedBubble={selectedBubble}
              setAudioFileName={setAudioFileName}
              setIsAudioLoaded={setIsAudioLoaded}
              setSelectedBubble={setSelectedBubble}
            />
          </Box>
        </Box>
      </PrimaryContainer>

      <PrimaryContainer
        label="New Bubble"
        labelColor="white"
        title=""
        titleColor="#FF0000"
      >
        <BubbleTable isAudioLoaded={isAudioLoaded} />
      </PrimaryContainer>

      {[...Array(6)].map((_, index) => (
        <PopUpLayer key={index} layer={`${index + 1}`} />
      ))}
    </div>
  );
}
