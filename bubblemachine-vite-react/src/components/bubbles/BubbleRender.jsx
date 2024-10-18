import React from 'react';
import useBubbleStore from '../zustand/bubbleStore';
import { convertToMilliseconds, colorToHex} from '../../helpers/utils';

//import './BubbleRender.css'; // Assuming you have a CSS file for additional styling
const BubbleRender = ({ audioDuration = 0, vizWidth = 800}) => {
    const bubbleData = useBubbleStore((state) => state.bubbles);

    return (
        <div style={{ position: 'relative', width: '100%', height: '300px' }}>
            {console.log('bubbleData', bubbleData)}
            {bubbleData.map((bubbleData, index) => {
                const startTime = convertToMilliseconds(bubbleData.startTime);
                const stopTime = convertToMilliseconds(bubbleData.stopTime);
                const bubbleColor = colorToHex(bubbleData.color);
                const audioLength = Math.floor(audioDuration * 1000);

                // Compute the bubble's start position
                const startPosition = Math.floor((startTime / audioLength * vizWidth)+20);
                const startPositionChecked = isNaN(startPosition) ? 0 : startPosition;

                // Compute the bubble's width
                const bubbleWidth = Math.floor((stopTime - startTime) / audioLength * vizWidth);
                console.log('bubbleWidth', bubbleWidth, 'start', startTime, 'stop', stopTime, 'audio', audioLength, 'viz', vizWidth);
                const defaultBubbleWidth = 15;
                const bubbleWidthChecked = isNaN(bubbleWidth) || bubbleWidth === 0 ? defaultBubbleWidth : bubbleWidth;

                // Convert level to a pixel height
                const bubbleHeight = bubbleData.layer * 50;

                // Convert level to z-index
                const bubbleLevel = 6 - bubbleData.layer;
                
                // Inline styles for the bubble
                const divStyle = {
                    bottom: 0,
                    color: bubbleColor,
                    backgroundColor: bubbleColor,
                    left: `${startPositionChecked}px`,
                    width: `${bubbleWidthChecked}px`,
                    height: `${bubbleHeight}px`,
                    zIndex: bubbleLevel,
                    position: 'absolute',
                    borderTopLeftRadius: '80%',
                    borderTopRightRadius: '80%',
                    borderBottomLeftRadius: '0',
                    borderBottomRightRadius: '0',
                };
                console.log('divStyle', divStyle);
                return <div key={index} style={divStyle}></div>;
            })}
        </div>
    );
};

export default BubbleRender;
