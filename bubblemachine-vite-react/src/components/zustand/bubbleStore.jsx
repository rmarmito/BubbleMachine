import { create } from "zustand";
import { generateRandomColor } from "../../helpers/utils";

const useBubbleStore = create((set, get) => ({
  bubbles: [],
  selectedBubble: null,
  clearBubbles: () =>
    set({
      bubbles: [],
      selectedBubble: null,
    }),

  addBubble: (bubble) =>
    set((state) => {
      const newBubble = {
        ...bubble,
        id: bubble.id,
        layer: String(bubble.layer || "1"),
        color: bubble.color || generateRandomColor(),
        startTime: bubble.startTime || "00:00:000",
        stopTime: bubble.stopTime || "00:00:000",
      };
      console.log("Adding bubble to store:", newBubble);
      return { bubbles: [...state.bubbles, newBubble] };
    }),

  updateBubble: (id, updatedBubble) =>
    set((state) => {
      console.log("Updating bubble in store:", id, updatedBubble);
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
      selectedBubble:
        state.selectedBubble?.id === id ? null : state.selectedBubble,
    })),

  setSelectedBubble: (bubble) => set({ selectedBubble: bubble }),

  clearSelection: () => set({ selectedBubble: null }),

  // Helper function to get bubbles by layer
  getBubblesByLayer: (layer) => {
    const state = get();
    return state.bubbles.filter((bubble) => bubble.layer === String(layer));
  },
}));

export default useBubbleStore;
