import { create } from "zustand";
import { generateRandomColor } from "../../helpers/utils.jsx";

const useBubbleStore = create((set) => ({
  bubbles: [],
  addBubble: (bubble) =>
    set((state) => ({
      bubbles: [
        ...state.bubbles,
        {
          ...bubble,
          color: bubble.color || generateRandomColor(),
        },
      ],
    })),
  updateBubble: (id, updatedBubble) =>
    set((state) => ({
      bubbles: state.bubbles.map((bubble) =>
        bubble.id === id ? { ...bubble, ...updatedBubble } : bubble
      ),
    })),
  deleteBubble: (id) =>
    set((state) => ({
      bubbles: state.bubbles.filter((bubble) => bubble.id !== id),
    })),
}));

export default useBubbleStore;
