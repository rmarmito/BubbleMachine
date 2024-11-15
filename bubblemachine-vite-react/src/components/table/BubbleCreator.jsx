import React, { useState } from "react";
import { Box, Button, Stack, MenuItem, TextField, Grid } from "@mui/material";
import { Flag, AddCircleOutline, Cancel } from "@mui/icons-material";
import { createID, formatTime } from "../../helpers/utils";
import useBubbleStore from "../zustand/bubbleStore";

const BubbleCreator = ({ wavesurfer }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState("1");
  const addBubble = useBubbleStore((state) => state.addBubble);

  const markStartTime = () => {
    if (wavesurfer) {
      const currentTime = wavesurfer.getCurrentTime();
      setSelectedStartTime(currentTime);
    }
  };

  const markEndTime = () => {
    if (!wavesurfer || selectedStartTime === null) return;
    const endTime = wavesurfer.getCurrentTime();
    const [start, end] = [selectedStartTime, endTime].sort((a, b) => a - b);

    const newBubble = {
      id: createID(),
      startTime: formatTime(start),
      stopTime: formatTime(end),
      layer: selectedLayer,
      bubbleName: `Bubble ${selectedLayer}-${formatTime(start)}`,
    };

    addBubble(newBubble);
    handleCancel();
  };

  const handleCancel = () => {
    setIsCreating(false);
    setSelectedStartTime(null);
    setSelectedLayer("1");
  };

  if (!isCreating) {
    return (
      <Button
        variant="contained"
        onClick={() => setIsCreating(true)}
        startIcon={<AddCircleOutline />}
        fullWidth
        sx={{
          justifyContent: "flex-start",
          height: "38px",
        }}
      >
        Create Bubble
      </Button>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={1}>
        {" "}
        {/* Reduced from 2 to 1 */}
        {/* Top row with Mark Start and Mark End buttons */}
        <Grid container spacing={1}>
          {" "}
          {/* Reduced from 2 to 1 */}
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={markStartTime}
              startIcon={<Flag />}
              fullWidth
              color={selectedStartTime !== null ? "success" : "primary"}
              sx={{
                justifyContent: "flex-left",
                height: "38px",
                px: 1, // Add minimal padding
              }}
            >
              {selectedStartTime !== null ? "Mark Start (Again)" : "Mark Start"}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={markEndTime}
              disabled={selectedStartTime === null}
              startIcon={<Flag />}
              fullWidth
              sx={{
                justifyContent: "flex-start",
                height: "38px",
                px: 1, // Add minimal padding
                bgcolor:
                  selectedStartTime === null ? "grey.300" : "primary.main",
                "&:disabled": {
                  bgcolor: "grey.300",
                },
              }}
            >
              Mark End
            </Button>
          </Grid>
        </Grid>
        {/* Bottom row with Layer and Cancel buttons */}
        <Grid container spacing={1}>
          {" "}
          {/* Reduced from 2 to 1 */}
          <Grid item xs={6}>
            <TextField
              select
              size="small"
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
              label="Layer"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "38px",
                },
                "& .MuiInputLabel-root": {
                  top: -4, // Move label up slightly
                },
                "& .MuiInputLabel-shrink": {
                  top: 4, // Adjust shrunk label position
                },
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <MenuItem key={num} value={String(num)}>
                  {num}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              startIcon={<Cancel />}
              color="error"
              fullWidth
              sx={{
                justifyContent: "flex-start",
                height: "38px",
                px: 1, // Add minimal padding
                border: "2px solid",
                "&:hover": {
                  border: "2px solid",
                },
              }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default BubbleCreator;
