import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "white";
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "primary",
  fullScreen = false,
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const colorClasses = {
    primary: "text-blue-600",
    white: "text-white",
  };

  const spinnerClasses = `
    animate-spin rounded-full border-2 
    ${sizeClasses[size]} 
    ${colorClasses[color]}
    border-t-transparent
  `;

  const wrapperClasses = fullScreen
    ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    : "flex items-center justify-center";

  return (
    <div className={wrapperClasses}>
      <div className={spinnerClasses} role="status" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
