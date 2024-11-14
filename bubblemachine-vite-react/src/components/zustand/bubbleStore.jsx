import { create } from "zustand";
import { generateRandomColor } from "../../helpers/utils";

const useBubbleStore = create((set) => ({
  bubbles: [],
  selectedBubble: null,

  addBubble: (bubble) =>
    set((state) => {
      const newBubble = {
        ...bubble,
        layer: String(bubble.layer || "1"), // Ensure layer is stored as string
        color: bubble.color || generateRandomColor(),
      };
      return { bubbles: [...state.bubbles, newBubble] };
    }),

  updateBubble: (id, updatedBubble) =>
    set((state) => {
      const updatedBubbles = state.bubbles.map((bubble) =>
        bubble.id === id
          ? {
              ...bubble,
              ...updatedBubble,
              layer: String(updatedBubble.layer || bubble.layer),
            }
          : bubble
      );
      return { bubbles: updatedBubbles };
    }),

  deleteBubble: (id) =>
    set((state) => ({
      bubbles: state.bubbles.filter((bubble) => bubble.id !== id),
    })),

  setSelectedBubble: (bubble) => set({ selectedBubble: bubble }),

  clearSelection: () => set({ selectedBubble: null }),
}));

export default useBubbleStore;
