export interface UserCardProps {
  user?: string;
  auth?: boolean; // or the appropriate type (e.g., object, number, etc.)
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
