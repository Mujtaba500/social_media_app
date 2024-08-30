import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const createToken = (userId: string, username: string) => {
  const dataToSign = {
    userId,
    username,
  };

  const token = jwt.sign(dataToSign, process.env.JWT_SECRET!);

  return token;
};

const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

const comparePassword = (password: string, hashPass: string) => {
  return bcrypt.compare(password, hashPass);
};

export { createToken, hashPassword, comparePassword };
