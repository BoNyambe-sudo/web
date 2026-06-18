import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Loader2,
  MessageCircle,
  Save,
  Send,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
} from "lucide-react";
import type { CommentType } from "@/hooks/clientState/useBlog";
import { formatDate } from "@/lib/formattedDate";
import {
  useCommentHardDelete,
  useCreateComment,
  useDislikeComment,
  useInfiniteReplies,
  useLikeComment,
  useUpdateComment,
} from "@/hooks/serverState/useBlogServer";
import { useUserData } from "@/hooks/serverState/useUserServer";
import toast from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCompactNumber } from "@/lib/utils";

interface AdminReplyCardProps {
  reply: CommentType;
  blogId: string;
}

export const AdminReplyCard = ({ reply, blogId }: AdminReplyCardProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.content);

  const { data: user } = useUserData();
  const {
    data: repliesData,
    isFetchingNextPage: isFetchingNestedReplies,
    hasNextPage: hasNestedReplies,
    fetchNextPage: fetchNestedReplies,
  } = useInfiniteReplies(blogId, reply.id as string);
  const nestedReplies = repliesData?.pages.flatMap((page) => page.data) || [];

  const { mutate: createReply } = useCreateComment();
  const { mutate: likeComment } = useLikeComment();
  const { mutate: dislikeComment } = useDislikeComment();
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment();
  const { mutate: deleteComment } = useCommentHardDelete();

  const canEdit =
    user &&
    (user.role === "ADMIN" ||
      (reply.author &&
        user.email &&
        reply.author.email &&
        user.email.toLowerCase() === reply.author.email.toLowerCase()));
  const canDelete = user && user.role === "ADMIN";

  const handleLike = () => {
    if (!user) {
      toast.error("You must login first");
      return;
    }
    likeComment({
      blogId,
      commentId: reply.id as string,
      parentId: reply.parentComment ?? undefined,
    });
  };

  const handleDislike = () => {
    if (!user) {
      toast.error("You must login first");
      return;
    }
    dislikeComment({
      blogId,
      commentId: reply.id as string,
      parentId: reply.parentComment ?? undefined,
    });
  };

  const handleReply = () => {
    if (!user) {
      toast.error("You must login first");
      return;
    }
    if (replyText.trim() === "") return;
    createReply(
      {
        blogId,
        comment: { content: replyText },
        parentId: reply.id as string,
      },
      {
        onSuccess: () => {
          setReplyText("");
          setShowReplyForm(false);
          setShowReplies(true);
          toast.success("Reply successfully created.");
        },
      },
    );
  };

  const handleDelete = () => {
    if (!user) {
      toast.error("You must login first");
      return;
    }
    if (user.role !== "ADMIN") {
      toast.error("You do not have enough permissions to delete");
      return;
    }
    deleteComment(
      { blogId, commentId: reply.id as string },
      {
        onSuccess: () => {
          toast.success("Comment deleted successfully");
        },
      },
    );
  };

  const handleStartEdit = () => {
    setEditText(reply.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditText(reply.content);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!user) {
      toast.error("You must login first");
      return;
    }
    if (!editText.trim()) return;
    updateComment({
      blogId,
      commentId: reply.id as string,
      comment: { content: editText },
    });
    setIsEditing(false);
  };

  return (
    <>
      <Card className="ml-8 p-3 border-l-2 border-primary/20">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="font-medium text-sm">
              {reply.author?.firstName} {reply.author?.lastName}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDate(reply.createdAt as Date)}
            </div>
          </div>
          <div className="flex gap-1">
            <TooltipProvider>
              {(nestedReplies.length > 0 || showReplies) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowReplies(!showReplies)}
                      className="h-7 w-7"
                    >
                      {showReplies ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {showReplies ? "Hide" : "Show"} Replies (
                      {nestedReplies.length})
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="h-7 w-7"
                  >
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reply</p>
                </TooltipContent>
              </Tooltip>
              {canEdit && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleStartEdit}
                      className="h-7 w-7"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit</p>
                  </TooltipContent>
                </Tooltip>
              )}
             {canDelete && <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>}
            </TooltipProvider>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2 mt-2">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Edit reply..."
              className="text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
            />
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
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
          <>
            <p className="text-sm text-muted-foreground">{reply.content}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-1 text-muted-foreground hover:text-primary"
                  onClick={handleLike}
                >
                  <ThumbsUp
                    className={`h-3 w-3 mr-1 ${reply.likedBy?.includes(user?.id as string) ? "fill-primary stroke-primary" : ""}`}
                  />
                  {formatCompactNumber(reply.likedBy?.length || 0)}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-1 text-muted-foreground hover:text-primary"
                  onClick={handleDislike}
                >
                  <ThumbsDown
                    className={`h-3 w-3 mr-1 ${reply.dislikedBy?.includes(user?.id as string) ? "fill-primary stroke-primary" : ""}`}
                  />
                  {formatCompactNumber(reply.dislikedBy?.length || 0)}
                </Button>
              </div>
            </div>
          </>
        )}

        {showReplyForm && (
          <div className="space-y-2 mt-2">
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${reply.author?.firstName}...`}
              className="text-sm"
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleReply()
              }
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowReplyForm(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleReply}
                disabled={!replyText.trim()}
              >
                <Send className="h-3 w-3 mr-1" />
                Reply
              </Button>
            </div>
          </div>
        )}
      </Card>

      {showReplies && nestedReplies.length > 0 && (
        <div className="mt-2 ml-4 space-y-2">
          {nestedReplies.map((nestedReply) => (
            <AdminReplyCard
              key={nestedReply.id}
              reply={nestedReply}
              blogId={blogId}
            />
          ))}
          {hasNestedReplies && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => fetchNestedReplies()}
                disabled={isFetchingNestedReplies}
                size="sm"
              >
                {isFetchingNestedReplies ? (
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
      )}
    </>
  );
};
