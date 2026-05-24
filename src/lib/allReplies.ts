import type { CommentType } from "@/hooks/clientState/useBlog";

const getTotalReplies = (replies: CommentType[], commentId: string) => {
  return replies.filter((rpl) => rpl.parentComment === commentId).length;
};

export default getTotalReplies;
