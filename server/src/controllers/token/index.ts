import prisma from "../../db/config.js";
import { Response } from "express";
import { customRequest, HttpStatusCode, user } from "../../types/types.js";
import { createAccessToken } from "../../utils/createToken.js";
import jwt from "jsonwebtoken";

export const refreshAccessToken = async (req: customRequest, res: Response) => {
  try {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        mesage: "Unauthorized",
      });
    }

    const tokenExists = await prisma.token.findFirst({
      where: {
        token: refreshToken,
      },
    });

    if (!tokenExists) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        mesage: "Unauthorized",
      });
    }

    const user = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as user;

    const { token: newToken, accessTokenExpiry } = createAccessToken(
      user.userId!,
      user.username!
    );

    res.status(HttpStatusCode.OK).json({
      data: {
        token: newToken,
        accessTokenExpiry,
      },
    });
  } catch (err: any) {
    console.log("Error while refreshing token", err.message);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};
