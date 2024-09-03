import { Response } from "express";
import { customRequest, HttpStatusCode } from "../../types/types.js";
import prisma from "../../db/config.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";

const postController = {
  createPost: async (req: customRequest, res: Response) => {
    try {
      const id = req.user?.userId;
      const content = req.body.content;

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "User does not exist",
        });
      }

      const userId = user.id;

      if (req.file) {
        const image = req.file;
        const uploadedResponse = await uploadToCloudinary(
          image.path,
          "social_media_app"
        );

        const newPost = await prisma.post.create({
          data: {
            authorId: userId,
            content,
            image: uploadedResponse.secure_url,
          },
        });

        return res.status(HttpStatusCode.OK).json({
          message: "Post created cuessfully",
          data: newPost,
        });
      }

      const newPost = await prisma.post.create({
        data: {
          authorId: userId,
          content,
        },
      });

      res.status(HttpStatusCode.OK).json({
        message: "Post created cuessfully",
        data: newPost,
      });
    } catch (err: any) {
      console.log("Error while creating post", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
};

export default postController;
