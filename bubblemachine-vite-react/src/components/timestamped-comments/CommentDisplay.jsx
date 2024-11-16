import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { Comment } from "@mui/icons-material";
import { DateTime } from "luxon";
import throttle from "lodash/throttle";
import { useTheme } from "@mui/material/styles";

const CommentDisplay = ({ wavesurfer }) => {
  const theme = useTheme();
  const [comments, setComments] = useState([]);
  const [currentComment, setCurrentComment] = useState(null);
  const [commentDisplayTime, setCommentDisplayTime] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");

  // Throttled function to update current comment
  const updateCurrentComment = useCallback(
    throttle((time) => {
      const activeComment = comments.find(
        (comment) =>
          time >= comment.timestamp &&
          time < comment.timestamp + 0.5 &&
          (currentComment ? comment.id !== currentComment.id : true)
      );

      if (activeComment) {
        setCurrentComment(activeComment);
        setCommentDisplayTime(DateTime.now());
      }

      // Hide the comment after 5 seconds of display
      if (currentComment && commentDisplayTime) {
        const now = DateTime.now();
        const diffInSeconds = now.diff(commentDisplayTime, "seconds").seconds;
        if (diffInSeconds >= 5) {
          setCurrentComment(null);
          setCommentDisplayTime(null);
        }
      }
    }, 200),
    [comments, currentComment, commentDisplayTime]
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

  const handleAddComment = () => {
    if (wavesurfer && newCommentText) {
      const currentTime = wavesurfer.getCurrentTime();
      setComments((prevComments) => [
        ...prevComments,
        {
          id: Date.now(),
          timestamp: currentTime,
          text: newCommentText,
        },
      ]);
      setNewCommentText("");
      setIsDialogOpen(false);
    }
  };

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

      {/* Add Comment IconButton */}
      <IconButton
        onClick={() => setIsDialogOpen(true)}
        disabled={!wavesurfer}
        sx={(theme) => ({
          position: "absolute",
          bottom: 8,
          right: 8,
          border: "1px solid",
          borderColor: theme.palette.mode === "dark" ? "#2A2A3E" : "grey.300",
          color: theme.palette.mode === "dark" ? "#fff" : "inherit",
          backgroundColor:
            theme.palette.mode === "dark" ? "#1E1E2E" : "transparent",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#2C3E50" : "grey.100",
            transform: !wavesurfer ? "none" : "translateY(-2px)",
          },
          opacity: !wavesurfer ? 0.5 : 1,
        })}
      >
        <Comment />
      </IconButton>

      {/* Comment Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add a Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            fullWidth
            multiline
            minRows={3}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            variant="outlined"
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
            InputLabelProps={{
              style: { color: theme.palette.text.secondary },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleAddComment}
            color="primary"
            variant="contained"
            disabled={!newCommentText.trim()}
          >
            Add Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CommentDisplay;
