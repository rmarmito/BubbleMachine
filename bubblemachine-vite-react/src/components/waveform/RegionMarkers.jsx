import React, { useEffect } from "react";
import { Button } from "@mui/material";
// import { formatTime } from "../../helpers/utils.jsx";

const RegionMarkers = ({
  wavesurfer,
  markStartTime,
  markEndTime,
  selectedStartTime,
  selectedEndTime,
}) => {
  const createRegion = (start, end) => {
    if (wavesurfer.current && start !== null && end !== null && start < end) {
      wavesurfer.current.addRegion({
        start,
        end,
        loop: true,
        color: "rgba(0,123,255,0.5)",
        drag: false,
        resize: false,
      });
    }
  };

  useEffect(() => {
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
    </div>
  );
};

export default RegionMarkers;
