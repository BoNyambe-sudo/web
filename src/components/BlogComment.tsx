import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import type { CommentType } from "@/hooks/clientState/useBlog";
import { useUserData } from "@/hooks/serverState/useUserServer";
import {
  useCreateComment,
  useDislikeComment,
  useInfiniteReplies,
  useLikeComment,
} from "@/hooks/serverState/useBlogServer";
import toast from "react-hot-toast";

interface BlogCommentProps {
  comment: CommentType;
  blogId: string;
  onReply?: (comment: CommentType) => void;
}

const BlogComment = ({ comment, blogId, onReply }: BlogCommentProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { data: user } = useUserData();
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteReplies(blogId, comment.id as string);
  const replies = data?.pages.flatMap((page) => page.data);
  const { mutate: createReply } = useCreateComment();
  const { mutate: likeComment } = useLikeComment();
  const { mutate: dislikeComment } = useDislikeComment();

  const handleReply = () => {
    if (!user || replyText.trim() === "") {
      toast.error("You must login first")
      return
    }
    if(user.status === "BLOCKED"){
      toast.error("Your account is blocked.")
      return
    }
    createReply(
      {
        blogId: blogId,
        comment: { content: replyText },
        parentId: comment.id,
      },
      {
        onSuccess: () => {
          setReplyText("");
          toast.success("Reply successfully created.");
        },
      },
    );
    onReply?.(comment);
    setReplyText("");
    setShowReplyForm(false);
  };

  const handleLikeComment = () => {
    if(!user){
      toast.error("You must login first")
      return
    }
    if (user.status === "BLOCKED") {
      toast.error("Your account is blocked.");
      return;
    }
    likeComment({ blogId, commentId: comment.id as string });
  };

  const handleDislikeComment = () => {
    if (!user) {
      toast.error("You must login first");
      return;
    }
    if (user.status === "BLOCKED") {
      toast.error("Your account is blocked.");
      return;
    }
    dislikeComment({ blogId, commentId: comment.id as string });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="mb-6">
      <Card className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author.profilePicture} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(comment.author.firstName, comment.author.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">
                {comment.author.firstName} {comment.author.lastName}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(comment?.createdAt as Date).toLocaleDateString(
                  "en-US",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  },
                )}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {comment.content}
            </p>
            <Button onClick={handleLikeComment} variant="ghost">
              <ThumbsUp
                className={`${comment.likedBy.includes(user?.id as string) ? "fill-primary stroke-primary" : ""}`}
              />{" "}
              <span>{comment.likedBy.length}</span>
            </Button>
            <Button onClick={handleDislikeComment} variant={"ghost"}>
              <ThumbsDown
                className={`${comment.dislikedBy.includes(user?.id as string) ? "fill-primary stroke-primary" : ""}`}
              />{" "}
              <span>{comment.dislikedBy.length}</span>
            </Button>
            <Button
              variant={"ghost"}
              onClick={() => setShowReplies(!showReplies)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{replies?.length || 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="h-8 text-xs"
            >
              Reply
            </Button>
            {showReplyForm && (
              <div className="mt-3">
                <div className="flex gap-2">
                  <Input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleReply()}
                  />
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="h-9"
                  >
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
      {showReplies && replies && replies.length > 0 && (
        <div className="ml-13 mt-3 space-y-3">
          {replies.map((reply) => (
            <BlogComment
              key={reply.id}
              comment={reply}
              blogId={blogId}
              onReply={onReply}
            />
          ))}
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
                  "Load More Replies"
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogComment;
