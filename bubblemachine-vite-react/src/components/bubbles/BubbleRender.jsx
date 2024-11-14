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

    const visStartMs = convertToMilliseconds(visibleStartTime) || 0;
    const visStopMs =
      convertToMilliseconds(visibleEndTime) ||
      convertToMilliseconds(audioDuration);

    // Custom cursor style based on audio loaded state
    const cursorStyle = isAudioLoaded ? "pointer" : "not-allowed";

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
      return bubbleData.map((bubble, index) => {
        if (!bubble?.startTime || !bubble?.stopTime) return null;

        const startTime = convertToMilliseconds(bubble.startTime) || 0;
        const stopTime = convertToMilliseconds(bubble.stopTime) || 0;

        if (startTime >= stopTime) return null; // Invalid time range

        if (startTime > visStopMs || stopTime < visStartMs) return null; // Bubble not in visible range

        const visibleDuration = Math.max(1, visStopMs - visStartMs);
        const startPosition = Math.max(
          0,
          ((startTime - visStartMs) / visibleDuration) * vizWidth
        );
        const endPosition = Math.min(
          vizWidth,
          ((stopTime - visStartMs) / visibleDuration) * vizWidth
        );
        const bubbleWidth = Math.max(0, endPosition - startPosition);

        // Use the actual layer value from the bubble data
        const layer = parseInt(bubble.layer, 10) || 1;
        const bubbleHeight = layer * 50;
        const bubbleLevel = 6 - layer;

        const divStyle = {
          bottom: 0,
          backgroundColor: addTransparency(bubble.color || "#4E9EE7", 0.6),
          left: `${startPosition}px`,
          width: `${bubbleWidth}px`,
          height: `${bubbleHeight}px`,
          zIndex: bubbleLevel,
          position: "absolute",
          borderTopLeftRadius: "80%",
          borderTopRightRadius: "80%",
          transition: "opacity 0.3s ease",
          cursor: cursorStyle,
          opacity: hoveredBubble === bubble.id ? 0.8 : 1,
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
      });
    }, [
      bubbleData,
      hoveredBubble,
      isAudioLoaded,
      handleMouseEnter,
      handleMouseLeave,
      handleClick,
      visStartMs,
      visStopMs,
      vizWidth,
      cursorStyle,
    ]);

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
        {renderedBubbles}
      </div>
    );
  }
);

export default BubbleRender;
