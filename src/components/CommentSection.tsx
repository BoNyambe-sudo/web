import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BlogComment from "./BlogComment";
import { useBlog } from "@/hooks/clientState/useBlog";
import { sampleComments } from "@/temporalData";
import { useUser } from "@/hooks/clientState/useUser";

interface CommentsSectionProps {
  blogId: string;
  currentUserId?: string;
}

const CommentSection = ({ blogId }: CommentsSectionProps) => {
  const setComments = useBlog((state) => state.setComments);
  const user = useUser(state => state.user)
  const [commentText, setCommentText] = useState("");
  const comments = useBlog((state) => state.comments);
  const topLevelComments = comments.filter(
    (comment) => comment.parentComment === null,
  );
  const replyComments = comments.filter(
    (comment) => comment.parentComment !== null,
  );

  const commentsWithReplies = topLevelComments.map((comment) => ({
    ...comment,
    replies: replyComments.filter(
      (reply) => reply.parentComment === comment.id,
    ),
  }));

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  useEffect(() => {
    setComments(sampleComments)
  }, [setComments])
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

      {/* Add new comment */}
      <div className="mb-8">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {user ? getInitials(user?.firstName, user?.lastName) : "G"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex gap-2">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="text-sm"
              />
              <Button size="sm" disabled={!commentText.trim()} className="h-9">
                Comment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments list */}
      {commentsWithReplies.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {commentsWithReplies.map((comment) => (
              <BlogComment key={comment.id} comment={comment} blogId={blogId} />
            ))}
          </div>

          {/* Load more button */}
          {/* {hasNextPage && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="h-10"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  "Load More Comments"
                )}
              </Button>
            </div> */}
        </>
      )}
    </div>
  );
};

export default CommentSection;
