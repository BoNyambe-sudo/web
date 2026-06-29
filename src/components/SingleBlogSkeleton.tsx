import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Tag, User } from "lucide-react";

const SingleBlogSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-10 w-3/4 mb-4" />
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              <User size={20} />
            </AvatarFallback>
          </Avatar>
          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-32 w-full mt-6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Card>

      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Tag size={16} />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>

      <Card className="rounded-xl p-6 shadow-sm border border-border">
        <h3 className="font-bold text-lg mb-4">
          <Skeleton className="h-5 w-32" />
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div>
              <Skeleton className="h-3 w-20 mb-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SingleBlogSkeleton;
