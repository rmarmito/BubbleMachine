import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import { Upload, Delete } from "@mui/icons-material";

const FileActions = ({ onFileChange, onDeleteClick }) => {
  const handleFileChange = (e) => {
    if (onFileChange) {
      onFileChange(e);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="audio-upload"
      />
      <label htmlFor="audio-upload">
        <Button
          variant="outlined"
          component="span"
          size="small"
          sx={{ mr: 1 }}
          startIcon={<Upload />}
        >
          Change File
        </Button>
      </label>
      <IconButton onClick={onDeleteClick} color="error" size="small">
        <Delete />
      </IconButton>
    </Box>
  );
};

export default FileActions;
