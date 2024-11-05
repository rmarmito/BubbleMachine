import { Duration } from "luxon";

export const convertToMilliseconds = (timeString) => {
  if (!timeString) return 0;

  try {
    const parts = timeString.split(":");
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;

    if (parts.length === 3) {
      // Format: MM:SS:mmm
      minutes = parseInt(parts[0]) || 0;
      seconds = parseInt(parts[1]) || 0;
      milliseconds = parseInt(parts[2]) || 0;
    } else if (parts.length === 2) {
      // Format: SS:mmm
      seconds = parseInt(parts[0]) || 0;
      milliseconds = parseInt(parts[1]) || 0;
    } else {
      return 0;
    }

    return minutes * 60 * 1000 + seconds * 1000 + milliseconds;
  } catch (error) {
    console.warn("Error converting time:", error);
    return 0;
  }
};

export const formatTime = (seconds) => {
  if (typeof seconds !== "number" || isNaN(seconds)) return "00:000";

  try {
    const wholeSeconds = Math.floor(seconds);
    const milliseconds = Math.floor((seconds - wholeSeconds) * 1000);
    const minutes = Math.floor(wholeSeconds / 60);
    const remainingSeconds = wholeSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}:${milliseconds.toString().padStart(3, "0")}`;
  } catch (error) {
    console.warn("Error formatting time:", error);
    return "00:000";
  }
};
export function convertToSeconds(time) {
  if (!time) return 0; // Return 0 if time is undefined or null
  const [minutes, seconds, milliseconds] = time.split(":").map(Number);
  return Math.floor(minutes * 60 + seconds + milliseconds / 1000);
}

export function createID() {
  return (Math.random() + 1).toString(36).substring(7);
}

export const colorToHex = (color) => {
  const colors = {
    Red: "#EF4444",
    Green: "#10B981",
    Blue: "#08B2E3",
    Yellow: "#FACC15",
    Gray: "#514C48",
    White: "#FFFFFF",
    Purple: "#8B5CF6",
    Orange: "#FF9E4E",
    Pink: "#FF88C5",
    Brown: "#723400",
  };

  return colors[color] || color; // Return the hex code if found, otherwise return the original color
};

export const hexToRGB = (color) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  const rgb = {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
};

export const colorToRGB = (color, alpha = 0.3) => {
  // Function to lighten a color
  const lightenColor = (r, g, b, factor = 0.2) => {
    // Lighten the color by mixing with white
    r = Math.round(r + (255 - r) * factor);
    g = Math.round(g + (255 - g) * factor);
    b = Math.round(b + (255 - b) * factor);
    return [r, g, b];
  };

  // Handle hex colors
  if (color.startsWith("#")) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      // Use lighten function for hover state
      const [lr, lg, lb] = lightenColor(r, g, b);
      return `rgba(${lr}, ${lg}, ${lb}, ${alpha})`;
    }
  }

  // Handle named colors (if you still want to support them)
  const namedColors = {
    Red: "#FF0000",
    Blue: "#0000FF",
    Green: "#00FF00",
    Yellow: "#FFFF00",
    Purple: "#800080",
    Orange: "#FFA500",
    Pink: "#FFC0CB",
    Brown: "#A52A2A",
    Gray: "#808080",
  };

  if (namedColors[color]) {
    return colorToRGB(namedColors[color], alpha);
  }

  // Handle rgba colors
  if (color.startsWith("rgba")) {
    const parts = color.match(/[\d.]+/g);
    if (parts && parts.length >= 3) {
      const [r, g, b] = lightenColor(parts[0], parts[1], parts[2]);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }

  // Default fallback
  return `rgba(78, 158, 231, ${alpha})`; // Your brand blue as fallback
};

export const generateRandomColor = () => {
  const colors = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Light Blue
    "#96CEB4", // Sage Green
    "#D4A5A5", // Dusty Rose
    "#9B89B3", // Purple
    "#FFD93D", // Yellow
    "#FF8C42", // Orange
    "#98DDCA", // Mint
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

// Add alpha channel to color
export const addTransparency = (color, alpha) => {
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
};
