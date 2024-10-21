import React from 'react';
import PrimaryContainer from '../layout/PrimaryContainer';
import LayerTable from './LayerTable';
import useBubbleStore from '../zustand/bubbleStore';

const PopUpLayer = ({ layer }) => {
    const bubbles = useBubbleStore((state) => state.bubbles);
    const hasLayer = bubbles.some(bubble => bubble.layer === layer);

    if (!hasLayer) {
        return null;
    }

    return (
        <PrimaryContainer
        label="New Bubble"
        labelColor="white"
        title={`Layer ${layer}`}
        titleColor="#FF0000" // Use a valid color
      > 
        <LayerTable layer={layer} />
      </PrimaryContainer>
    );
};

export default PopUpLayer;