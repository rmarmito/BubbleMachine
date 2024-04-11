import React from "react";
import BubbleBox from "../components/BubbleBox";
import { Box } from "@mui/material";

const BubbleLayer = () => {
  return (
    <div>
      <BubbleBox
        label="Now Playing"
        labelColor="#ffc107"
        title="Darude Sandstorm"
        titleColor="white"
      >
        {/* more box content */}
        <Box
          sx={{
            border: 1,
            borderColor: "black",
            borderRadius: "10px",
            backgroundColor: "white",
            p: 20,
          }}
        >
          Bubbles will go here :)
        </Box>
      </BubbleBox>
    </div>
  );
};

export default BubbleLayer;
