import React from "react";
import { Button } from "@mui/material";
import { formatTime } from "../../helpers/utils.jsx";

const RegionMarkers = ({
  wavesurfer,
  markStartTime,
  markEndTime,
  selectedStartTime,
  selectedEndTime,
  createRegion,
}) => {
  React.useEffect(() => {
    if (selectedStartTime !== null && selectedEndTime !== null) {
      createRegion(selectedStartTime, selectedEndTime);
    }
  }, [selectedStartTime, selectedEndTime, createRegion]);

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

export default RegionMarkers;
