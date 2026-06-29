import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const BlogCardSkeleton = () => {
  return (
    <Card className="w-full max-w-auto h-auto pt-0 gap-4 overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <CardHeader>
        <Skeleton className="h-4 w-16 border-b-2 pb-1" />
        <div className="flex gap-2 items-center border-b-2 pb-1">
          <Skeleton className="h-3 w-4" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-8" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-5 w-3/4" />
      </CardContent>
    </Card>
  );
};

export const BlogListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
};
