import { Response } from "express";
import { customRequest, HttpStatusCode } from "../../types/types.js";
import prisma from "../../db/config.js";

const commentController = {
  createComment: async (req: customRequest, res: Response) => {
    try {
      const postId = req.params.postId;
      const userId = req.user?.userId;
      const body = req.body.body;

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: "Post not found",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "Unauthorized",
        });
      }

      const comment = await prisma.comment.create({
        data: {
          body,
          postId: postId,
          authorId: userId!,
        },
      });

      res.status(HttpStatusCode.OK).json({
        message: "Commented sucessfully",
        data: comment,
      });
    } catch (err: any) {
      console.log("Error while creating comment", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
  getComments: async (req: customRequest, res: Response) => {
    try {
      const postId = req.params.postId;

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          comments: true,
        },
      });

      if (!post) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: "Post not found",
        });
      }

      res.status(HttpStatusCode.OK).json({
        data: post.comments,
      });
    } catch (err: any) {
      console.log("Error while fetching comments", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
};

export default commentController;
