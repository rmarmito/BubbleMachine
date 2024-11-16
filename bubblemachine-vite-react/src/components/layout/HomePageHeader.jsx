import React from "react";
import { Box, Button } from "@mui/material";
import { Upload, Download, ImportExport, Cancel } from "@mui/icons-material";

const SecondaryHeader = ({ onFileChange, hasFile, handleFileRemove }) => {
  return (
    <Box
      sx={{
        width: "100%",
        padding: 2,
        backgroundColor: "lightgray",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2,
      }}
    >
      {/* Left Side - Import/Export Buttons */}
      <Box>
        <Button
          variant="contained"
          startIcon={<ImportExport />}
          sx={{ marginRight: 1 }}
          onClick={() => {
            // Handle Import action
            // Implement functionality later
          }}
        >
          Import
        </Button>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={() => {
            // Handle Export action
            // Implement functionality later
          }}
        >
          Export
        </Button>
      </Box>

      {/* Right Side - Upload/Remove Button */}
      <Box>
        <input
          type="file"
          accept="audio/*"
          onChange={onFileChange}
          style={{ display: "none" }}
          id="audio-upload"
        />
        <label htmlFor="audio-upload">
          {!hasFile ? (
            <Button
              variant="outlined"
              component="span"
              startIcon={<Upload />}
              size="small"
            >
              Upload Audio
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleFileRemove();
              }}
              variant="outlined"
              component="span"
              startIcon={<Cancel />}
              size="small"
              color="error"
            >
              Remove Audio
            </Button>
          )}
        </label>
      </Box>
    </Box>
  );
};

export default SecondaryHeader;
