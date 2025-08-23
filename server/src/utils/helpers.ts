import { user } from "../types/types";
import jwt from "jsonwebtoken";

export const getTokenFromParams = (req: any) => {
  const params = new URLSearchParams(req.url?.split("?")[1]);
  const token = params.get("token");
  return token;
};

export const removeElementFromArray = (id: string, arr: any) => {
  return arr;
};

export const extractUserFromToken = (token: string | null) => {
  if (!token) {
    return;
  }
  try {
    token = token.replace("Bearer ", "");

    const decodedUser = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as user;

    return decodedUser;
  } catch (error) {
    console.error(error);
  }
};
