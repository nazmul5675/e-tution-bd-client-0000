import React from "react";
import Skeleton from "../ui/Skeleton";

const TutorCardSkeleton = () => {
    return (
        <div className="relative rounded-box border border-base-300 bg-base-300/70 backdrop-blur shadow-lg">
            <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>

                <div className="h-px w-full bg-base-300" />

                <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>

                <div className="flex justify-end pt-2">
                    <Skeleton className="h-8 w-28" />
                </div>
            </div>
        </div>
    );
};

export default TutorCardSkeleton;