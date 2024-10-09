import React from 'react';
import PropTypes from 'prop-types';
//import './BubbleRender.css'; // Assuming you have a CSS file for additional styling
const BubbleRender = ({ bubblesData, audioDuration}) => {
    return (
        <div className="bubbles-container">
            {bubblesData.map((bubbleData, index) => {
                // Compute the bubble's start position
                const startPosition = Math.floor(bubbleData.start_time / audioDuration * vizWidth);
                const startPositionChecked = isNaN(startPosition) ? 0 : startPosition;

                // Compute the bubble's width
                const bubbleWidth = Math.floor((bubbleData.stop_time - bubbleData.start_time) / audioDuration * vizWidth);
                const defaultBubbleWidth = 15;
                const bubbleWidthChecked = isNaN(bubbleWidth) || bubbleWidth === 0 ? defaultBubbleWidth : bubbleWidth;

                // Convert level to a pixel height
                const bubbleHeight = bubbleData.level * 50;

                // Convert level to z-index
                const bubbleLevel = 6 - bubbleData.level;

                const bubbleColor = bubbleData.color;

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
                    borderRadius: 50/100,
                };

                return <div key={index} className="bubble" style={divStyle}></div>;
            })}
        </div>
    );
};

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