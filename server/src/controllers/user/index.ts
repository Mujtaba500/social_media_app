import { customRequest, HttpStatusCode, files } from "../../types/types.js";
import { Response } from "express";
import prisma from "../../db/config.js";
import { comparePassword } from "../../utils/pass.js";
import { v2 as cloudinary } from "cloudinary";

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
      const id = req.user?.userId;
      const payload = req.body;

      const files = req.files as files;

      console.log(files);

      // Check if payload is empty;
      if (Object.keys(payload).length == 0 && !req.files) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Please upload file or enter data to update",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: "User doesnot exist",
        });
      }

      const updates: { [key: string]: string } = {};

      if (payload.newPassword) {
        const isMatch = await comparePassword(
          payload.currentPassword,
          user.password
        );
        if (!isMatch) {
          return res.status(HttpStatusCode.BAD_REQUEST).json({
            message: "Current password is incorrect",
          });
        }
        updates.password = payload.newPassword;
      }

      if (files.profilepic) {
        // Delete already exisiting profile pic
        if (user.profilepic) {
          const public_id = user.profilepic.split("/").pop()!.split(".")[0];
          await cloudinary.uploader.destroy(public_id);
        }

        const uploadedResponse = await cloudinary.uploader.upload(
          files.profilepic[0].path
        );
        updates.profilepic = uploadedResponse.secure_url;
      }

      if (files.coverphoto) {
        //Delete already existing coverphoto
        if (user.coverphoto) {
          const public_id = user.coverphoto.split("/").pop()!.split(".")[0];
          await cloudinary.uploader.destroy(public_id);
        }

        const uploadedResponse = await cloudinary.uploader.upload(
          files.coverphoto[0].path
        );
        updates.coverphoto = uploadedResponse.secure_url;
      }

      updates.username = payload.username || user.username;
      updates.fullName = payload.fullName || user.fullName;

      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          ...updates,
        },
      });

      const userWithoutPassword = {
        ...updatedUser,
        password: undefined,
      };

      res.status(HttpStatusCode.OK).json({
        message: "User updated successfully",
        data: userWithoutPassword,
      });
    } catch (err: any) {
      console.log("Error while updating user profile", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
};

export default userController;
