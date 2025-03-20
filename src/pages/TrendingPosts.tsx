
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, getRandomAvatar, getRandomPostImage } from "@/lib/constants";
import { UsersResponse, User, Post, PostsResponse, CommentsResponse } from "@/types";
import PostCard from "@/components/PostCard";
import LoadingState from "@/components/LoadingState";
import { toast } from "sonner";
import { BarChart2 } from "lucide-react";

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  
  // Fetch all users first
  const { data: usersData, isLoading: isLoadingUsers } = useApi<UsersResponse>(
    API_ENDPOINTS.USERS
  );
  
  useEffect(() => {
    // Create a map of user IDs to names for easy lookup
    if (usersData?.users) {
      setUsersMap(usersData.users);
    }
  }, [usersData]);
  
  useEffect(() => {
    const fetchPostsAndComments = async () => {
      if (!usersMap || Object.keys(usersMap).length === 0) return;
      
      try {
        setIsProcessing(true);
        
        // First, we need to get posts from all users
        const allPostsPromises = Object.keys(usersMap).map(async (userId) => {
          try {
            const response = await fetch(API_ENDPOINTS.USER_POSTS(userId));
            
            if (!response.ok) {
              throw new Error(`Failed to fetch posts for user ${userId}`);
            }
            
            const data: PostsResponse = await response.json();
            
            // Enrich posts with username and avatar
            return data.posts.map(post => ({
              ...post,
              username: usersMap[userId],
              userAvatarUrl: getRandomAvatar(userId),
              imageUrl: getRandomPostImage(post.id),
            }));
          } catch (error) {
            console.error(`Error fetching posts for user ${userId}:`, error);
            return [];
          }
        });
        
        // Collect all posts
        const postsArrays = await Promise.all(allPostsPromises);
        const allPosts = postsArrays.flat();
        
        // Now fetch comment counts for each post
        const postsWithCommentPromises = allPosts.map(async (post) => {
          try {
            const response = await fetch(API_ENDPOINTS.POST_COMMENTS(post.id));
            
            if (!response.ok) {
              throw new Error(`Failed to fetch comments for post ${post.id}`);
            }
            
            const data: CommentsResponse = await response.json();
            
            return {
              ...post,
              commentCount: data.comments.length,
            };
          } catch (error) {
            console.error(`Error fetching comments for post ${post.id}:`, error);
            return {
              ...post,
              commentCount: 0,
            };
          }
        });
        
        const postsWithComments = await Promise.all(postsWithCommentPromises);
        
        // Sort by comment count (descending)
        const sortedPosts = postsWithComments.sort((a, b) => 
          (b.commentCount || 0) - (a.commentCount || 0)
        );
        
        // Find the maximum comment count
        const maxCommentCount = sortedPosts.length > 0 ? sortedPosts[0].commentCount || 0 : 0;
        
        // Filter posts with the maximum comment count
        const topPosts = sortedPosts.filter(post => 
          (post.commentCount || 0) === maxCommentCount
        );
        
        setTrendingPosts(topPosts);
      } catch (error) {
        console.error("Error processing posts and comments:", error);
        toast.error("Failed to load trending posts");
      } finally {
        setIsProcessing(false);
      }
    };
    
    fetchPostsAndComments();
  }, [usersMap]);
  
  const isLoading = isLoadingUsers || isProcessing;
  
  return (
    <div className="container px-4 py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Trending Posts</h1>
        <p className="text-muted-foreground mb-6">
          Posts with the highest number of comments
        </p>
        
        {isLoading ? (
          <LoadingState 
            type="shimmer" 
            message="Analyzing engagement metrics..." 
            className="py-12"
          />
        ) : trendingPosts.length > 0 ? (
          <div className="space-y-6">
            {trendingPosts.map((post, index) => (
              <PostCard 
                key={post.id} 
                post={post} 
                showComments={true}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 rounded-xl text-center">
            <BarChart2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No trending posts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingPosts;
