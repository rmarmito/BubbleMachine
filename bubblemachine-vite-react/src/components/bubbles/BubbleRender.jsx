import React, { useMemo, useCallback, useState, useRef } from "react";
import useBubbleStore from "../zustand/bubbleStore.jsx";
import {
  convertToMilliseconds,
  addTransparency,
  formatTime,
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
    const [hoverInfo, setHoverInfo] = useState({
      show: false,
      text: "",
      x: 0,
      y: 0,
    });

    const visStartMs = convertToMilliseconds(visibleStartTime);
    const visStopMs =
      convertToMilliseconds(visibleEndTime) ||
      convertToMilliseconds(audioDuration);

    const handleMouseEnter = useCallback((bubble) => {
      setHoveredBubble(bubble.id);
      const hoverText = `${bubble.bubbleName || ""} `;
      setHoverInfo({
        show: true,
        text: hoverText,
        bubbleId: bubble.id,
      });
    }, []);

    const handleMouseMove = useCallback(
      (e, bubble) => {
        if (hoveredBubble === bubble.id) {
          setHoverInfo((prev) => ({
            ...prev,
            x: e.clientX,
            y: e.clientY - 30, // Position above cursor
          }));
        }
      },
      [hoveredBubble]
    );

    const handleMouseLeave = useCallback(() => {
      setHoveredBubble(null);
      setHoverInfo({ show: false, text: "", x: 0, y: 0 });
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

          const startPosition = (startTime - visStartMs) * scale;
          const endPosition = (stopTime - visStartMs) * scale;

          if (endPosition < 0 || startPosition > vizWidth) return null;

          const adjustedStart = Math.max(0, startPosition);
          const adjustedEnd = Math.min(vizWidth, endPosition);
          const bubbleWidth = Math.max(2, adjustedEnd - adjustedStart);

          const layer = parseInt(bubble.layer, 10) || 1;
          const bubbleHeight = layer * 40;
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
            transition: "all 0.2s ease-out",
            cursor: isAudioLoaded ? "pointer" : "not-allowed",
            opacity: hoveredBubble === bubble.id ? 0.8 : 1,
            zIndex: bubbleLevel,
            boxShadow:
              hoveredBubble === bubble.id
                ? "0 0 8px rgba(255,0,0,0.5)"
                : "none",
          };

          return (
            <div
              key={bubble.id || index}
              style={divStyle}
              onMouseEnter={() => handleMouseEnter(bubble)}
              onMouseMove={(e) => handleMouseMove(e, bubble)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => {
                e.stopPropagation(); // Prevent the event from bubbling up
                handleClick(bubble);
              }}
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
      handleMouseMove,
      handleMouseLeave,
      handleClick,
    ]);

    return (
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
        }}
        onClick={() => {
          // Deselect the bubble when clicking outside of any bubble
          if (isAudioLoaded && setSelectedBubble) {
            setSelectedBubble(null);
          }
        }}
      >
        {renderedBubbles}
        {hoverInfo.show && (
          <div
            style={{
              position: "fixed",
              left: hoverInfo.x,
              top: hoverInfo.y,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "28px",
              pointerEvents: "none",
              zIndex: 1000,
              transform: "translate(-50%, -100%)",
              whiteSpace: "pre-line",
              textAlign: "center",
            }}
          >
            {hoverInfo.text}
          </div>
        )}
      </div>
    );
  }
);

BubbleRender.displayName = "BubbleRender";

export default BubbleRender;
