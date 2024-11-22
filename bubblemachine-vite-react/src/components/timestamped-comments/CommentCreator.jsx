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
import { useTheme } from "../../styles/context/ThemeContext";

const CommentCreator = ({ wavesurfer, disabled }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [commentText, setCommentText] = useState("");
  const addComment = useCommentsStore((state) => state.addComment);
  const { darkMode } = useTheme();

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

  const isSaveEnabled =
    selectedStartTime !== null &&
    selectedEndTime !== null &&
    commentText.trim();

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
                  justifyContent: "flex-start",
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
                color={selectedEndTime !== null ? "success" : "primary"}
                sx={{
                  justifyContent: "flex-start",
                  height: "38px",
                  px: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  backgroundColor: darkMode
                    ? selectedEndTime !== null
                      ? "#1E4620"
                      : "#1E1E2E"
                    : undefined,
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
                {selectedEndTime !== null ? "Set End" : "End"}
              </Button>
            </Grid>
          </Grid>

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
                fullWidth
                disabled={!isSaveEnabled}
                sx={{
                  justifyContent: "flex-start",
                  height: "38px",
                  px: 1,
                  color: isSaveEnabled ? "white" : undefined,
                  backgroundColor: isSaveEnabled
                    ? "#003366" // Midnight navy color when enabled
                    : darkMode
                    ? "#1E1E2E"
                    : undefined,
                  "&:hover": {
                    backgroundColor: isSaveEnabled
                      ? "#002244" // Slightly darker shade on hover
                      : darkMode
                      ? "#2A2A3E"
                      : undefined,
                  },
                  "&:disabled": {
                    backgroundColor: darkMode ? "#141422" : "grey.300",
                  },
                }}
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
