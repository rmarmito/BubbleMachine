import React from "react";
import PrimaryContainer from "../layout/PrimaryContainer";
import LayerTable from "./LayerTable.jsx";
import useBubbleStore from "../zustand/bubbleStore.jsx";

const PopUpLayer = ({ layer }) => {
  const bubbles = useBubbleStore((state) => state.bubbles);
  const layerBubbles = bubbles.filter((bubble) => bubble.layer === layer);

  // Only show container if there are bubbles in this layer
  if (layerBubbles.length === 0) {
    return null;
  }

  return (
    <PrimaryContainer
      title={`Layer ${layer}`}
      info={`Contains ${layerBubbles.length} bubble${
        layerBubbles.length !== 1 ? "s" : ""
      }`}
    >
      <LayerTable layer={layer} bubbles={layerBubbles} />
    </PrimaryContainer>
  );
};

export default PopUpLayer;
