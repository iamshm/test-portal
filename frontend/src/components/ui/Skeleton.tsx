import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  width,
  height,
  animation = "pulse",
}) => {
  const baseClasses = "bg-gray-200";
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
  };

  const style = {
    width: width,
    height: height || (variant === "text" ? "1em" : undefined),
  };

  return (
    <div
      className={`
        ${baseClasses}
        ${animationClasses[animation]}
        ${variantClasses[variant]}
        ${className}
      `}
      style={style}
      role="status"
      aria-label="Loading..."
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Predefined skeleton components for common use cases
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = "",
}) => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`${className} ${index === lines - 1 ? "w-4/5" : "w-full"}`}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <Skeleton variant="rectangular" className="w-full h-32 mb-4" />
      <SkeletonText lines={3} />
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 3,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-8" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-6" />
          ))}
        </div>
      ))}
    </div>
  );
};
