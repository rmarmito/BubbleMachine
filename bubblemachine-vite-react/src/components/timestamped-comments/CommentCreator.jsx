import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Grid,
  Fade,
  Tooltip,
} from "@mui/material";
import { Flag, AddCircleOutline, Cancel } from "@mui/icons-material";
import { createID } from "../../helpers/utils";
import useCommentsStore from "../zustand/commentsStore";
import { useTheme } from "../../styles/context/ThemeContext"; // Use your custom theme context

const CommentCreator = ({ wavesurfer, disabled }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [commentText, setCommentText] = useState("");
  const addComment = useCommentsStore((state) => state.addComment);
  const { darkMode } = useTheme(); // Get darkMode from your theme context

  const commentInput = (
    <TextField
      label="Comment"
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      fullWidth
      autoFocus
      multiline
      maxRows={2}
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": {
          backgroundColor: darkMode ? "#1E1E2E" : undefined,
          height: "100%",
        },
      }}
    />
  );

  const markStartTime = () => {
    if (wavesurfer) {
      const currentTime = wavesurfer.getCurrentTime();
      setSelectedStartTime(currentTime);
    }
  };

  const markEndTime = () => {
    if (!wavesurfer || selectedStartTime === null) return;
    const currentTime = wavesurfer.getCurrentTime();
    setSelectedEndTime(currentTime);
  };

  const handleSave = () => {
    if (
      selectedStartTime !== null &&
      selectedEndTime !== null &&
      commentText.trim()
    ) {
      const [start, end] = [selectedStartTime, selectedEndTime].sort(
        (a, b) => a - b
      );

      const newComment = {
        id: createID(),
        startTime: start,
        endTime: end,
        text: commentText.trim(),
      };

      addComment(newComment);
      handleCancel();
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setSelectedStartTime(null);
    setSelectedEndTime(null);
    setCommentText("");
  };

  if (!isCreating) {
    return (
      <Tooltip
        title={
          disabled ? "Upload a file to enable comments" : "Add new comment"
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
            Add Comment
          </Button>
        </Box>
      </Tooltip>
    );
  }

  if (disabled) {
    return null;
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
                  justifyContent: "center",
                  height: "38px",
                  px: 1,
                  backgroundColor: darkMode
                    ? selectedStartTime !== null
                      ? "#1E4620" // Green for dark mode when selected
                      : "#1E1E2E"
                    : undefined,
                  "&:hover": {
                    backgroundColor: darkMode
                      ? selectedStartTime !== null
                        ? "#2E5730" // Darker green on hover
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
                  justifyContent: "center",
                  height: "38px",
                  px: 1,
                  backgroundColor: selectedStartTime
                    ? darkMode
                      ? "#1E1E2E"
                      : "primary.main"
                    : darkMode
                    ? "#1E1E2E"
                    : "grey.300",
                  "&:hover": {
                    backgroundColor: selectedStartTime
                      ? darkMode
                        ? "#2A2A3E"
                        : "primary.dark"
                      : undefined,
                  },
                  "&:disabled": {
                    backgroundColor: darkMode ? "#141422" : "grey.300",
                  },
                }}
              >
                End
              </Button>
            </Grid>
          </Grid>

          {/* Comment Input */}
          <TextField
            label="Comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: darkMode ? "#1E1E2E" : undefined,
              },
            }}
          />

          {/* Cancel and Save Buttons */}
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                startIcon={<Cancel />}
                color="error"
                fullWidth
                sx={{
                  justifyContent: "center",
                  height: "38px",
                  px: 1,
                  border: "2px solid",
                  borderColor: darkMode ? "#2A2A3E" : undefined,
                  color: darkMode ? "#ff4444" : undefined,
                  "&:hover": {
                    border: "2px solid",
                    borderColor: darkMode ? "#3A3A4E" : undefined,
                    backgroundColor: darkMode
                      ? "rgba(255, 68, 68, 0.1)"
                      : "error.50",
                  },
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                onClick={handleSave}
                color="primary"
                fullWidth
                sx={{
                  justifyContent: "center",
                  height: "38px",
                  px: 1,
                  backgroundColor:
                    selectedStartTime !== null &&
                    selectedEndTime !== null &&
                    commentText.trim()
                      ? darkMode
                        ? "#0A74DA" // Blue for dark mode
                        : "info.main" // Blue for light mode
                      : darkMode
                      ? "#1E1E2E"
                      : "grey.300",
                  "&:hover": {
                    backgroundColor:
                      selectedStartTime !== null &&
                      selectedEndTime !== null &&
                      commentText.trim()
                        ? darkMode
                          ? "#0C86F5"
                          : "info.dark"
                        : darkMode
                        ? "#2A2A3E"
                        : undefined,
                  },
                  "&:disabled": {
                    backgroundColor: darkMode ? "#141422" : "grey.300",
                  },
                }}
                disabled={
                  selectedStartTime === null ||
                  selectedEndTime === null ||
                  !commentText.trim()
                }
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Fade>
  );
};

export default CommentCreator;
