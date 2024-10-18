import { Duration } from "luxon";
/**
 * Example helper function
 * @param {number} timeInSeconds
 * @returns {number}
 */

export function formatTime(timeInSeconds){
    const duration = Duration.fromObject({ seconds: timeInSeconds });
    return duration.toFormat("mm:ss:SSS"); // Formats as mm:ss.SSS
};

/**
 * Another example helper function
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}