import React from "react";
import { Button } from "@mui/material";
import { formatTime } from "../Helpers"; 

const RegionMarkers = ({
  wavesurfer,
  markStartTime,
  markEndTime,
  selectedStartTime,
  selectedEndTime,
}) => {
  // Function to create a region based on start and end times
  const createRegion = (start, end) => {
    if (wavesurfer.current && start !== null && end !== null) {
      // Ensure start is less than end
      if (start > end) [start, end] = [end, start];

      // Create a new region
      wavesurfer.current.addRegion({
        start,
        end,
        loop: true,
        color: "rgba(0,123,255,0.5)",
        drag: false,
        resize: false,
      });

      console.log("Created region:", { start, end });
    }
  };

  // Call this when marking the end time to create a region
  React.useEffect(() => {
    if (selectedStartTime !== null && selectedEndTime !== null) {
      createRegion(selectedStartTime, selectedEndTime);
    }
  }, [selectedStartTime, selectedEndTime]);

  return (
    <div style={{ marginTop: "10px", textAlign: "center" }}>
      <Button variant="contained" color="primary" onClick={markStartTime}>
        Mark Start Time
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={markEndTime}
        disabled={selectedStartTime === null}
      >
        Mark End Time
      </Button>

      {selectedStartTime !== null && (
        <div>
          <span>Marked Start Time: {formatTime(selectedStartTime)}</span>
          {selectedEndTime !== null && (
            <span>, End Time: {formatTime(selectedEndTime)}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Format time in minutes and seconds
/*const formatTime = (time) => {
  if (isNaN(time)) return "0:00.000";

  const minutes = Math.floor(time / 60).toString();
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

  // Extract milliseconds by taking the fractional part of the time
  const milliseconds = Math.floor((time % 1) * 1000)
    .toString()
    .padStart(3, "0");

  return `${minutes}:${seconds}.${milliseconds}`;
};

export default RegionMarkers;*/
