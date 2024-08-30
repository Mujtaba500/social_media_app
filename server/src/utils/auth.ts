import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

  const expiryTime = "1m";

  const token = jwt.sign(dataToSign, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: `${expiryTime}`,
  });

  return { token, expiryTime };
};

const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

const comparePassword = (password: string, hashPass: string) => {
  return bcrypt.compare(password, hashPass);
};

export { createAccessToken, hashPassword, comparePassword };
