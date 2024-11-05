import React from "react";
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
}) => {
  const bubbleData = useBubbleStore((state) => state.bubbles);
  const visStartMs = convertToMilliseconds(visibleStartTime);
  const visStopMs = convertToMilliseconds(visibleEndTime);
  const handleClick = (bubble) => setSelectedBubble(bubble);

  return (
    <div style={{ position: "relative", width: "100%", height: "200px" }}>
      {bubbleData.map((bubbleData, index) => {
        const startTime = convertToMilliseconds(bubbleData.startTime);
        const stopTime = convertToMilliseconds(bubbleData.stopTime);

        if (startTime > visStopMs || stopTime < visStartMs) return null;

        const visibleDuration = visStopMs - visStartMs;
        const startPosition =
          Math.max(0, ((startTime - visStartMs) / visibleDuration) * vizWidth) +
          20;
        const endPosition =
          Math.min(
            vizWidth,
            ((stopTime - visStartMs) / visibleDuration) * vizWidth
          ) + 20;
        const bubbleWidth = endPosition - startPosition;

        // Add transparency to the bubble color
        const bubbleColor = addTransparency(bubbleData.color, 0.6);
        const bubbleHeight = bubbleData.layer * 50;
        const bubbleLevel = 6 - bubbleData.layer;

        const divStyle = {
          bottom: 0,
          backgroundColor: bubbleColor,
          left: `${startPosition}px`,
          width: `${bubbleWidth}px`,
          height: `${bubbleHeight}px`,
          zIndex: bubbleLevel,
          position: "absolute",
          borderTopLeftRadius: "80%",
          borderTopRightRadius: "80%",
          transition: "all 0.3s ease",
          cursor: "pointer",
        };

        const hoverStyle = {
          ...divStyle,
          backgroundColor: addTransparency(bubbleData.color, 0.8),
          transform: "scale(1.02)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        };

        return (
          <div
            key={index}
            style={divStyle}
            onMouseEnter={(e) => {
              Object.assign(e.target.style, hoverStyle);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.target.style, divStyle);
            }}
            onClick={() => handleClick(bubbleData)}
          />
        );
      })}
    </div>
  );
};

export default BubbleRender;
