import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, getRandomAvatar, getRandomPostImage } from "@/lib/constants";
import { UsersResponse, Post, PostsResponse } from "@/types";
import PostCard from "@/components/PostCard";
import LoadingState from "@/components/LoadingState";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const Feed = () => {
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  
  // Get userId from query params if any
  const searchParams = new URLSearchParams(location.search);
  const selectedUserId = searchParams.get('user');
  
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
  
  const fetchPosts = async () => {
    if (!usersMap || Object.keys(usersMap).length === 0) return;
    
    try {
      setIsProcessing(true);
      
      let allPosts: Post[] = [];
      
      if (selectedUserId) {
        // If a user is selected, only fetch posts for that user
        const userId = selectedUserId;
        if (usersMap[userId]) {
          const response = await fetch(API_ENDPOINTS.USER_POSTS(userId));
          
          if (!response.ok) {
            throw new Error(`Failed to fetch posts for user ${userId}`);
          }
          
          const data: PostsResponse = await response.json();
          
          // Enrich posts with username and avatar
          allPosts = data.posts.map(post => ({
            ...post,
            username: usersMap[userId],
            userAvatarUrl: getRandomAvatar(userId),
            imageUrl: getRandomPostImage(post.id),
          }));
        }
      } else {
        // Otherwise fetch posts for all users (limited to a few for performance)
        const userIdsToFetch = Object.keys(usersMap).slice(0, 5); // Limit to 5 users
        
        const postsPromises = userIdsToFetch.map(async (userId) => {
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
        });
        
        const postsArrays = await Promise.all(postsPromises);
        allPosts = postsArrays.flat();
      }
      
      // Sort posts by ID (descending) to get newest first
      // Note: This assumes higher IDs are newer posts
      const sortedPosts = allPosts.sort((a, b) => b.id - a.id);
      
      setPosts(sortedPosts);
      
      if (sortedPosts.length === 0) {
        toast.info("No posts available for the selected filters");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setIsProcessing(false);
    }
  };
  
  useEffect(() => {
    if (Object.keys(usersMap).length > 0) {
      fetchPosts();
      
      // Set up polling for real-time updates (every 30 seconds)
      const intervalId = setInterval(fetchPosts, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [usersMap, selectedUserId]);
  
  const handleRefresh = () => {
    fetchPosts();
    toast.success("Feed refreshed");
  };
  
  const isLoading = isLoadingUsers || (isProcessing && posts.length === 0);
  
  return (
    <div className="container px-4 py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              {selectedUserId 
                ? `Posts by ${usersMap[selectedUserId] || 'User'}`
                : 'Live Feed'
              }
            </h1>
            <p className="text-muted-foreground">
              {selectedUserId 
                ? 'All posts from this user'
                : 'Latest posts from the community'
              }
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isProcessing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {isLoading ? (
          <LoadingState 
            type="shimmer" 
            message="Loading feed..." 
            className="py-12"
          />
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 rounded-xl text-center">
            <p className="text-muted-foreground">No posts found</p>
            {selectedUserId && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  window.location.href = '/feed';
                }}
              >
                View all posts
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
