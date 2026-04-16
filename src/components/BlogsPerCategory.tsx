import { useBlogAnalytics } from "@/hooks/serverState/useBlogServer";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
export type BlogsPerCategoryType = {
  category: string;
  count: number;
};

const BlogsPerCategory = () => {
  const { data: blogsMetrics } = useBlogAnalytics();
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-8">
      {blogsMetrics?.blogsPerCategory?.map((category) => (
        <Card key={category.category}>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm font-medium">
              {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-2xl font-bold">{category.count}</div>
            <p className="text-xs text-muted-foreground">
              {category.count === 1
                ? "Blog"
                : category.count > 1
                  ? "Blogs"
                  : "No Blogs"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BlogsPerCategory;
