// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import BubbleRender from "../components/bubbles/BubbleRender";
import PrimaryContainer from "../components/layout/PrimaryContainer";
import WaveformVis from "../components/waveform/WaveformVis";
import BubbleTable from "../components/table/BubbleTable";
import PopUpLayer from "../components/table/PopUpLayer";
import Typography from "@mui/material/Typography";
import SecondaryHeader from "../components/layout/HomePageHeader";
import CommentsTable from "../components/table/CommentsTable";
import ConfirmDialog from "./ConfirmDialog";
export default function HomePage() {
  const [audioDuration, setAudioDuration] = useState(0);
  const [vizWidth, setVizWidth] = useState(800);
  const [audioFileName, setAudioFileName] = useState("");
  const [visibleStartTime, setVisibleStartTime] = useState(0);
  const [visibleEndTime, setVisibleEndTime] = useState(0);
  const [selectedBubble, setSelectedBubble] = useState(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [wavesurfer, setWavesurfer] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [hasFile, setHasFile] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Move file handling functions here
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setAudioFile(fileUrl);
      setAudioFileName(file.name);
      setIsAudioLoaded(true);
      setHasFile(true);
    }
  };

  const confirmFileRemove = () => {
    setAudioFile(null);
    setAudioFileName("");
    setIsAudioLoaded(false);
    setHasFile(false);
    setSelectedBubble(null);
    if (wavesurfer) {
      wavesurfer.destroy();
      setWavesurfer(null);
    }
  };

  const handleFileRemove = () => {
    setIsConfirmDialogOpen(true);
  };

  return (
    <div>
      {/* Secondary Header */}
      <SecondaryHeader
        onFileChange={handleFileChange}
        hasFile={hasFile}
        handleFileRemove={handleFileRemove}
      />

      <PrimaryContainer
        label="Current File:"
        labelColor="white"
        title={
          <Typography
            variant="h6"
            style={{ fontWeight: "bold", color: "#FAFAD2" }}
          >
            {audioFileName || "Load an audio file"}
          </Typography>
        }
      >
        {/* Rest of your code */}
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
              height: "250px",
              position: "relative",
              marginBottom: -2,
            }}
          >
            <BubbleRender
              audioDuration={audioDuration}
              vizWidth={vizWidth}
              visibleStartTime={visibleStartTime}
              visibleEndTime={visibleEndTime}
              setSelectedBubble={setSelectedBubble}
              isAudioLoaded={isAudioLoaded}
              isFocusMode={isFocusMode} // Pass isFocusMode
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
              parentSetWavesurfer={setWavesurfer}
              wavesurfer={wavesurfer}
              audioFile={audioFile} // Pass audioFile as prop
              isFocusMode={isFocusMode} // Pass isFocusMode
              setIsFocusMode={setIsFocusMode} // Pass setIsFocusMode
            />
          </Box>
        </Box>
      </PrimaryContainer>

      {/* Pop up layers for bubbles */}
      {[...Array(6)].map((_, index) => (
        <PopUpLayer key={index} layer={`${index + 1}`} />
      ))}

      {/* Smaller containers for all current bubbles and all comments */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mt: 2,
          width: "100%",
        }}
      >
        {/* BubbleTable Container */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <PrimaryContainer
            label="New Bubble"
            labelColor="white"
            title="All Current Bubbles"
            titleColor="#FF0000"
            info="Contains all bubble information across all layers"
          >
            <BubbleTable
              isAudioLoaded={isAudioLoaded}
              wavesurfer={wavesurfer}
            />
          </PrimaryContainer>
        </Box>

        {/* CommentsTable Container */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <PrimaryContainer
            label="Comments"
            labelColor="white"
            title="All Comments"
            titleColor="#FF0000"
            info="Contains all comments"
          >
            <CommentsTable />
          </PrimaryContainer>
        </Box>
      </Box>
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmFileRemove}
        title="Remove Audio File"
        message="Are you sure you want to remove the current audio file? This will delete all tables. Export the file first if you wish to save your progress."
      />
    </div>
  );
}
