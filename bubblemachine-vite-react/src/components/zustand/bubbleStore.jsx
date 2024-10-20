import { create } from "zustand";

const useBubbleStore = create((set) => ({
  bubbles: [],
  addBubble: (bubble) =>
    set((state) => ({ bubbles: [...state.bubbles, bubble] })),
  updateBubble: (index, updatedBubble) =>
    set((state) => {
      const bubbles = [...state.bubbles];
      bubbles[index] = { ...bubbles[index], ...updatedBubble };
      //console.log('layer', state.bubbles.filter(bubble => bubble.layer === layer));
      console.log("bubbles", bubbles);
      return { bubbles };
    }),
  deleteBubble: (index) =>
    set((state) => {
      const bubbles = state.bubbles.filter((_, i) => i !== index);
      return { bubbles };
    }),
  getLayer: (layer) => set((state) => {   
    const bubbles = [state.bubbles.filter(bubble => bubble.layer === layer)];
    return { bubbles };
    }),
  getBubblesByLayer: (layer) => {
    const state = useBubbleStore.getState();
    console.log('state', state);
    console.log('layer', state.bubbles.filter(bubble => bubble.layer === layer));
    return state.bubbles.filter(bubble => bubble.layer === layer);
  }
}));

export default useBubbleStore;
