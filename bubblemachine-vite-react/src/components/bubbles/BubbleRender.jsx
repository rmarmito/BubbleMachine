import React from 'react';
import useBubbleStore from '../zustand/bubbleStore';
import { convertToMilliseconds, colorToHex} from '../../helpers/utils';

//import './BubbleRender.css'; // Assuming you have a CSS file for additional styling
const BubbleRender = ({ audioDuration = 0, vizWidth = 800, visibleStartTime=0, visibleEndTime = audioDuration, setSelectedBubble}) => {
    const bubbleData = useBubbleStore((state) => state.bubbles);
    console.log('visibleStartTime', visibleStartTime);
    console.log('visibleEndTime', visibleEndTime);
    const visStartMs = convertToMilliseconds(visibleStartTime);
    const visStopMs = convertToMilliseconds(visibleEndTime);

    const handleClick = (bubble) => {
        console.log('Bubble clicked:', bubble);
        setSelectedBubble(bubble);
    };

    return (
        // original height: 300px
        <div style={{ position: 'relative', width: '100%', height: '200px' }}> 
            {console.log('bubbleData', bubbleData)}
            {bubbleData.map((bubbleData, index) => {
                console.log('startTime', bubbleData.startTime);
                console.log('stopTime', bubbleData.stopTime);
                const startTime = convertToMilliseconds(bubbleData.startTime);
                const stopTime = convertToMilliseconds(bubbleData.stopTime);
                const bubbleColor = colorToHex(bubbleData.color);
                
                
                if(visibleStartTime === 0 && visibleEndTime === 0) {

                    const audioLength = Math.floor(audioDuration * 1000);

                    // Compute the bubble's start position
                    const preStartPosition = Math.floor((startTime / audioLength * vizWidth)+20);
                    var startPosition = isNaN(preStartPosition) ? 0 : preStartPosition;

                    // Compute the bubble's width
                    const preBubbleWidth = Math.floor((stopTime - startTime) / audioLength * vizWidth);
                    const defaultBubbleWidth = 15;
                    var bubbleWidth = isNaN(preBubbleWidth) || preBubbleWidth === 0 ? defaultBubbleWidth : preBubbleWidth;
                } else {
                    if(startTime > visStopMs || stopTime < visStartMs) {
                        return null;
                    }
                    const visibleDuration = visStopMs - visStartMs;
                    var startPosition = Math.max(0, (startTime - visStartMs) / visibleDuration * vizWidth)+20;
                    var endPosition = Math.min(vizWidth, (stopTime - visStartMs) / visibleDuration * vizWidth)+20;
                    var bubbleWidth = endPosition - startPosition;
                }
                // Convert level to a pixel height
                const bubbleHeight = bubbleData.layer * 50;

                // Convert level to z-index
                const bubbleLevel = 6 - bubbleData.layer;
                
                // Inline styles for the bubble
                const divStyle = {
                    bottom: 0,
                    color: bubbleColor,
                    backgroundColor: bubbleColor,
                    left: `${startPosition}px`,
                    width: `${bubbleWidth}px`,
                    height: `${bubbleHeight}px`,
                    zIndex: bubbleLevel,
                    position: 'absolute',
                    borderTopLeftRadius: '80%',
                    borderTopRightRadius: '80%',
                    borderBottomLeftRadius: '0',
                    borderBottomRightRadius: '0',
                };
                console.log('divStyle', divStyle);
                return <div key={index} style={divStyle}onClick={() => handleClick(bubbleData)}></div>;
            })}
        </div>
    );
};

export default BubbleRender;
