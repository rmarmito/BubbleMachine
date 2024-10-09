import { create } from 'zustand';

const useBubbleStore = create((set) => ({
    bubbles: [],
    addBubble: (bubble) => set((state) => ({ bubbles: [...state.bubbles, bubble] })),
    updateBubble: (index, updatedBubble) => set((state) => {
        const bubbles = [...state.bubbles];
        bubbles[index] = { ...bubbles[index], ...updatedBubble };
        console.log('bubbles', bubbles);
        return { bubbles };
    }),
    deleteBubble: (index) => set((state) => {
        const bubbles = state.bubbles.filter((_, i) => i !== index);
        return { bubbles };
    }),
    getBubble: (index) => (state) => state.bubbles[index]
}));

export default useBubbleStore;
/*
// Example usage functions

// Function to add a new bubble
const addNewBubble = (bubble) => {
    const useBubbleStore = require('./state').default;
    const addBubble = useBubbleStore.getState().addBubble;
    addBubble(bubble);
};

// Function to update an existing bubble
const updateExistingBubble = (index, updatedBubble) => {
    const useBubbleStore = require('./state').default;
    const updateBubble = useBubbleStore.getState().updateBubble;
    updateBubble(index, updatedBubble);
};

// Function to delete a bubble
const deleteExistingBubble = (index) => {
    const useBubbleStore = require('./state').default;
    const deleteBubble = useBubbleStore.getState().deleteBubble;
    deleteBubble(index);
};

// Function to get a bubble by index
const getBubbleByIndex = (index) => {
    const useBubbleStore = require('./state').default;
    const getBubble = useBubbleStore.getState().getBubble;
    return getBubble(index);
};

// Function to edit specific values of a bubble
const editBubbleValues = (index, values) => {
    const useBubbleStore = require('./state').default;
    const editBubbleValues = useBubbleStore.getState().editBubbleValues;
    editBubbleValues(index, values);
};

export { addNewBubble, updateExistingBubble, deleteExistingBubble, getBubbleByIndex, editBubbleValues };
*/