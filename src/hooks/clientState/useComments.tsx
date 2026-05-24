import { create } from "zustand";
import type { CommentType } from "./useBlog";

export type CommentReplyType = {
  showReplies: boolean;
  selectedComment: CommentType | null;
  setShowReplies: (show: boolean) => void;
  setSelectedComment: (comment: CommentType | null) => void;
};

export const useCommentReplyStore = create<CommentReplyType>((set) => ({
  showReplies: false,
  selectedComment: null,
  setShowReplies: (show) => set({ showReplies: show }),
  setSelectedComment: (comment) => set({ selectedComment: comment }),
}));
