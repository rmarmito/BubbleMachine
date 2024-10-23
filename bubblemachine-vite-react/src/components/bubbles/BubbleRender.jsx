import useBubbleStore from "../zustand/bubbleStore.jsx";
import { convertToMilliseconds, colorToHex } from "../../helpers/utils.jsx";
import { useCallback } from "react";
const BubbleRender = ({
  audioDuration = 0,
  vizWidth = 800,
  visibleStartTime = 0,
  visibleEndTime = audioDuration,
  setSelectedBubble,
  selectedBubble,
}) => {
  const bubbleData = useBubbleStore((state) => state.bubbles);
  console.log("visibleStartTime", visibleStartTime);
  console.log("visibleEndTime", visibleEndTime);
  const visStartMs = convertToMilliseconds(visibleStartTime);
  const visStopMs = convertToMilliseconds(visibleEndTime);
  console.log("visStartMs", visStartMs);
  console.log("visStopMs", visStopMs);

  const handleClick = useCallback(
    (bubble) => {
      if (bubble === selectedBubble) {
        setSelectedBubble(null);
      } else
      setSelectedBubble(bubble);
    },
    [selectedBubble, setSelectedBubble]
  );

  const handleBlur = useCallback(() => {
    setSelectedBubble(null);
  },[setSelectedBubble]);
  
  return (
    // original height: 300px
    <div style={{ position: "relative", width: "100%", height: "200px" }}>
      {bubbleData.map((bubbleData, index) => {
        const startTime = convertToMilliseconds(bubbleData.startTime);
        const stopTime = convertToMilliseconds(bubbleData.stopTime);
        const bubbleColor = colorToHex(bubbleData.color);

        if (visibleStartTime === 0 && visibleEndTime === 0) {
          const audioLength = Math.floor(audioDuration * 1000);

          // Compute the bubble's start position
          const preStartPosition = Math.floor(
            (startTime / audioLength) * vizWidth + 20
          );
          var startPosition = isNaN(preStartPosition) ? 0 : preStartPosition;

          // Compute the bubble's width
          const preBubbleWidth = Math.floor(
            ((stopTime - startTime) / audioLength) * vizWidth
          );
          const defaultBubbleWidth = 15;
          var bubbleWidth =
            isNaN(preBubbleWidth) || preBubbleWidth === 0
              ? defaultBubbleWidth
              : preBubbleWidth;
        } else {
          if (startTime > visStopMs || stopTime < visStartMs) {
            console.log("Bubble not in view");
            console.log("Start Time", startTime);
            console.log("Stop Time", stopTime);
            console.log("Visible Start Time", visStartMs);
            console.log("Visible Stop Time", visStopMs);
            return null;
          }
          const visibleDuration = visStopMs - visStartMs;
          var startPosition =
            Math.max(
              0,
              ((startTime - visStartMs) / visibleDuration) * vizWidth
            ) + 20;
          var endPosition =
            Math.min(
              vizWidth,
              ((stopTime - visStartMs) / visibleDuration) * vizWidth
            ) + 20;
          var bubbleWidth = endPosition - startPosition;
        }
        // Convert level to a pixel height
        const bubbleHeight = bubbleData.layer * 50;

        // Convert level to z-index
        const bubbleLevel = (3 - bubbleData.layer) * 2;

        // Inline styles for the bubble
        const divStyle = {
          bottom: 0,
          color: bubbleColor,
          backgroundColor: bubbleColor,
          left: `${startPosition}px`,
          width: `${bubbleWidth}px`,
          height: `${bubbleHeight}px`,
          zIndex: bubbleLevel,
          position: "absolute",
          borderTopLeftRadius: "80%",
          borderTopRightRadius: "80%",
          borderBottomLeftRadius: "0",
          borderBottomRightRadius: "0",
        };
        
        console.log("Bubble style 1:", divStyle);
        console.log("Bubble Data", bubbleData);
        return (
          <div
            key={index}
            style={divStyle}
            tabIndex={0}
            onClick={() => handleClick(bubbleData)}
            onBlur={() => handleBlur()}
          ></div>
        );
      })}
    </div>
  );
};

export default BubbleRender;
