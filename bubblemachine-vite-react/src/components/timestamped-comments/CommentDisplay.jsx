import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
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
    }, 200), // Throttling the audio process event to every 200ms
    [comments, currentComment, commentDisplayTime]
  );

  useEffect(() => {
    if (wavesurfer) {
      const onAudioProcess = (time) => {
        updateCurrentComment(time);
      };

      // Subscribe to the audioprocess event
      wavesurfer.on("audioprocess", onAudioProcess);

      // Cleanup on unmount or when wavesurfer changes
      return () => {
        wavesurfer.un("audioprocess", onAudioProcess);
      };
    }
  }, [wavesurfer, updateCurrentComment]);

  const handleAddComment = () => {
    if (wavesurfer) {
      const currentTime = wavesurfer.getCurrentTime();
      if (newCommentText) {
        setComments((prevComments) => [
          ...prevComments,
          {
            id: Date.now(),
            timestamp: currentTime,
            text: newCommentText,
          },
        ]);
        setNewCommentText(""); // Clear text field
      }
      setIsDialogOpen(false); // Close dialog
    }
  };

  const openCommentDialog = () => setIsDialogOpen(true);
  const closeCommentDialog = () => setIsDialogOpen(false);

  return (
    <div>
      {/* Display the current comment */}
      {currentComment && (
        <div
          style={{
            marginTop: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "5px",
            display: "inline-block",
          }}
        >
          {currentComment.text}
        </div>
      )}
      <div />
      <Button variant="contained" color="primary" onClick={openCommentDialog}>
        Add Comment
      </Button>

      {/* Comment input dialog */}
      <Dialog open={isDialogOpen} onClose={closeCommentDialog}>
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
          <Button onClick={closeCommentDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddComment} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CommentDisplay;
