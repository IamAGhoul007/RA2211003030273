
import React from "react";
import { User } from "@/types";
import { cn } from "@/lib/utils";
import { FileText, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface UserCardProps {
  user: User;
  rank?: number;
  className?: string;
  imageSize?: "small" | "medium" | "large";
  style?: React.CSSProperties;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  rank,
  className,
  imageSize = "medium",
  style,
}) => {
  const avatarSizeClasses = {
    small: "h-8 w-8",
    medium: "h-12 w-12",
    large: "h-16 w-16",
  };

  return (
    <div 
      className={cn(
        "glass-card p-4 rounded-xl transition-all duration-300 hover:shadow-md animate-scale-in",
        className
      )}
      style={style}
    >
      <div className="flex items-center gap-4">
        {rank && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {rank}
          </div>
        )}
        
        <div className="relative">
          {user.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user.name}
              className={cn(
                "rounded-full object-cover",
                avatarSizeClasses[imageSize]
              )}
            />
          ) : (
            <div className={cn(
              "rounded-full bg-primary/10 flex items-center justify-center text-primary",
              avatarSizeClasses[imageSize]
            )}>
              <UserIcon className="h-1/2 w-1/2" />
            </div>
          )}
          
          {user.postCount && user.postCount > 0 && (
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full text-xs font-medium h-6 px-2 flex items-center">
              <FileText className="h-3 w-3 mr-1" />
              {user.postCount}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base text-foreground truncate">
            {user.name}
          </h3>
          <div className="flex items-center mt-1">
            <Link 
              to={`/feed?user=${user.id}`}
              className="text-xs text-primary hover:underline transition-all"
            >
              View posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
