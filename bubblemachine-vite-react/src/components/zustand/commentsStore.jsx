import { create } from "zustand";

const useCommentsStore = create((set, get) => ({
  comments: [],

  addComment: (comment) => {
    set((state) => ({
      comments: [...state.comments, comment],
    }));
  },

  updateComment: (id, updatedComment) => {
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === id ? { ...comment, ...updatedComment } : comment
      ),
    }));
  },

  deleteComment: (id) => {
    set((state) => ({
      comments: state.comments.filter((comment) => comment.id !== id),
    }));
  },

  clearComments: () => {
    set({ comments: [] });
  },
}));

export default useCommentsStore;
