import { useState, useRef } from "react";
import { Box, Popper, ClickAwayListener } from "@mui/material";
import { ChromePicker } from "react-color";

const ColorPickerCell = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const anchorRef = useRef(null);

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        ref={anchorRef}
        onClick={() => setShowPicker(!showPicker)}
        sx={{
          width: "36px",
          height: "24px",
          backgroundColor: value || "#fff",
          cursor: "pointer",
          border: "2px solid #fff",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
          borderRadius: "2px",
        }}
      />
      <Popper
        open={showPicker}
        anchorEl={anchorRef.current}
        placement="right-start"
        style={{ zIndex: 9999 }}
      >
        <ClickAwayListener onClickAway={() => setShowPicker(false)}>
          <div>
            <ChromePicker
              color={value || "#fff"}
              onChange={(color) => {
                onChange(color.hex);
              }}
            />
          </div>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default ColorPickerCell;
