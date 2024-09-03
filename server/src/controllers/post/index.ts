import { Response } from "express";
import { customRequest, HttpStatusCode } from "../../types/types.js";
import prisma from "../../db/config.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";
import fs from "fs";

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
        fs.unlinkSync(image.path);

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

      // If only content and no image
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
  editPost: async (req: customRequest, res: Response) => {
    try {
      let userId = req.user?.userId;
      const content = req.body.content;
      const postId = req.params.id;

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "UnAuthorized",
        });
      }
      userId = user.id;

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
          authorId: userId,
        },
      });

      if (!post) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: "Post not found",
        });
      }

      // If both image and content is getting changed
      if (req.file && content) {
        const image = req.file;

        // Delete already exisiting post image
        if (post.image) {
          const public_id = post.image.split("/").pop()!.split(".")[0];
          await deleteFromCloudinary(public_id);
        }

        const uploadedResponse = await uploadToCloudinary(
          image.path,
          "social_media_app"
        );
        fs.unlinkSync(image.path);

        const updatedPost = await prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            authorId: userId,
            content,
            image: uploadedResponse.secure_url,
          },
        });

        return res.status(HttpStatusCode.OK).json({
          message: "Post updated cuessfully",
          data: updatedPost,
        });
      }

      // If only image getting changed
      if (req.file && !content) {
        const image = req.file;

        // Delete already exisiting post image
        if (post.image) {
          const public_id = post.image.split("/").pop()!.split(".")[0];
          await deleteFromCloudinary(public_id);
        }

        const uploadedResponse = await uploadToCloudinary(
          image.path,
          "social_media_app"
        );
        fs.unlinkSync(image.path);

        const updatedPost = await prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            authorId: userId,
            image: uploadedResponse.secure_url,
          },
        });

        return res.status(HttpStatusCode.OK).json({
          message: "Post updated cuessfully",
          data: updatedPost,
        });
      }

      //If only content getting changed
      const updatedPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          authorId: userId,
          content,
        },
      });

      res.status(HttpStatusCode.OK).json({
        message: "Post updated cuessfully",
        data: updatedPost,
      });
    } catch (err: any) {
      console.log("Error while editing post", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
  getMyPosts: async (req: customRequest, res: Response) => {
    try {
      const id = req.user?.userId;

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          posts: true,
        },
      });

      if (!user) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "Unauthorized",
        });
      }

      const posts = user.posts;
      res.status(HttpStatusCode.OK).json({
        data: posts,
      });
    } catch (err: any) {
      console.log("Error while fetching current user posts", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
  getAllPosts: async (req: customRequest, res: Response) => {
    try {
      const posts = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc", // Use 'desc' for descending order
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profilepic: true,
            },
          },
        },
      });

      res.status(HttpStatusCode.OK).json({
        data: posts,
      });
    } catch (err: any) {
      console.log("Error while fetching all posts", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
};

export default postController;
