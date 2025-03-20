
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, getRandomAvatar } from "@/lib/constants";
import { UsersResponse, User, PostsResponse } from "@/types";
import UserCard from "@/components/UserCard";
import LoadingState from "@/components/LoadingState";
import { toast } from "sonner";

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);
  
  // Fetch all users
  const { data: usersData, isLoading: isLoadingUsers, error } = useApi<UsersResponse>(
    API_ENDPOINTS.USERS
  );
  
  useEffect(() => {
    const fetchPostsForUsers = async (users: Record<string, string>) => {
      try {
        setIsLoadingPosts(true);
        
        // Convert users object to array with id and name
        const usersArray = Object.entries(users).map(([id, name]) => ({
          id,
          name,
          avatarUrl: getRandomAvatar(id),
          postCount: 0,
        }));
        
        // Fetch post counts for each user in parallel
        const userPostPromises = usersArray.map(async (user) => {
          try {
            const response = await fetch(API_ENDPOINTS.USER_POSTS(user.id));
            
            if (!response.ok) {
              throw new Error(`Failed to fetch posts for user ${user.id}`);
            }
            
            const data: PostsResponse = await response.json();
            return {
              ...user,
              postCount: data.posts.length,
            };
          } catch (error) {
            console.error(`Error fetching posts for user ${user.id}:`, error);
            // Return user with 0 posts on error
            return user;
          }
        });
        
        // Wait for all promises to resolve
        const usersWithPostCounts = await Promise.all(userPostPromises);
        
        // Sort users by post count (descending) and take top 5
        const sortedUsers = usersWithPostCounts
          .sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
          .slice(0, 5);
        
        setTopUsers(sortedUsers);
      } catch (error) {
        console.error("Error processing users:", error);
        toast.error("Failed to load top users");
      } finally {
        setIsLoadingPosts(false);
      }
    };
    
    if (usersData?.users) {
      fetchPostsForUsers(usersData.users);
    }
  }, [usersData]);
  
  const isLoading = isLoadingUsers || isLoadingPosts;
  
  if (error) {
    return (
      <div className="container py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-semibold mb-6">Top Users</h1>
          <div className="glass-card p-8 rounded-xl">
            <h2 className="text-lg font-medium text-destructive mb-2">Error Loading Data</h2>
            <p className="text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Top Users</h1>
        <p className="text-muted-foreground mb-6">
          Users with the highest number of posts on the platform
        </p>
        
        {isLoading ? (
          <LoadingState 
            type="shimmer" 
            message="Analyzing user activity..." 
            className="py-12"
          />
        ) : topUsers.length > 0 ? (
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <UserCard 
                key={user.id} 
                user={user} 
                rank={index + 1}
                imageSize="medium"
                className="animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 rounded-xl text-center">
            <p className="text-muted-foreground">No user data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopUsers;
