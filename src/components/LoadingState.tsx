
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  message?: string;
  type?: "spinner" | "shimmer" | "pulse";
  size?: "small" | "medium" | "large";
}

const LoadingState: React.FC<LoadingStateProps> = ({
  className,
  message = "Loading...",
  type = "spinner",
  size = "medium",
}) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-12 w-12", 
    large: "h-16 w-16",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      {type === "spinner" && (
        <div className="relative">
          <div className={cn(
            "rounded-full border-t-2 border-primary animate-spin",
            sizeClasses[size]
          )} />
          <div className={cn(
            "absolute top-0 left-0 rounded-full border-2 border-transparent border-opacity-50",
            sizeClasses[size]
          )} />
        </div>
      )}
      
      {type === "pulse" && (
        <div className={cn(
          "rounded-full bg-primary/30 animate-pulse",
          sizeClasses[size]
        )} />
      )}
      
      {type === "shimmer" && (
        <div className="space-y-3 w-full max-w-md">
          <div className="h-8 bg-gray-200 rounded-md shimmer w-3/4 mx-auto" />
          <div className="h-4 bg-gray-200 rounded-md shimmer w-full" />
          <div className="h-4 bg-gray-200 rounded-md shimmer w-full" />
          <div className="h-4 bg-gray-200 rounded-md shimmer w-2/3" />
        </div>
      )}
      
      {message && (
        <p className="mt-4 text-muted-foreground animate-fade-in">{message}</p>
      )}
    </div>
  );
};

export default LoadingState;
