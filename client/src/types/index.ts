export interface UserCardProps {
  user: User | AuthUserType | null;
  auth?: boolean; // or the appropriate type (e.g., object, number, etc.)
}

export interface User {
  id: string;
  username?: string;
  fullName: string;
  profilepic?: string | null;
  coverphoto?: string | null;
  posts: Post[];
  followers: string[];
  following: string[];
  createdAt: Date;
}

export type LoginInputValues = {
  username: string;
  password: string;
};

export type SignupInputValues = {
  username: string;
  fullName: string;
  password: string;
};

export type AuthUserType = {
  id: string;
  username: string;
  fullName: string;
  profilepic: string | null;
};

export type PostProps = {
  post: Post;
};

export type Post = {
  id: string;
  content: string;
  authorId: string;
  author: User;
  image?: string;
  likes: string[];
  comments: Comment[];
};

export type EditPostProps = {
  postId: string;
};

export type Comment = {
  id: string;
  body: string;
  likes: string[];
  postId: string;
  authorId: string;
  author: User;
};

export type CommentProps = {
  comment: Comment;
  postId: string;
};

export type CommentsProp = {
  comments: Comment[];
  postId: string;
};

export type AddCommentsProps = {
  postId: string;
};

export type EditCommentProps = {
  postId: string;
  commentId: string;
};
