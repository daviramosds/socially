"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";

function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* HEADER SKELETON */}
        <div className="flex space-x-3 sm:space-x-4">
          <Skeleton className="size-8 sm:size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>

        <Skeleton className="w-full h-4" />
        <Skeleton className="w-3/4 h-4" />

        <Skeleton className="w-full h-52 rounded-lg" />

        <div className="flex items-center space-x-4 pt-2">
          <Skeleton className="w-16 h-8 rounded-md" />
          <Skeleton className="w-16 h-8 rounded-md" />
        </div>

      </CardContent>
    </Card>
  );
}

export default PostCardSkeleton;
