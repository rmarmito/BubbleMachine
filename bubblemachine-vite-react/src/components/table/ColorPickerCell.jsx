import React, { useState } from "react";
import { Box, useTheme, ClickAwayListener, Popper } from "@mui/material";
import { HexColorPicker } from "react-colorful";

// Default color presets
const colorPresets = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEEAD", // Yellow
  "#D4A5A5", // Pink
  "#9B59B6", // Purple
  "#3498DB", // Bright Blue
  "#E67E22", // Orange
  "#2ECC71", // Emerald
];

const ColorPickerCell = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setShowPicker(!showPicker);
  };

  const handleClose = () => {
    setShowPicker(false);
    setAnchorEl(null);
  };

  const handleColorChange = (newColor) => {
    onChange(newColor);
    // Don't close the picker when using the color picker itself
  };

  const handlePresetClick = (color) => {
    onChange(color);
    handleClose();
  };

  return (
    <div>
      <Box
        onClick={handleClick}
        sx={{
          width: "36px",
          height: "24px",
          borderRadius: "4px",
          backgroundColor: value,
          cursor: "pointer",
          border: `2px solid ${theme.palette.divider}`,
          transition: "all 0.2s",
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: theme.shadows[2],
          },
        }}
      />
      <Popper
        open={showPicker}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: theme.shadows[4],
              p: 1.5,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                mb: 1.5,
                display: "flex",
                gap: 0.5,
                flexWrap: "wrap",
                width: "200px",
              }}
            >
              {colorPresets.map((color) => (
                <Box
                  key={color}
                  onClick={() => handlePresetClick(color)}
                  sx={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: color,
                    cursor: "pointer",
                    borderRadius: "4px",
                    border:
                      value === color
                        ? `2px solid ${theme.palette.primary.main}`
                        : `2px solid transparent`,
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "scale(1.1)",
                      boxShadow: theme.shadows[2],
                    },
                  }}
                />
              ))}
            </Box>
            <HexColorPicker
              color={value}
              onChange={handleColorChange}
              style={{ width: "200px" }}
            />
          </Box>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default ColorPickerCell;
