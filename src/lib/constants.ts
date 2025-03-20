
export const API_BASE_URL = "http://20.244.56.144/test";

export const API_ENDPOINTS = {
  USERS: `${API_BASE_URL}/users`,
  USER_POSTS: (userId: string | number) => `${API_BASE_URL}/users/${userId}/posts`,
  POST_COMMENTS: (postId: number) => `${API_BASE_URL}/posts/${postId}/comments`,
};

// Placeholder images for users and posts
export const AVATAR_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces&q=80",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop&crop=faces&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces&q=80",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=faces&q=80",
];

export const POST_IMAGE_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1666091863721-54331a3d4f2e?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1591280063444-df3ef5da517a?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1575023782549-62ca0d244b39?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1497493292307-31c376b6e479?w=600&h=400&fit=crop&q=80",
];

// Function to get a consistent random image based on an ID
export const getRandomAvatar = (id: string | number): string => {
  const seed = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_PLACEHOLDERS[seed % AVATAR_PLACEHOLDERS.length];
};

export const getRandomPostImage = (id: number): string => {
  return POST_IMAGE_PLACEHOLDERS[id % POST_IMAGE_PLACEHOLDERS.length];
};
