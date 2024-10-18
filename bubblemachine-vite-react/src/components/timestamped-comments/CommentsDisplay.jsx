import React, { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import { DateTime } from "luxon";

const CommentDisplay = ({ wavesurfer }) => {
  const [comments, setComments] = useState([]);
  const [currentComment, setCurrentComment] = useState(null);
  const [commentDisplayTime, setCommentDisplayTime] = useState(null); // Stores when the comment was displayed

  useEffect(() => {
    if (wavesurfer) {
      const onAudioProcess = (time) => {
        // Check if a new comment should be displayed
        const activeComment = comments.find(
          (comment) =>
            time >= comment.timestamp &&
            time < comment.timestamp + 0.5 && // Small threshold for matching time
            (currentComment ? comment.id !== currentComment.id : true)
        );

        if (activeComment) {
          setCurrentComment(activeComment);
          setCommentDisplayTime(DateTime.now()); // Store the time when the comment was displayed
        }

        // Check if the comment has been displayed for 5 seconds
        if (currentComment && commentDisplayTime) {
          const now = DateTime.now();
          const diffInSeconds = now.diff(commentDisplayTime, "seconds").seconds;

          if (diffInSeconds >= 5) {
            setCurrentComment(null); // Hide the comment after 5 seconds
            setCommentDisplayTime(null); // Reset display time
          }
        }
      };

      // Subscribe to the audioprocess event
      wavesurfer.on("audioprocess", onAudioProcess);

      // Cleanup on unmount or when wavesurfer changes
      return () => {
        wavesurfer.un("audioprocess", onAudioProcess);
      };
    }
  }, [wavesurfer, comments, currentComment, commentDisplayTime]);

  const addComment = () => {
    if (wavesurfer) {
      const currentTime = wavesurfer.getCurrentTime();
      const commentText = prompt("Enter your comment:");
      if (commentText) {
        setComments((prevComments) => [
          ...prevComments,
          {
            id: Date.now(),
            timestamp: currentTime,
            text: commentText,
          },
        ]);
      }
    }
  };

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
      <Button variant="contained" color="primary" onClick={addComment}>
        Add Comment
      </Button>
    </div>
  );
};

export default CommentDisplay;
