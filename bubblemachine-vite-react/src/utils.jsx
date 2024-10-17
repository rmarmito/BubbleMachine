import { Duration } from "luxon";
/** 
 * @param {number} timeInSeconds
 * @returns {number}
 */

export function formatTime(timeInSeconds){
    const duration = Duration.fromObject({ seconds: timeInSeconds });
    return duration.toFormat("mm:ss:SSS"); // Formats as mm:ss.SSS
};

/**
 * @param {mm:ss:fff} time
 * @returns {number}
 */
export function convertToMillisecond(time){
    if (!time) return 0; // Return 0 if time is undefined or null
    const [minutes, seconds, milliseconds] = time.split(':').map(Number);
    return Math.floor((minutes * 60 * 1000) + (seconds * 1000) + milliseconds);
};

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
};