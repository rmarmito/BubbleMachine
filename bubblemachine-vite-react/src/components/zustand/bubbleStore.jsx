import { create } from "zustand";

const useBubbleStore = create((set) => ({
  bubbles: [],
  addBubble: (bubble) =>
    set((state) => ({ bubbles: [...state.bubbles, bubble] })),
  updateBubble: (id, updatedBubble) =>
    set((state) => {
      const bubbles = [...state.bubbles];
      const index = bubbles.findIndex((bubble) => bubble.id === id);
      bubbles[index] = { ...bubbles[index], ...updatedBubble };
      console.log("bubbles", bubbles);
      return { bubbles };
    }),
  deleteBubble: (index) =>
    set((state) => {
      const bubbles = state.bubbles.filter((_, i) => i !== index);
      return { bubbles };
    }),
}));

export default useBubbleStore;
