export { AdminCommentCard } from "./AdminCommentCard";
export { AdminReplyCard } from "./AdminReplyCard";

import { useInfiniteReplies } from "@/hooks/serverState/useBlogServer";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AdminReplyCard } from "./AdminReplyCard";

interface AdminRepliesListProps {
  commentId: string;
  blogId: string;
}

export const AdminRepliesList = ({ commentId, blogId }: AdminRepliesListProps) => {
  const {
    data: repliesData,
    isFetchingNextPage: isFetchingRepliesNextPage,
    hasNextPage: hasRepliesNextPage,
    fetchNextPage: fetchRepliesNextPage,
  } = useInfiniteReplies(blogId, commentId);
  const replies = repliesData?.pages.flatMap((page) => page.data) || [];

  if (replies.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      {replies.map((reply) => (
        <AdminReplyCard key={reply.id} reply={reply} blogId={blogId} />
      ))}
      {hasRepliesNextPage && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={() => fetchRepliesNextPage()}
            disabled={isFetchingRepliesNextPage}
            size="sm"
          >
            {isFetchingRepliesNextPage ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              "Load More Replies"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};