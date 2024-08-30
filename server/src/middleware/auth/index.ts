import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { customRequest, user } from "../../types/types.js";
import { HttpStatusCode } from "../../types/types.js";

const verifyToken = (req: customRequest, res: Response, next: NextFunction) => {
  let token = req.cookies.jwt;

  if (!token) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: "UnAuthorized",
    });
  }

  token = token.replace("Bearer ", "");

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as user;

  req.user = decoded;
  next();
};

export default verifyToken;