import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { customRequest, user } from "../../types/types.js";
import { HttpStatusCode } from "../../types/types.js";
import prisma from "../../db/config.js";

const verifyToken = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers.authorization;
  console.log("Access token", token);

  if (!token) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: "UnAuthorized",
    });
  }
  try {
    token = token.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as user;

    req.user = decoded;
    next();
  } catch (err: any) {
    console.log("Error while verifying token", err.message);
    res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "unAuthorized" });
  }
};

export default verifyToken;
