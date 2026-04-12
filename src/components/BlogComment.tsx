import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import type { CommentType } from "@/hooks/clientState/useBlog";
import { useUser } from "@/hooks/clientState/useUser";

interface BlogCommentProps {
  comment: CommentType;
  blogId: string;
  onReply?: (comment: CommentType) => void;
}

const BlogComment = ({ comment, blogId, onReply }: BlogCommentProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const user = useUser((state) => state.user);

  const handleReply = () => {
    if (replyText.trim() === "") return;
    onReply?.(comment);
    setReplyText("");
    setShowReplyForm(false);
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
            <Button variant="ghost">
              <ThumbsUp
                className={`${comment.likedBy.includes(user?.id as string) ? "fill-primary stroke-primary" : ""}`}
              />{" "}
              <span>{comment.likedBy.length}</span>
            </Button>
            <Button variant={"ghost"}>
              <ThumbsDown
                className={`${comment.dislikedBy.includes(user?.id as string) ? "fill-primary stroke-primary" : ""}`}
              />{" "}
              <span>{comment.dislikedBy.length}</span>
            </Button>
            <Button variant={"ghost"} onClick={() => setShowReplies(!showReplies)}>
              <MessageCircle className="h-4 w-4" />
              <span>{comment?.replies?.length || 0}</span>
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
                    onKeyPress={(e) => e.key === "Enter" && handleReply()}
                  />
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="h-9"
                  >
                    {"Reply"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="ml-13 mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <BlogComment
              key={reply.id}
              comment={reply}
              blogId={blogId}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogComment;
