import { Response } from "express";
import { customRequest, HttpStatusCode } from "../../types/types.js";
import prisma from "../../db/config.js";
import sendNotificationAsync from "../../utils/notification.js";

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
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              username: true,
              profilepic: true,
            },
          },
        },
      });

      // Send notification
      try {
        const postAuthorId = post.authorId;

        // Donot send notification if user comment on his own post
        if (postAuthorId !== userId) {
          sendNotificationAsync(userId!, postAuthorId, "COMMENT");
        }
      } catch (err: any) {
        throw err;
      }

      res.status(HttpStatusCode.CREATED).json({
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
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  fullName: true,
                  username: true,
                  profilepic: true,
                },
              },
            },
          },
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
  editComment: async (req: customRequest, res: Response) => {
    try {
      const id = req.params.commentId;
      const userId = req.user?.userId;
      const body = req.body.body;

      const comment = await prisma.comment.findUnique({
        where: {
          id,
        },
      });

      if (!comment) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: "Comment not found",
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

      const editedComment = await prisma.comment.update({
        where: {
          id,
        },
        data: {
          body: body,
        },
      });

      res.status(HttpStatusCode.OK).json({
        message: "Comment edited",
        data: editedComment,
      });
    } catch (err: any) {
      console.log("Error while editing comment", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
  deleteComment: async (req: customRequest, res: Response) => {
    try {
      const id = req.params.commentId;
      const userId = req.user?.userId;

      const comment = await prisma.comment.findUnique({
        where: {
          id,
        },
      });

      if (!comment) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: "Comment not found",
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

      await prisma.comment.delete({
        where: {
          id,
        },
      });

      res.status(HttpStatusCode.OK).json({
        message: "Comment deleted successfully",
      });
    } catch (err: any) {
      console.log("Error while deleting comment", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
  likeUnlikeComment: async (req: customRequest, res: Response) => {
    try {
      const id = req.params.commentId;
      const userId = req.user?.userId;

      const comment = await prisma.comment.findUnique({
        where: {
          id,
        },
      });

      if (!comment) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: "Comment not found",
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

      // If comment is already liked, we will unlike
      if (comment.likes.includes(user.id)) {
        const updatedLikes = comment.likes.filter(
          (id: string) => id !== user.id
        );

        await prisma.comment.update({
          where: {
            id,
          },
          data: {
            likes: updatedLikes,
          },
        });

        return res.status(HttpStatusCode.OK).json({
          message: "Comment unliked",
        });
      }

      await prisma.comment.update({
        where: {
          id,
        },
        data: {
          likes: {
            push: user.id,
          },
        },
      });

      // Send notificaiotn

      const authorId = comment.authorId;
      sendNotificationAsync(userId!, authorId, "COMMENT_LIKE");

      return res.status(HttpStatusCode.OK).json({
        message: "Comment liked",
      });
    } catch (err: any) {
      console.log("Error while likeing/unliking comment", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
};

export default commentController;
