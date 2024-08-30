import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { customRequest, user } from "../../types/types.js";
import { HttpStatusCode } from "../../types/types.js";

const verifyToken = (req: customRequest, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: "UnAuthorized",
    });
  }

  token = token.replace("Bearer ", "");

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as user;

  req.user = decoded;
  next();
};

export default verifyToken;
