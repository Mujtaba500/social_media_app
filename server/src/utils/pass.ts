import bcrypt from "bcrypt";

const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

const comparePassword = (password: string, hashPass: string) => {
  return bcrypt.compare(password, hashPass);
};

export { hashPassword, comparePassword };
