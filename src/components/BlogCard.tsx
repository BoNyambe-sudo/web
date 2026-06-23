import { cn, formatCompactNumber } from "@/lib/utils";
import { Card, CardAction, CardContent, CardHeader } from "./ui/card";
import { Link } from "react-router";
import { Calendar, Eye } from "lucide-react";
import type { BlogType } from "@/hooks/clientState/useBlog";
import { formatDate } from "@/lib/formattedDate";

const BlogCard = ({
  blog,
  className,
}: {
  blog: BlogType;
  className?: string;
}) => {
  const formattedDate = formatDate(blog.createdAt);
  return (
    <Card
      className={cn(
        "relative mx-auto w-full max-w-auto h-auto pt-0 gap-4 overflow-hidden",
        className,
      )}
    >
      <Link to={`/blogs/${blog.id}`} className=" hoverEffect group">
        <img
          src={blog.thumbnail}
          className="relative z-20 aspect-video w-full object-cover transition-transform group-hover:scale-[1.02]"
          alt={blog.title}
          loading="lazy"
        />
      </Link>

      <CardHeader>
        <p className="font-semibold text-sm border-b-2 pb-1 text-primary/60">
          {blog.category}
        </p>
        <CardAction className="flex gap-2 items-center border-b-2 pb-1 flex-wrap">
          <Calendar size={16} className="text-muted-foreground" />
          <p className="font font-semibold text-muted-foreground text-sm">
            {formattedDate}
          </p>
          {blog.views !== undefined && (
            <span className="flex items-center gap-1 text-muted-foreground text-xs">
              <Eye size={14} />
              {formatCompactNumber(blog.views)}
            </span>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>
        <Link className="text-lg font-semibold" to={`/blogs/${blog.id}`}>
          {blog.title}
        </Link>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
