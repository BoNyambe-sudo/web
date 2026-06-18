import { useBlogAnalytics } from "@/hooks/serverState/useBlogServer";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Eye } from "lucide-react";
import { formatCompactNumber } from "@/lib/utils";

export type BlogsPerCategoryType = {
  category: string;
  count: number;
};

const BlogsPerCategory = () => {
  const { data: blogsMetrics } = useBlogAnalytics();

  const viewsByCategory = new Map(
    (blogsMetrics?.viewsPerCategory || []).map((c) => [c.category, c.views]),
  );

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-8">
      {blogsMetrics?.blogsPerCategory?.map((category) => (
        <Card key={category.category}>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm font-medium">
              {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-1">
            <div className="text-2xl font-bold">{category.count}</div>
            <p className="text-xs text-muted-foreground">
              {category.count === 1
                ? "Blog"
                : category.count > 1
                  ? "Blogs"
                  : "No Blogs"}
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Eye size={14} />
              <span>
                {formatCompactNumber(viewsByCategory.get(category.category) ?? 0)}{" "}
                {viewsByCategory.get(category.category) === 1
                  ? "view"
                  : "views"}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BlogsPerCategory;
