
export interface User {
  id: string;
  name: string;
  postCount?: number;
  avatarUrl?: string;
}

export interface Post {
  id: number;
  userid: number | string;
  content: string;
  username?: string;
  commentCount?: number;
  imageUrl?: string;
  userAvatarUrl?: string;
}

export interface Comment {
  id: number;
  postid: number;
  content: string;
}

export interface ApiResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UsersResponse {
  users: Record<string, string>;
}

export interface PostsResponse {
  posts: Post[];
}

export interface CommentsResponse {
  comments: Comment[];
}
