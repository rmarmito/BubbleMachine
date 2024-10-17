import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useBubbleStore from '../state';
import { convertToMilliseconds, colorToHex} from '../utils';

//import './BubbleRender.css'; // Assuming you have a CSS file for additional styling
const BubbleRender = ({ audioDuration, vizWidth}) => {
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
                const startPosition = Math.floor((startTime / audioLength * vizWidth)+19);
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

/*
const colorToHex = (color) => {
    const colors = {
        Red: '#FF0000',
        Green: '#00FF00',
        Blue: '#0000FF',
        Yellow: '#FFFF00',
        Black: '#000000',
        White: '#FFFFFF',
        Purple: '#800080',
        Orange: '#FFA500',
        Pink: '#FFC0CB',
        Brown: '#A52A2A',
    };

    return colors[color] || color; // Return the hex code if found, otherwise return the original color
};*/

BubbleRender.propTypes = {
    bubblesData: PropTypes.arrayOf(
        PropTypes.shape({
            start_time: PropTypes.number.isRequired,
            stop_time: PropTypes.number.isRequired,
            level: PropTypes.number.isRequired,
            color: PropTypes.string.isRequired
        })
    ).isRequired,
    audioDuration: PropTypes.number.isRequired,
    vizWidth: PropTypes.number.isRequired
};

BubbleRender.defaultProps = {
    bubblesData: [],
    audioDuration: 0,
    vizWidth: 800
};
export default BubbleRender;
