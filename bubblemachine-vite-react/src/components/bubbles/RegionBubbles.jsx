import { useState, useEffect, useRef } from "react";

const RegionBubbles = ({
  wavesurfer,
  regions,
  selectedBubble,
  onBubbleSelect,
  containerWidth,
  scrollLeftOffset = 0,
}) => {
  const [bubblePositions, setBubblePositions] = useState([]);
  const containerRef = useRef(null);

  // Calculate bubble positions based on wavesurfer state
  useEffect(() => {
    if (!wavesurfer || !regions.length) return;

    const duration = wavesurfer.getDuration();
    const pixelsPerSecond = containerWidth / duration;

    const positions = regions.map((region) => {
      const startX = region.start * pixelsPerSecond - scrollLeftOffset;
      const endX = region.end * pixelsPerSecond - scrollLeftOffset;
      const width = endX - startX;

      return {
        id: region.id,
        startX,
        width,
        color: region.color || "#4E9EE7",
      };
    });

    setBubblePositions(positions);
  }, [wavesurfer, regions, containerWidth, scrollLeftOffset]);

  // Update positions on zoom or scroll
  useEffect(() => {
    if (!wavesurfer) return;

    const handleScroll = () => {
      const scroll = wavesurfer.getScroll();
      // Recalculate positions with new scroll offset
      const duration = wavesurfer.getDuration();
      const pixelsPerSecond = containerWidth / duration;

      setBubblePositions((prev) =>
        prev.map((bubble) => ({
          ...bubble,
          startX:
            regions.find((r) => r.id === bubble.id).start * pixelsPerSecond -
            scroll,
        }))
      );
    };

    const handleZoom = () => {
      // Recalculate positions with new zoom level
      const duration = wavesurfer.getDuration();
      const pixelsPerSecond = containerWidth / duration;

      setBubblePositions((prev) =>
        prev.map((bubble) => {
          const region = regions.find((r) => r.id === bubble.id);
          const startX = region.start * pixelsPerSecond - scrollLeftOffset;
          const endX = region.end * pixelsPerSecond - scrollLeftOffset;
          return {
            ...bubble,
            startX,
            width: endX - startX,
          };
        })
      );
    };

    wavesurfer.on("scroll", handleScroll);
    wavesurfer.on("zoom", handleZoom);

    return () => {
      wavesurfer.un("scroll", handleScroll);
      wavesurfer.un("zoom", handleZoom);
    };
  }, [wavesurfer, regions, containerWidth]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-16 bg-gray-100"
      style={{ marginBottom: "8px" }}
    >
      {bubblePositions.map((bubble) => (
        <div
          key={bubble.id}
          className={`absolute h-12 rounded-lg cursor-pointer transition-all duration-200 ${
            selectedBubble?.id === bubble.id ? "ring-2 ring-blue-500" : ""
          }`}
          style={{
            left: `${Math.max(0, bubble.startX)}px`,
            width: `${bubble.width}px`,
            backgroundColor: bubble.color,
            opacity: 0.8,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onBubbleSelect(regions.find((r) => r.id === bubble.id));
          }}
        >
          <div className="p-2 text-sm text-white truncate">
            {regions.find((r) => r.id === bubble.id)?.attributes?.label ||
              "Region"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RegionBubbles;
