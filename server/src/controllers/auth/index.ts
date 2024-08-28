import { createToken, hashPassword } from "../../utils/auth.js";
import { Response } from "express";
import prisma from "../../db/config.js";
import { customRequest, HttpStatusCode } from "../../types/types.js";

const authController = {
  createUser: async (req: customRequest, res: Response) => {
    try {
      const { username, fullName, password } = req.body;

      const userExists = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (userExists) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "User with this username already exists",
        });
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await prisma.user.create({
        data: {
          username,
          fullName,
          password: hashedPassword,
        },
      });

      const token = createToken(newUser.id, newUser.username);

      const user = {
        id: newUser.id,
        username: newUser.username,
        fullName: newUser.fullName,
      };

      res
        .status(HttpStatusCode.OK)
        .cookie("jwt", token, {
          maxAge: 15 * 24 * 60 * 60 * 1000, // MS
          httpOnly: true, // prevent xss attacks
          // sameSite: "strict",
          // secure: process.env.STAGE !== "development",    HTTPS
        })
        .json({
          message: "User signed up successfully",
          data: user,
        });
    } catch (err: any) {
      console.log("Error while registering user", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
};

export default authController;
