import React, { useState, useEffect, useCallback } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import throttle from "lodash/throttle";
import useCommentsStore from "../zustand/commentsStore";

const CommentDisplay = ({
  wavesurfer,
  isCreating,
  commentText,
  setCommentText,
  darkMode,
}) => {
  const theme = useTheme();
  const comments = useCommentsStore((state) => state.comments);
  const [currentComment, setCurrentComment] = useState(null);

  const renderCommentInput = isCreating && (
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
  const updateCurrentComment = useCallback(
    throttle((time) => {
      const activeComments = comments.filter(
        (comment) => time >= comment.startTime && time <= comment.endTime
      );

      if (activeComments.length === 0) {
        setCurrentComment(null);
        return;
      }

      const sortedComments = activeComments.sort(
        (a, b) => b.startTime - a.startTime
      );

      const latestComment = sortedComments[0];

      // Only update if we're showing a different comment
      if (!currentComment || currentComment.id !== latestComment.id) {
        setCurrentComment(latestComment);
      }

      // Hide comment if current time is outside its window
      if (
        currentComment &&
        (time < currentComment.startTime || time > currentComment.endTime)
      ) {
        setCurrentComment(null);
      }
    }, 200),
    [comments, currentComment]
  );

  // Clear current comment if comments array is cleared
  useEffect(() => {
    if (comments.length === 0) {
      setCurrentComment(null);
    }
  }, [comments]);

  // wavesurfer init
  useEffect(() => {
    if (wavesurfer) {
      const onAudioProcess = (time) => {
        updateCurrentComment(time);
      };

      const onSeek = (time) => {
        updateCurrentComment(time);
      };

      wavesurfer.on("audioprocess", onAudioProcess);
      wavesurfer.on("seek", onSeek);

      return () => {
        wavesurfer.un("audioprocess", onAudioProcess);
        wavesurfer.un("seek", onSeek);
      };
    }
  }, [wavesurfer, updateCurrentComment]);

  return (
    <Paper
      elevation={1}
      sx={{
        p: 1,
        width: "100%",
        flex: 1,
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
      {isCreating
        ? renderCommentInput
        : currentComment && (
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
