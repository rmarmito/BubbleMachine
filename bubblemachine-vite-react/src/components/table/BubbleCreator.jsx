import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  MenuItem,
  TextField,
  Grid,
  Fade,
  Tooltip,
} from "@mui/material";
import { Flag, AddCircleOutline, Cancel } from "@mui/icons-material";
import { createID, formatTime } from "../../helpers/utils";
import useBubbleStore from "../zustand/bubbleStore";
import { useTheme } from "../../styles/context/ThemeContext";

const BubbleCreator = ({ wavesurfer, disabled }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState("1");
  const addBubble = useBubbleStore((state) => state.addBubble);
  const { darkMode } = useTheme();

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
      <Tooltip
        title={
          disabled ? "Upload a file to enable bubbles" : "Create new bubble"
        }
        placement="left"
      >
        <Box
          sx={{
            width: "100%",
            height: "75px",
            borderRadius: "21px 8px 8px 21px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: disabled
              ? darkMode
                ? "rgba(30, 30, 46, 0.5)"
                : "rgba(200, 200, 200, 0.5)"
              : darkMode
              ? "linear-gradient(45deg, #1E1E2E, #2C3E50)"
              : "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            boxShadow: disabled
              ? "none"
              : darkMode
              ? "0 3px 5px 2px rgba(30, 30, 46, 0.3)"
              : "0 3px 5px 2px rgba(33, 203, 243, .3)",
            opacity: disabled ? 0.6 : 1,
            pointerEvents: disabled ? "none" : "auto",
            transition: "all 0.2s ease-in-out",
          }}
        >
          <Button
            variant="contained"
            onClick={() => !disabled && setIsCreating(true)}
            startIcon={<AddCircleOutline />}
            fullWidth
            sx={{
              height: "100%",
              background: "none",
              backgroundColor: "transparent",
              color: "white",
              fontWeight: 500,
              fontSize: "0.95rem",
              textTransform: "none",
              boxShadow: "none",
              "&.MuiButton-contained": {
                backgroundColor: "transparent",
              },
              "&:hover": {
                boxShadow: "none",
                background: disabled
                  ? "none"
                  : darkMode
                  ? "linear-gradient(45deg, #2A2A3E, #34495E)"
                  : "linear-gradient(45deg, #2196F3 60%, #21CBF3 90%)",
              },
            }}
          >
            Create Bubble
          </Button>
        </Box>
      </Tooltip>
    );
  }

  if (disabled) {
    return null; // Or return a disabled state visualization
  }

  return (
    <Fade in={isCreating}>
      <Box sx={{ width: "100%" }}>
        <Stack spacing={1}>
          <Grid container spacing={1}>
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
                  px: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  backgroundColor: darkMode
                    ? selectedStartTime !== null
                      ? "#1E4620"
                      : "#1E1E2E"
                    : undefined,
                  "&:hover": {
                    backgroundColor: darkMode
                      ? selectedStartTime !== null
                        ? "#2E5730"
                        : "#2A2A3E"
                      : undefined,
                  },
                }}
              >
                {selectedStartTime !== null ? "Set Start" : "Start"}
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
                  px: 1,
                  bgcolor: darkMode
                    ? selectedStartTime === null
                      ? "#1E1E2E"
                      : "#1E1E2E"
                    : selectedStartTime === null
                    ? "grey.300"
                    : "primary.main",
                  "&:hover": {
                    bgcolor: darkMode
                      ? selectedStartTime === null
                        ? "#2A2A3E"
                        : "#2A2A3E"
                      : undefined,
                  },
                  "&:disabled": {
                    bgcolor: darkMode ? "#141422" : "grey.300",
                  },
                }}
              >
                End
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
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
                    backgroundColor: darkMode ? "#1E1E2E" : undefined,
                  },
                  "& .MuiInputLabel-root": {
                    top: -4,
                  },
                  "& .MuiInputLabel-shrink": {
                    top: 4,
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
                  px: 1,
                  border: "2px solid",
                  borderColor: darkMode ? "#2A2A3E" : undefined,
                  color: darkMode ? "#ff4444" : undefined,
                  "&:hover": {
                    border: "2px solid",
                    borderColor: darkMode ? "#3A3A4E" : undefined,
                    bgcolor: darkMode ? "rgba(255, 68, 68, 0.1)" : "error.50",
                  },
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Fade>
  );
};

export default BubbleCreator;
