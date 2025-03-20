
import React, { useState } from "react";
import { Post, Comment } from "@/types";
import { cn } from "@/lib/utils";
import { MessageCircle, User, ChevronDown, ChevronUp } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS } from "@/lib/constants";
import { CommentsResponse } from "@/types";
import LoadingState from "./LoadingState";

interface PostCardProps {
  post: Post;
  showComments?: boolean;
  className?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  showComments = false,
  className,
}) => {
  const [expanded, setExpanded] = useState<boolean>(showComments);
  
  // Only fetch comments if expanded
  const { data, isLoading } = useApi<CommentsResponse>(
    API_ENDPOINTS.POST_COMMENTS(post.id),
    { initialFetch: expanded }
  );

  const comments = data?.comments || [];
  
  const toggleComments = () => {
    setExpanded(prev => !prev);
  };

  return (
    <div
      className={cn(
        "glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in",
        className
      )}
    >
      <div className="p-4 space-y-4">
        {/* Header with user info */}
        <div className="flex items-center gap-3">
          {post.userAvatarUrl ? (
            <img 
              src={post.userAvatarUrl} 
              alt={post.username || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-5 w-5" />
            </div>
          )}
          
          <div>
            <h3 className="font-medium text-foreground">
              {post.username || `User ${post.userid}`}
            </h3>
            <p className="text-xs text-muted-foreground">
              Post #{post.id}
            </p>
          </div>
        </div>
        
        {/* Post content */}
        <p className="text-foreground">{post.content}</p>
        
        {/* Post image if available */}
        {post.imageUrl && (
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <img 
              src={post.imageUrl} 
              alt="Post content"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        
        {/* Comments toggle */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <button 
            onClick={toggleComments}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>
              {post.commentCount || comments.length || 0} {post.commentCount === 1 || comments.length === 1 ? 'Comment' : 'Comments'}
            </span>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      {/* Comments section */}
      {expanded && (
        <div className="bg-muted/50 p-4 animate-fade-in">
          <h4 className="font-medium text-sm mb-3">Comments</h4>
          
          {isLoading ? (
            <LoadingState type="shimmer" message="" />
          ) : comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  return (
    <div className="bg-background/50 rounded-lg p-3 animate-fade-in">
      <div className="flex items-start gap-2">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
          <User className="h-3 w-3" />
        </div>
        <div>
          <p className="text-sm">{comment.content}</p>
          <p className="text-xs text-muted-foreground mt-1">Comment #{comment.id}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
