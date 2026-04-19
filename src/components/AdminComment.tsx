import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  MessageCircle,
  Send,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import type { CommentType } from "@/hooks/clientState/useBlog";
import { formatDate } from "@/lib/formattedDate";
import {
  useLikeComment,
  useDislikeComment,
  useInfiniteReplies,
} from "@/hooks/serverState/useBlogServer";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";

interface AdminCommentCardProps {
  comment: CommentType;
  blogId: string;
  allComments: CommentType[];
  expandedReplies: Set<string>;
  onToggleReplies: (commentId: string) => void;
  onEdit: (comment: CommentType) => void;
  onEditSubmit: (comment: CommentType, newText: string) => void;
  onCancelEdit: () => void;
  onDelete: (commentId: string) => void;
  onReply: (comment: CommentType) => void;
  onReplySubmit: (comment: CommentType, replyText: string) => void;
  isReplyingTo: CommentType | null;
  isEditing: CommentType | null;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onCancelReply: () => void;
  isPendingReply?: boolean;
  isPendingEdit?: boolean;
}

export const AdminCommentCard = ({
  comment,
  blogId,
  allComments,
  expandedReplies,
  onToggleReplies,
  onEdit,
  onEditSubmit,
  onCancelEdit,
  onDelete,
  onReply,
  onReplySubmit,
  isReplyingTo,
  isEditing,
  replyText,
  onReplyTextChange,
  onCancelReply,
  isPendingReply,
  isPendingEdit,
}: AdminCommentCardProps) => {
  const replies = allComments.filter((c) => c.parentComment === comment.id);
  const isExpanded = expandedReplies.has(comment.id as string);
  const isReplying = isReplyingTo?.id === comment.id;

  const { mutate: likeComment } = useLikeComment();
  const { mutate: dislikeComment } = useDislikeComment();

  const handleLike = () => {
    likeComment(
      { blogId, commentId: comment.id as string },
      {
        onError: () => {
          toast.error("Failed to like comment");
        },
      },
    );
  };

  const handleDislike = () => {
    dislikeComment(
      { blogId, commentId: comment.id as string },
      {
        onError: () => {
          toast.error("Failed to dislike comment");
        },
      },
    );
  };

  const handleStartReply = () => {
    onReply(comment);
  };

  const handleCancelReplyForm = () => {
    onCancelReply();
  };

  const handleSubmitReply = () => {
    onReplySubmit(comment, replyText);
  };

  const handleStartEdit = () => {
    onEdit(comment);
  };

  const handleCancelEditForm = () => {
    onCancelEdit();
  };

  const handleSubmitEdit = () => {
    onEditSubmit(comment, isEditing?.content || "");
  };

  const isEditingThis = isEditing?.id === comment.id;
  const editingContent = isEditingThis ? isEditing?.content || "" : "";

  return (
    <Card key={comment?.id} className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="font-medium">
            {comment.author?.firstName} {comment?.author?.lastName}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(comment?.createdAt as Date)}
          </div>
        </div>
        <div className="flex gap-1">
          <TooltipProvider>
            {(replies.length > 0 || isExpanded) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleReplies(comment.id as string)}
                    className="h-8 w-8"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isExpanded ? "Hide" : "Show"} Replies ({replies.length})
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleStartReply}
                  className="h-8 w-8"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reply</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleStartEdit}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(comment?.id as string)}
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {isReplying && (
        <div className="space-y-2 mt-2">
          <Input
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            placeholder={`Reply to ${comment.author?.firstName}...`}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && handleSubmitReply()
            }
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCancelReplyForm}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitReply}
              disabled={!replyText.trim() || isPendingReply}
            >
              {isPendingReply ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-1" />
              )}
              Reply
            </Button>
          </div>
        </div>
      )}

      {isEditingThis && (
        <div className="space-y-2 mt-2">
          <Input
            value={editingContent}
            onChange={(e) => onEditSubmit(comment, e.target.value)}
            placeholder="Edit comment..."
            onKeyDown={(e) => e.key === "Enter" && handleSubmitEdit()}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCancelEditForm}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitEdit}
              disabled={!editingContent.trim() || isPendingEdit}
            >
              {isPendingEdit ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-1" />
              )}
              Save
            </Button>
          </div>
        </div>
      )}

      {!isReplying && !isEditingThis && (
        <>
          <p className="text-sm text-muted-foreground">{comment?.content}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-primary"
                onClick={handleLike}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                {comment?.likedBy?.length || 0}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-primary"
                onClick={handleDislike}
              >
                <ThumbsDown className="h-3 w-3 mr-1" />
                {comment?.dislikedBy?.length || 0}
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

interface AdminReplyCardProps {
  reply: CommentType;
  blogId: string;
  onEdit: (comment: CommentType) => void;
  onEditSubmit: (comment: CommentType, newText: string) => void;
  onCancelEdit: () => void;
  onDelete: (commentId: string) => void;
  isEditing?: CommentType | null;
  isPendingEdit?: boolean;
}

export const AdminReplyCard = ({
  reply,
  blogId,
  onEdit,
  onEditSubmit,
  onCancelEdit,
  onDelete,
  isEditing,
  isPendingEdit,
}: AdminReplyCardProps) => {
  const { mutate: likeComment } = useLikeComment();
  const { mutate: dislikeComment } = useDislikeComment();

  const handleLike = () => {
    likeComment(
      { blogId, commentId: reply.id as string },
      {
        onError: () => {
          toast.error("Failed to like comment");
        },
      },
    );
  };

  const handleDislike = () => {
    dislikeComment(
      { blogId, commentId: reply.id as string },
      {
        onError: () => {
          toast.error("Failed to dislike comment");
        },
      },
    );
  };

  const handleStartEdit = () => {
    onEdit(reply);
  };

  const handleCancelEditForm = () => {
    onCancelEdit();
  };

  const handleSubmitEdit = () => {
    onEditSubmit(reply, isEditing?.content || "");
  };

  const isEditingThis = isEditing?.id === reply.id;
  const editingContent = isEditingThis ? isEditing?.content || "" : "";

  return (
    <Card key={reply?.id} className="ml-8 p-3 border-l-2 border-primary/20">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="font-medium text-sm">
            {reply.author?.firstName} {reply?.author?.lastName}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(reply?.createdAt as Date)}
          </div>
        </div>
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(reply)}
                  className="h-7 w-7"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(reply?.id as string)}
                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {isEditingThis && (
        <div className="space-y-2 mt-2">
          <Input
            value={editingContent}
            onChange={(e) => onEditSubmit(reply, e.target.value)}
            placeholder="Edit reply..."
            className="text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSubmitEdit()}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCancelEditForm}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitEdit}
              disabled={!editingContent.trim() || isPendingEdit}
            >
              {isPendingEdit ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      )}

      {!isEditingThis && (
        <>
          <p className="text-sm text-muted-foreground">{reply?.content}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-1 text-muted-foreground hover:text-primary"
                onClick={handleLike}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                {reply?.likedBy?.length || 0}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-1 text-muted-foreground hover:text-primary"
                onClick={handleDislike}
              >
                <ThumbsDown className="h-3 w-3 mr-1" />
                {reply?.dislikedBy?.length || 0}
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

interface AdminRepliesListProps {
  commentId: string;
  blogId: string;
  onEdit: (comment: CommentType) => void;
  onEditSubmit: (comment: CommentType, newText: string) => void;
  onCancelEdit: () => void;
  onDelete: (commentId: string) => void;
  isEditing: CommentType | null;
  isPendingEdit: boolean;
}

export const AdminRepliesList = ({
  commentId,
  blogId,
  onEdit,
  onEditSubmit,
  onCancelEdit,
  onDelete,
  isEditing,
  isPendingEdit,
}: AdminRepliesListProps) => {
  const {
    data: repliesData,
    isFetchingNextPage: isFetchingRepliesNextPage,
    hasNextPage: hasRepliesNextPage,
    fetchNextPage: fetchRepliesNextPage,
  } = useInfiniteReplies(blogId, commentId);
  const replies = repliesData?.pages.flatMap((page) => page.data) || [];

  if (replies.length === 0) {
    return (
      <div className="mt-2 space-y-2">
        <div className="text-center py-4 text-muted-foreground text-sm">
          No replies yet
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      {replies.map((reply) => (
        <AdminReplyCard
          key={reply.id}
          reply={reply}
          blogId={blogId}
          onEdit={onEdit}
          onEditSubmit={onEditSubmit}
          onCancelEdit={onCancelEdit}
          onDelete={onDelete}
          isEditing={isEditing}
          isPendingEdit={isPendingEdit}
        />
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
