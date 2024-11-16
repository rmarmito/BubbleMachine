// src/components/timestamped-comments/CommentDisplay.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { DateTime } from "luxon";
import throttle from "lodash/throttle";
import { useTheme } from "@mui/material/styles";
import useCommentsStore from "../zustand/commentsStore";

const CommentDisplay = ({ wavesurfer }) => {
  const theme = useTheme();
  const comments = useCommentsStore((state) => state.comments);
  const [currentComment, setCurrentComment] = useState(null);

  // Throttled function to update current comment
  const updateCurrentComment = useCallback(
    throttle((time) => {
      const activeComment = comments.find(
        (comment) =>
          time >= comment.startTime &&
          time <= comment.endTime &&
          (currentComment ? comment.id !== currentComment.id : true)
      );

      if (activeComment) {
        setCurrentComment(activeComment);
      }

      // Hide the comment after its end time
      if (currentComment && time > currentComment.endTime) {
        setCurrentComment(null);
      }
    }, 200),
    [comments, currentComment]
  );

  useEffect(() => {
    if (wavesurfer) {
      const onAudioProcess = (time) => {
        updateCurrentComment(time);
      };
      wavesurfer.on("audioprocess", onAudioProcess);
      return () => {
        wavesurfer.un("audioprocess", onAudioProcess);
      };
    }
  }, [wavesurfer, updateCurrentComment]);

  return (
    <Paper
      elevation={1}
      sx={{
        p: 1,
        width: "100%",
        maxWidth: "600px",
        height: "75px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        position: "relative",
        overflow: "hidden",
        borderRadius: "12px",
        border: "1px solid",
        borderColor:
          theme.palette.mode === "dark" ? "#2A2A3E" : "rgba(0, 0, 0, 0.12)",
      }}
    >
      {/* Current Comment Display */}
      {currentComment && (
        <Box
          sx={{
            px: 2,
            py: 1,
            maxWidth: "100%",
            maxHeight: "100%",
            bgcolor: theme.palette.action.hover,
            borderRadius: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "1rem",
              lineHeight: 1.2,
            }}
          >
            {currentComment.text}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default CommentDisplay;
