import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  Save,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import type { CommentType } from "@/hooks/clientState/useBlog";
import { useUserData } from "@/hooks/serverState/useUserServer";
import {
  useCreateComment,
  useDislikeComment,
  useInfiniteReplies,
  useLikeComment,
  useUpdateComment,
} from "@/hooks/serverState/useBlogServer";
import toast from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface BlogCommentProps {
  comment: CommentType;
  blogId: string;
  onReply?: (comment: CommentType) => void;
}

const BlogComment = ({ comment, blogId, onReply }: BlogCommentProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const { data: user } = useUserData();
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteReplies(blogId, comment.id as string);
  const replies = data?.pages.flatMap((page) => page.data);
  const { mutate: createReply } = useCreateComment();
  const { mutate: likeComment } = useLikeComment();
  const { mutate: dislikeComment } = useDislikeComment();
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment();

  const canEdit =
    user &&
    (user.role === "ADMIN" ||
      (comment.author &&
        user.email &&
        comment.author.email &&
        user.email.toLowerCase() === comment.author.email.toLowerCase()));

  const handleReply = () => {
    if (!user) {
      toast.error("You must login first");
      return;
    }
    if (user.status === "BLOCKED") {
      toast.error("Your account is blocked.");
      return;
    }
    if (replyText.trim() === "") {
      return;
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
          setShowReplyForm(false);
          onReply?.(comment);
          toast.success("Reply successfully created.");
        },
      },
    );
  };

  const handleLikeComment = () => {
    if (!user) {
      toast.error("You must login first");
      return;
    }
    if (user.status === "BLOCKED") {
      toast.error("Your account is blocked.");
      return;
    }
    likeComment({
      blogId,
      commentId: comment.id as string,
      parentId: comment.parentComment ?? undefined,
    });
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
    dislikeComment({
      blogId,
      commentId: comment.id as string,
      parentId: comment.parentComment ?? undefined,
    });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const handleStartEdit = () => {
    setEditText(comment.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditText(comment.content);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!user) {
      toast.error("You must login first.");
      return;
    }
    if (!editText.trim()) return;
    updateComment({
      blogId,
      commentId: comment.id as string,
      comment: { content: editText },
    });
    setIsEditing(false);
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
            {isEditing ? (
              <div className="space-y-2 mt-2">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Edit comment..."
                  className="text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={!editText.trim() || isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Save className="h-3 w-3 mr-1" />
                    )}
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-3">
                {comment.content}
              </p>
            )}
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
            <TooltipProvider>
              {replies && replies.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowReplies(!showReplies)}
                      className="h-8 w-8"
                    >
                      {showReplies ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {showReplies ? "Hide" : "Show"} Replies ({replies?.length}
                      )
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="h-8 text-xs"
            >
              Reply
            </Button>
            {canEdit && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStartEdit}
                className="h-8 text-xs"
              >
                Edit
              </Button>
            )}
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
