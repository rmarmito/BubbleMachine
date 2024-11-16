import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  IconButton,
} from "@mui/material";
import { Comment } from "@mui/icons-material";
import { DateTime } from "luxon";
import throttle from "lodash/throttle";

const CommentDisplay = ({ wavesurfer }) => {
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
        p: 2,
        height: "100px",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Comments Display */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {currentComment && (
          <Box
            sx={{
              p: 1,
              mb: 1,
              bgcolor: "grey.100",
              borderRadius: 1,
              display: "inline-block",
            }}
          >
            {currentComment.text}
          </Box>
        )}
      </Box>

      {/* Add Comment Button */}
      <IconButton
        color="primary"
        onClick={() => setIsDialogOpen(true)}
        sx={{ position: "absolute", right: 8, bottom: 8 }}
      >
        <Comment />
      </IconButton>

      {/* Comment Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Add a Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            fullWidth
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddComment} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CommentDisplay;
