import jwt from "jsonwebtoken";
import prisma from "../db/config.js";

//Create access token and refresh token with different secrets
// STORE REFRESH token in db
// send back access token with its expiry in response (on login)
// set refresh token as cookie (on login)
// verify access token on every request
// Set access token in auth state on client(memory)
// refresh token by sending request before expiry of access token and get a new access token
//  also refresh token when page is reloaded or browser is closed
// clear access token and refresh token on logout

const createAccessToken = (userId: string, username: string) => {
  const dataToSign = {
    userId,
    username,
  };

  const accessTokenExpiry = "1m";

  const token = jwt.sign(dataToSign, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: `${accessTokenExpiry}`,
  });

  return { token, accessTokenExpiry };
};

const createRefreshToken = async (
  userId: string,
  username: string
): Promise<
  { refreshToken: string; refreshTokenExpiry: number } | { error: string }
> => {
  try {
    const dataToSign = {
      userId,
      username,
    };

    let refreshToken = jwt.sign(dataToSign, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: "5m", // expires in 5 minutes
    });

    const expirationTime = new Date();

    expirationTime.setMinutes(expirationTime.getMinutes() + 5);
    const refreshTokenExpiry = expirationTime.getMinutes();

    const token = await prisma.token.create({
      data: {
        token: refreshToken,
        expiresAt: expirationTime,
      },
    });

    refreshToken = token.token;
    return { refreshToken, refreshTokenExpiry };
  } catch (err: any) {
    return { error: err.message };
  }
};

export { createAccessToken, createRefreshToken };
