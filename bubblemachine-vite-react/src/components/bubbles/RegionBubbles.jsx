import { useState, useEffect, useRef, useCallback } from "react";

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
  const regionsRef = useRef(regions);

  // Update regions ref when regions prop changes
  useEffect(() => {
    regionsRef.current = regions;
  }, [regions]);

  // Calculate positions with memoized function
  const calculatePositions = useCallback(() => {
    if (!wavesurfer || !regionsRef.current.length) return [];

    const duration = wavesurfer.getDuration();
    const zoom = wavesurfer.getZoom();
    const pixelsPerSecond = (containerWidth * zoom) / duration;

    return regionsRef.current.map((region) => {
      const startX = region.start * pixelsPerSecond - scrollLeftOffset;
      const endX = region.end * pixelsPerSecond - scrollLeftOffset;
      const width = Math.max(1, endX - startX); // Ensure minimum width

      return {
        id: region.id,
        startX: Math.max(0, startX), // Prevent negative positions
        width: Math.min(width, containerWidth - startX), // Prevent overflow
        color: region.color || "#4E9EE7",
      };
    });
  }, [wavesurfer, containerWidth, scrollLeftOffset]);

  // Update positions when regions are modified
  useEffect(() => {
    if (!wavesurfer) return;

    const handleRegionUpdated = (region) => {
      // Immediately update positions to reflect changes
      setBubblePositions(calculatePositions());
    };

    const handleRegionUpdateEnd = (region) => {
      // Ensure final position is accurate
      setBubblePositions(calculatePositions());
    };

    // Listen for both update events
    wavesurfer.on("region-updated", handleRegionUpdated);
    wavesurfer.on("region-update-end", handleRegionUpdateEnd);

    return () => {
      wavesurfer.un("region-updated", handleRegionUpdated);
      wavesurfer.un("region-update-end", handleRegionUpdateEnd);
    };
  }, [wavesurfer, calculatePositions]);

  // Handle scroll and zoom
  useEffect(() => {
    if (!wavesurfer) return;

    const handleViewportChange = () => {
      setBubblePositions(calculatePositions());
    };

    // Debounced viewport update
    let timeoutId;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleViewportChange, 16); // ~60fps
    };

    wavesurfer.on("scroll", debouncedUpdate);
    wavesurfer.on("zoom", debouncedUpdate);

    return () => {
      wavesurfer.un("scroll", debouncedUpdate);
      wavesurfer.un("zoom", debouncedUpdate);
      clearTimeout(timeoutId);
    };
  }, [wavesurfer, calculatePositions]);

  // Initial position calculation
  useEffect(() => {
    setBubblePositions(calculatePositions());
  }, [calculatePositions, regions]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-16 bg-gray-100"
      style={{
        marginBottom: "8px",
        width: containerWidth,
        overflow: "hidden",
      }}
    >
      {bubblePositions.map((bubble) => {
        const region = regions.find((r) => r.id === bubble.id);
        if (!region) return null;

        return (
          <div
            key={bubble.id}
            className={`absolute h-12 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedBubble?.id === bubble.id ? "ring-2 ring-blue-500" : ""
            }`}
            style={{
              left: `${bubble.startX}px`,
              width: `${bubble.width}px`,
              backgroundColor: bubble.color,
              opacity: 0.8,
              transform: `translateZ(0)`, // Force GPU acceleration
            }}
            onClick={(e) => {
              e.stopPropagation();
              onBubbleSelect(region);
            }}
          >
            <div className="p-2 text-sm text-white truncate">
              {region.attributes?.label || "Region"}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RegionBubbles;
