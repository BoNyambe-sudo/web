import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BlogComment from "./BlogComment";
import { useUserData } from "@/hooks/serverState/useUserServer";
import {
  useCreateComment,
  useInfiniteComments,
} from "@/hooks/serverState/useBlogServer";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface CommentsSectionProps {
  blogId: string;
}

const CommentSection = ({ blogId }: CommentsSectionProps) => {
  const { data: user } = useUserData();
  const [commentText, setCommentText] = useState("");
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteComments(blogId, { limit: 1});
  const comments = data?.pages.flatMap((page) => page.data);
  const topLevelComments = comments?.filter(
    (cmm) => cmm.parentComment,
  );
  const { mutate: createComment } = useCreateComment();

  const handleCreateComment = () => {
    if (!user) {
      toast.error("You must login first");
      return;
    }
    if (user.status === "BLOCKED") {
      toast.error("Your account is blocked.");
      return;
    }
    createComment(
      {
        blogId: blogId as string,
        comment: { content: commentText },
      },
      {
        onSuccess: () => {
          setCommentText("");
          toast.success("Comment created successfully");
        },
      },
    );
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Comments ({comments?.length})</h2>

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
              <Button
                size="sm"
                onClick={handleCreateComment}
                disabled={!commentText.trim()}
                className="h-9"
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments list */}
      {topLevelComments?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {topLevelComments?.map((comment) => (
              <BlogComment key={comment.id} comment={comment} blogId={blogId} />
            ))}
          </div>

          {/* Load more button */}
          {hasNextPage && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;
