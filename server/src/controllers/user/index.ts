import { customRequest, HttpStatusCode } from "../../types/types.js";
import { Response } from "express";
import prisma from "../../db/config.js";

const userController = {
  getUserProfile: async (req: customRequest, res: Response) => {
    try {
      const userId = req.params.id;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          posts: true,
        },
      });

      if (!user) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: "User not found",
        });
      }

      const userWithoutPassword = {
        ...user,
        password: undefined,
      };

      res.status(HttpStatusCode.OK).json({
        data: userWithoutPassword,
      });
    } catch (err: any) {
      console.log("Error while fetching user profile", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
  getSuggested: async (req: customRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const suggestedUsers = await prisma.user.findMany({
        where: {
          id: {
            not: userId,
          },
        },
        select: {
          id: true,
          username: true,
          fullName: true,
          profilepic: true,
        },
      });

      res.status(HttpStatusCode.OK).json({
        data: suggestedUsers,
      });
    } catch (err: any) {
      console.log("Error while fetching suggested users", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
  updateProfile: async (req: customRequest, res: Response) => {
    try {
    } catch (err: any) {
      console.log("Error while updating user profile", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
};

export default userController;
