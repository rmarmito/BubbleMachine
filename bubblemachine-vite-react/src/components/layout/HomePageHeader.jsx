import React, { useState } from "react";
import { Box, Button, Stack, Tooltip } from "@mui/material";
import { Upload, Download, ImportExport, Cancel } from "@mui/icons-material";
import { useTheme } from "../../styles/context/ThemeContext.jsx";
import useBubbleStore from "../zustand/bubbleStore.jsx";
import useCommentsStore from "../zustand/commentsStore";
import NotificationDialog from "./NotificationDialog";

const SecondaryHeader = ({ onFileChange, hasFile, handleFileRemove }) => {
  const { darkMode } = useTheme();
  const bubbles = useBubbleStore((state) => state.bubbles);
  const addBubble = useBubbleStore((state) => state.addBubble);
  const clearBubbles = useBubbleStore((state) => state.clearBubbles);
  const comments = useCommentsStore((state) => state.comments);
  const [notificationOpen, setNotificationOpen] = useState(false); // Add this state

  // Styles
  const containerStyles = {
    width: "100%",
    padding: 2,
    mt: -2,
    backgroundColor: darkMode ? "#1A1A2E" : "#2C3E50",
    borderBottom: `1px solid ${darkMode ? "#2A2A3E" : "#34495E"}`,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 2,
    marginBottom: 2,
    position: "relative",
    overflow: "hidden",
  };

  const buttonBaseStyles = {
    height: "42px",
    borderRadius: "21px",
    textTransform: "none",
    transition: "all 0.2s ease-in-out",
    fontSize: "0.95rem",
    fontWeight: 500,
    px: 3,
    color: "white",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    },
    "&:disabled": {
      opacity: 0.5,
      backgroundColor: darkMode
        ? "rgba(42, 42, 62, 0.3)"
        : "rgba(44, 62, 80, 0.3)",
      color: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.5)",
    },
  };

  const primaryButtonStyles = {
    ...buttonBaseStyles,
    background: darkMode
      ? "linear-gradient(45deg, #1E1E2E, #2C3E50)"
      : "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    border: darkMode ? "1px solid #2A2A3E" : "none",
    "&:hover": {
      ...buttonBaseStyles["&:hover"],
      background: darkMode
        ? "linear-gradient(45deg, #2A2A3E, #34495E)"
        : "linear-gradient(45deg, #2196F3 60%, #21CBF3 90%)",
    },
  };

  const uploadButtonStyles = {
    ...buttonBaseStyles,
    backgroundColor: "transparent",
    border: `2px solid ${darkMode ? "#2A2A3E" : "#ffffff"}`,
    "&:hover": {
      ...buttonBaseStyles["&:hover"],
      backgroundColor: darkMode
        ? "rgba(42, 42, 62, 0.2)"
        : "rgba(255, 255, 255, 0.1)",
      borderColor: darkMode ? "#34495E" : "#ffffff",
    },
  };

  const removeButtonStyles = {
    ...buttonBaseStyles,
    backgroundColor: "transparent",
    border: "2px solid #ff4444",
    color: "#ff4444",
    "&:hover": {
      ...buttonBaseStyles["&:hover"],
      backgroundColor: "rgba(255, 68, 68, 0.1)",
    },
  };

  const handleExport = () => {
    if (!hasFile) {
      alert("Please load an audio file before exporting data");
      return;
    }

    if (bubbles.length === 0 && comments.length === 0) {
      alert("No data to export");
      return;
    }

    try {
      // Prepare the data for export
      const exportData = {
        bubbles: bubbles.map((bubble) => ({
          id: bubble.id,
          layer: bubble.layer,
          bubbleName: bubble.bubbleName,
          startTime: bubble.startTime,
          stopTime: bubble.stopTime,
          color: bubble.color,
        })),
        comments: comments.map((comment) => ({
          id: comment.id,
          startTime: comment.startTime,
          endTime: comment.endTime,
          text: comment.text,
        })),
      };

      // Create the blob and download link
      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "bubblemachine-data.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Error exporting data");
    }
  };

  const handleImport = () => {
    if (!hasFile) {
      alert("Please load an audio file before importing bubble data");
      return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedData = JSON.parse(event.target.result);

            // Validate imported data format
            if (!importedData.bubbles || !importedData.comments) {
              throw new Error("Invalid data format");
            }

            // Confirm if user wants to clear existing data
            if (bubbles.length > 0 || comments.length > 0) {
              const confirmClear = window.confirm(
                "Importing will replace existing data. Do you want to continue?"
              );
              if (!confirmClear) return;
            }

            // Clear existing bubbles
            clearBubbles();

            // Clear existing comments
            useCommentsStore.getState().clearComments();

            // Import new bubbles
            importedData.bubbles.forEach((bubble) => {
              addBubble({
                ...bubble,
                id: bubble.id,
              });
            });

            // Import new comments
            importedData.comments.forEach((comment) => {
              useCommentsStore.getState().addComment({
                ...comment,
                id: comment.id,
              });
            });

            setNotificationOpen(true);
          } catch (error) {
            console.error("Import error:", error);
            alert("Error importing data. Please check the file format.");
          }
        };
        reader.readAsText(file);
      }
    };

    fileInput.click();
  };
  return (
    <Box sx={containerStyles}>
      {/* Control buttons - now all in one group */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Tooltip
          title={!hasFile ? "Load audio file first" : "Import Bubble data"}
        >
          <span>
            <Button
              variant="contained"
              startIcon={<ImportExport />}
              sx={primaryButtonStyles}
              onClick={handleImport}
              disabled={!hasFile}
            >
              Import
            </Button>
          </span>
        </Tooltip>

        <Tooltip
          title={!hasFile ? "Load audio file first" : "Export Bubble data"}
        >
          <span>
            <Button
              variant="contained"
              startIcon={<Download />}
              sx={primaryButtonStyles}
              onClick={handleExport}
              disabled={!hasFile}
            >
              Export
            </Button>
          </span>
        </Tooltip>

        <input
          type="file"
          accept="audio/*"
          onChange={onFileChange}
          style={{ display: "none" }}
          id="audio-upload"
        />
        <label htmlFor="audio-upload">
          {!hasFile ? (
            <Tooltip title="Load audio file">
              <Button
                variant="outlined"
                component="span"
                startIcon={<Upload />}
                sx={uploadButtonStyles}
              >
                Load Audio
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Remove current audio">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleFileRemove();
                }}
                variant="outlined"
                component="span"
                startIcon={<Cancel />}
                sx={removeButtonStyles}
              >
                Remove Audio
              </Button>
            </Tooltip>
          )}
        </label>
      </Stack>

      {/* Background animated gradient */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          background: darkMode
            ? `radial-gradient(circle at 10% 20%, rgba(78, 158, 231, 0.03) 0%, transparent 20%),
               radial-gradient(circle at 90% 50%, rgba(78, 158, 231, 0.02) 0%, transparent 20%),
               radial-gradient(circle at 30% 80%, rgba(78, 158, 231, 0.03) 0%, transparent 20%)`
            : `radial-gradient(circle at 10% 20%, rgba(44, 62, 80, 0.03) 0%, transparent 20%),
               radial-gradient(circle at 90% 50%, rgba(78, 158, 231, 0.02) 0%, transparent 20%),
               radial-gradient(circle at 30% 80%, rgba(44, 62, 80, 0.03) 0%, transparent 20%)`,
          pointerEvents: "none",
        }}
      />
      <NotificationDialog
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        title="Import Successful"
        message="All bubble and comment data has been imported successfully."
      />
    </Box>
  );
};

export default SecondaryHeader;
