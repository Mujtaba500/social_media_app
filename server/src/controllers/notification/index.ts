import { Response } from "express";
import { customRequest, HttpStatusCode } from "../../types/types.js";
import prisma from "../../db/config.js";

const notificationController = {
  getAll: async (req: customRequest, res: Response) => {
    try {
      const id = req.user?.userId;

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          notifications: {
            orderBy: {
              createdAt: "desc",
            },
            select: {
              sentFrom: {
                select: {
                  id: true,
                  username: true,
                  profilepic: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "User does not exist",
        });
      }

      res.status(HttpStatusCode.OK).json({
        data: user.notifications,
      });
    } catch (err: any) {
      console.log("Error while fetching notifications", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
  deleteAll: async (req: customRequest, res: Response) => {
    try {
      const id = req.user?.userId;

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          notifications: true,
        },
      });

      if (!user) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "User does not exist",
        });
      }

      await prisma.notification.deleteMany({
        where: {
          to: id,
        },
      });

      res.status(HttpStatusCode.OK).json({
        message: "Notifications deleted successfully",
      });
    } catch (err: any) {
      console.log("Error while deleting notifications", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
};

export default notificationController;
