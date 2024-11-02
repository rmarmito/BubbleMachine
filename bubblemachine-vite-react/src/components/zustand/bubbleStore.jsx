import { create } from "zustand";

const useBubbleStore = create((set) => ({
  bubbles: [],
  addBubble: (bubble) =>
    set((state) => ({ bubbles: [...state.bubbles, bubble] })),
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
