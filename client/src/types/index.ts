export interface UserCardProps {
  user?: string;
  auth?: boolean; // or the appropriate type (e.g., object, number, etc.)
}

export type LoginInputValues = {
  username: string;
  password: string;
};
