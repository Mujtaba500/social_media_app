import {
  createToken,
  hashPassword,
  comparePassword,
} from "../../utils/auth.js";
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
  login: async (req: customRequest, res: Response) => {
    try {
      const { username, password } = req.body;
      const userCheck = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!userCheck) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Invalid credentials",
        });
      }

      const passVerify = await comparePassword(password, userCheck.password);

      if (!passVerify) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Invalid credentials",
        });
      }

      const token = createToken(userCheck.id, userCheck.username);

      const user = {
        id: userCheck.id,
        username: userCheck.username,
        fullName: userCheck.fullName,
      };

      res
        .status(200)
        .cookie("jwt", token, {
          maxAge: 15 * 24 * 60 * 60 * 1000, // MS
          httpOnly: true, // prevent xss attacks
          sameSite: "strict",
          // secure: process.env.STAGE !== "development", // HTTPS
        })
        .json({
          message: "User logged in successfully",
          data: user,
        });
    } catch (err: any) {
      console.log("Error while logging in user", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
  logout: async (req: customRequest, res: Response) => {
    try {
      res.clearCookie("jwt").status(HttpStatusCode.OK).json({
        message: "Logged out successfully",
      });
    } catch (err: any) {
      console.log("Error in logout Controller", err.message);

      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
};

export default authController;
