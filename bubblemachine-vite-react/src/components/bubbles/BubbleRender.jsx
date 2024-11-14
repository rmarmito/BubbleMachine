import React, { useMemo, useCallback, useState, useRef } from "react";
import useBubbleStore from "../zustand/bubbleStore.jsx";
import {
  convertToMilliseconds,
  addTransparency,
} from "../../helpers/utils.jsx";

const BubbleRender = React.memo(
  ({
    audioDuration = 0,
    vizWidth = 800,
    visibleStartTime = 0,
    visibleEndTime = audioDuration,
    setSelectedBubble,
    isAudioLoaded = false,
  }) => {
    const bubbleData = useBubbleStore((state) => state.bubbles);
    const containerRef = useRef(null);
    const [hoveredBubble, setHoveredBubble] = useState(null);

    const visStartMs = convertToMilliseconds(visibleStartTime);
    const visStopMs =
      convertToMilliseconds(visibleEndTime) ||
      convertToMilliseconds(audioDuration);

    const handleMouseEnter = useCallback((id) => {
      setHoveredBubble(id);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setHoveredBubble(null);
    }, []);

    const handleClick = useCallback(
      (bubble) => {
        if (isAudioLoaded && setSelectedBubble) {
          setSelectedBubble(bubble);
        }
      },
      [isAudioLoaded, setSelectedBubble]
    );

    const renderedBubbles = useMemo(() => {
      if (!audioDuration || !vizWidth) return [];

      const visibleDuration = visStopMs - visStartMs;
      const scale = vizWidth / visibleDuration;

      return bubbleData
        .map((bubble, index) => {
          if (!bubble?.startTime || !bubble?.stopTime) return null;

          const startTime = convertToMilliseconds(bubble.startTime);
          const stopTime = convertToMilliseconds(bubble.stopTime);

          if (startTime >= stopTime) return null;

          // Calculate position relative to visible window
          const startPosition = (startTime - visStartMs) * scale;
          const endPosition = (stopTime - visStartMs) * scale;

          // Skip if completely outside visible range
          if (endPosition < 0 || startPosition > vizWidth) return null;

          // Adjust position and width for partially visible bubbles
          const adjustedStart = Math.max(0, startPosition);
          const adjustedEnd = Math.min(vizWidth, endPosition);
          const bubbleWidth = Math.max(2, adjustedEnd - adjustedStart);

          const layer = parseInt(bubble.layer, 10) || 1;
          const bubbleHeight = layer * 40; // Reduced height for better visualization
          const bubbleLevel = 6 - layer;

          const divStyle = {
            position: "absolute",
            bottom: 0,
            left: `${adjustedStart}px`,
            width: `${bubbleWidth}px`,
            height: `${bubbleHeight}px`,
            backgroundColor: addTransparency(bubble.color || "#4E9EE7", 0.6),
            borderTopLeftRadius: "80%",
            borderTopRightRadius: "80%",
            transition: "all 0.1s ease-out",
            cursor: isAudioLoaded ? "pointer" : "not-allowed",
            opacity: hoveredBubble === bubble.id ? 0.8 : 1,
            zIndex: bubbleLevel,
          };

          return (
            <div
              key={bubble.id || index}
              style={divStyle}
              onMouseEnter={() => handleMouseEnter(bubble.id)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(bubble)}
            />
          );
        })
        .filter(Boolean);
    }, [
      bubbleData,
      hoveredBubble,
      visStartMs,
      visStopMs,
      vizWidth,
      audioDuration,
      isAudioLoaded,
      handleMouseEnter,
      handleMouseLeave,
      handleClick,
    ]);

    // Add some console logging to debug
    console.log("Bubble Data:", {
      bubbleCount: bubbleData.length,
      renderedCount: renderedBubbles.length,
      vizWidth,
      visibleStartTime,
      visibleEndTime,
      audioDuration,
    });

    return (
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
        }}
      >
        {renderedBubbles}
      </div>
    );
  }
);

BubbleRender.displayName = "BubbleRender";

export default BubbleRender;
