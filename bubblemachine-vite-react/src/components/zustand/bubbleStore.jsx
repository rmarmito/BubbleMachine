import { create } from "zustand";

const useBubbleStore = create((set) => ({
  bubbles: [],
  addBubble: (bubble) =>
    set((state) => ({ bubbles: [...state.bubbles, bubble] })),
  updateBubble: (index, updatedBubble) =>
    set((state) => {
      const bubbles = [...state.bubbles];
      bubbles[index] = { ...bubbles[index], ...updatedBubble };
      console.log("bubbles", bubbles);
      return { bubbles };
    }),
  deleteBubble: (index) =>
    set((state) => {
      const bubbles = state.bubbles.filter((_, i) => i !== index);
      return { bubbles };
    }),
  getBubble: (index) => (state) => state.bubbles[index],
}));

export default useBubbleStore;
