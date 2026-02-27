import React from "react";

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

/**
 * Reusable Skeleton block for loading states.
 * Use w-*, h-* utilities to control size.
 */
const Skeleton = ({ className = "" }) => {
    return <div className={cn("skeleton", className)} aria-hidden="true" />;
};

export default Skeleton;