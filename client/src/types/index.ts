export interface UserCardProps {
  user: User | AuthUserType | null;
  auth?: boolean; // or the appropriate type (e.g., object, number, etc.)
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  profilepic?: string | null;
  coverphoto?: string | null;
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
