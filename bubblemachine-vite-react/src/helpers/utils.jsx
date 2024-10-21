import { Duration } from "luxon";
/** 
 * @param {number} timeInSeconds
 * @returns {number}
 */

export function formatTime(timeInSeconds){
    const duration = Duration.fromObject({ seconds: timeInSeconds });
    return duration.toFormat("mm:ss:SSS"); // Formats as mm:ss.SSS
}

/**
 * @param {string} time
 * @returns {number}
 */
export function convertToMilliseconds(time){
    if (!time) return 0; // Return 0 if time is undefined or null
    const [minutes, seconds, milliseconds] = time.split(':').map(Number);
    return Math.floor((minutes * 60 * 1000) + (seconds * 1000) + milliseconds);
}

export function convertToSeconds(time){
    if (!time) return 0; // Return 0 if time is undefined or null
    const [minutes, seconds, milliseconds] = time.split(':').map(Number);
    return Math.floor((minutes * 60) + seconds + (milliseconds / 1000));
}

/**
 * @param {}
 * @returns {string}
 */
export function createID(){
    return (Math.random() + 1).toString(36).substring(7);
}

/**
 * @param {string} color
 * @returns {hexcode}
 */
export const colorToHex = (color) => {
    const colors = {
        Red: '#EF4444',
        Green: '#10B981',
        Blue: '#08B2E3',
        Yellow: '#FACC15',
        Gray: '#514C48',
        White: '#FFFFFF',
        Purple: '#8B5CF6',
        Orange: '#FF9E4E',
        Pink: '#FF88C5',
        Brown: '#723400',
    };

    return colors[color] || color; // Return the hex code if found, otherwise return the original color
};

export const hexToRGB = (color) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    const rgb = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
};

export function colorToRGB(color){
    const colors = {
        Red: 'rgba(239, 68, 68, 0.2)',
        Green: 'rgba(16, 185, 129, 0.2)',
        Blue: 'rgba(8, 178, 227, 0.2)',
        Yellow: 'rgba(250, 204, 21, 0.2)',
        Gray: 'rgba(81, 76, 72, 0.2)',
        White: 'rgba(255, 255, 255, 0.2)',
        Purple: 'rgba(139, 92, 246, 0.2)',
        Orange: 'rgba(255, 158, 78, 0.2)',
        Pink: 'rgba(255, 136, 197, 0.2)',
        Brown: 'rgba(114, 52, 0, 0.2)',
    };

    return colors[color] || color; // Return the hex code if found, otherwise return the original color
}
