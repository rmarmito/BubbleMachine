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
import { createID, formatTime } from "../../helpers/utils";
import useCommentsStore from "../zustand/commentsStore";
import { useTheme } from "../../styles/context/ThemeContext"; // Use your custom theme context

const CommentCreator = ({ wavesurfer, disabled }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [commentText, setCommentText] = useState("");
  const addComment = useCommentsStore((state) => state.addComment);
  const { darkMode } = useTheme(); // Get darkMode from your theme context

  const markStartTime = () => {
    if (wavesurfer) {
      const currentTime = wavesurfer.getCurrentTime();
      setSelectedStartTime(currentTime);
    }
  };

  const markEndTime = () => {
    if (wavesurfer) {
      const currentTime = wavesurfer.getCurrentTime();
      setSelectedEndTime(currentTime);
    }
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
      <Tooltip title="Add new comment" placement="left">
        <Button
          variant="contained"
          onClick={() => setIsCreating(true)}
          startIcon={<AddCircleOutline />}
          fullWidth
          sx={{
            height: "75px",
            borderRadius: "21px 8px 8px 21px",
            background: darkMode
              ? "linear-gradient(45deg, #1E1E2E, #2C3E50)"
              : "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            boxShadow: darkMode
              ? "0 3px 5px 2px rgba(30, 30, 46, 0.3)"
              : "0 3px 5px 2px rgba(33, 203, 243, .3)",
            color: "white",
            textTransform: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
            border: darkMode ? "1px solid #2A2A3E" : "none",
            "&:hover": {
              background: darkMode
                ? "linear-gradient(45deg, #2A2A3E, #34495E)"
                : "linear-gradient(45deg, #2196F3 60%, #21CBF3 90%)",
              boxShadow: darkMode
                ? "0 4px 8px 2px rgba(30, 30, 46, 0.4)"
                : "0 4px 8px 2px rgba(33, 203, 243, .4)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Add Comment
        </Button>
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
          {/* First Row: Start and End Time Buttons */}
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
                {selectedStartTime !== null
                  ? `Start: ${formatTime(selectedStartTime)}`
                  : "Set Start"}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                onClick={markEndTime}
                startIcon={<Flag />}
                fullWidth
                color={selectedEndTime !== null ? "success" : "primary"}
                disabled={selectedStartTime === null}
                sx={{
                  justifyContent: "flex-start",
                  height: "38px",
                  px: 1,
                  backgroundColor: darkMode
                    ? selectedEndTime !== null
                      ? "#1E4620"
                      : "#1E1E2E"
                    : selectedEndTime !== null
                    ? "primary.main"
                    : "grey.300",
                  "&:hover": {
                    backgroundColor: darkMode
                      ? selectedEndTime !== null
                        ? "#2E5730"
                        : "#2A2A3E"
                      : undefined,
                  },
                  "&:disabled": {
                    backgroundColor: darkMode ? "#141422" : "grey.300",
                  },
                }}
              >
                {selectedEndTime !== null
                  ? `End: ${formatTime(selectedEndTime)}`
                  : "Set End"}
              </Button>
            </Grid>
          </Grid>

          {/* Second Row: Comment Input */}
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

          {/* Third Row: Cancel and Save Buttons */}
          <Grid container spacing={1}>
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
                  justifyContent: "flex-start",
                  height: "38px",
                  px: 1,
                  backgroundColor: darkMode ? "#1E1E2E" : undefined,
                  "&:hover": {
                    backgroundColor: darkMode ? "#2A2A3E" : undefined,
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
