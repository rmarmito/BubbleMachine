import React, { useEffect, useRef, useState } from "react";
import useBubbleStore from "../zustand/bubbleStore.jsx";
import {
  convertToMilliseconds,
  addTransparency,
} from "../../helpers/utils.jsx";

const BubbleRender = ({
  audioDuration = 0,
  vizWidth = 800,
  visibleStartTime = 0,
  visibleEndTime = audioDuration,
  setSelectedBubble,
  isAudioLoaded = false, // Add this prop
}) => {
  const bubbleData = useBubbleStore((state) => state.bubbles);
  const containerRef = useRef(null);
  const [hoveredBubble, setHoveredBubble] = useState(null);

  const visStartMs = convertToMilliseconds(visibleStartTime) || 0;
  const visStopMs = convertToMilliseconds(visibleEndTime) || audioDuration;

  // Custom cursor style based on audio loaded state
  const cursorStyle = isAudioLoaded ? "pointer" : "not-allowed";

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "200px",
        cursor: cursorStyle,
      }}
    >
      {bubbleData.map((bubbleData, index) => {
        if (!bubbleData?.startTime || !bubbleData?.stopTime) return null;

        const startTime = convertToMilliseconds(bubbleData.startTime) || 0;
        const stopTime = convertToMilliseconds(bubbleData.stopTime) || 0;

        if (startTime === 0 || stopTime === 0) return null;
        if (startTime > visStopMs || stopTime < visStartMs) return null;

        const visibleDuration = Math.max(1, visStopMs - visStartMs);
        const startPosition =
          Math.max(0, ((startTime - visStartMs) / visibleDuration) * vizWidth) +
          20;
        const endPosition =
          Math.min(
            vizWidth,
            ((stopTime - visStartMs) / visibleDuration) * vizWidth
          ) + 20;
        const bubbleWidth = Math.max(0, endPosition - startPosition);

        // Use the actual layer value from the bubble data
        const layer = parseInt(bubbleData.layer) || 1;
        const bubbleHeight = layer * 50;
        const bubbleLevel = 6 - layer;

        const divStyle = {
          bottom: 0,
          backgroundColor: addTransparency(bubbleData.color || "#4E9EE7", 0.6),
          left: `${startPosition}px`,
          width: `${bubbleWidth}px`,
          height: `${bubbleHeight}px`,
          zIndex: bubbleLevel,
          position: "absolute",
          borderTopLeftRadius: "80%",
          borderTopRightRadius: "80%",
          transition: "all 0.3s ease",
          cursor: isAudioLoaded ? "pointer" : "not-allowed",
          opacity: hoveredBubble === bubbleData.id ? 0.8 : 1,
        };

        return (
          <div
            key={bubbleData.id || index}
            style={divStyle}
            onMouseEnter={() => {
              setHoveredBubble(bubbleData.id);
              if (isAudioLoaded) {
                // Add hover effect
              }
            }}
            onMouseLeave={() => {
              setHoveredBubble(null);
            }}
            onClick={() => {
              if (isAudioLoaded && setSelectedBubble) {
                setSelectedBubble(bubbleData);
              }
            }}
          />
        );
      })}
    </div>
  );
};

export default BubbleRender;
