import * as React from "react";
import { Calendar, Eye } from "lucide-react";
import { formatDate } from "@/lib/formattedDate";
import { formatCompactNumber } from "@/lib/utils";
import type { BlogType } from "@/lib/api";

const BlogCard = ({ blog }: { blog: BlogType }) => {
  const formattedDate = formatDate(blog.createdAt);
  return (
    <div className="relative mx-auto w-full max-w-auto h-auto pt-0 gap-4 overflow-hidden rounded-xl border bg-card">
      <a href={`/web/blog/${blog.slug}`} className="hoverEffect group block">
        <img src={blog.thumbnail} className="relative z-20 aspect-video w-full object-cover transition-transform group-hover:scale-[1.02]" alt={blog.title} loading="lazy" />
      </a>
      <div className="p-4 space-y-3">
        <div className="flex items-cnter justify-between gap-4">
        <p className="font-semibold flex-1 text-sm border-b-2 pb-1 text-primary/60">{blog.category}</p>
        <div className="flex gap-2 items-center border-b-2 pb-1 flex-wrap text-sm text-muted-foreground">
          <Calendar size={16} className="text-muted-foreground" />
          <span className="font font-semibold text-muted-foreground text-sm">{formattedDate}</span>
          {blog.views !== undefined && (
            <span className="flex items-center gap-1 text-muted-foreground text-xs">
              <Eye size={14} />
              {formatCompactNumber(blog.views)}
            </span>
          )}
        </div>
        </div>
        <a className="text-lg font-semibold hover:text-primary" href={`/web/blog/${blog.slug}`}>{blog.title}</a>
      </div>
    </div>
  );
};

export default BlogCard;
