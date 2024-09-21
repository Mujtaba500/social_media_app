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
      const post = await prisma.post.create({
        data: {
          authorId: userId,
          content,
        },
      });

      const newPost = await prisma.post.findUnique({
        where: {
          id: post.id,
        },
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              profilepic: true,
            },
          },
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

      res.status(HttpStatusCode.OK).json({
        message: "Post created successfully",
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

      if (post?.authorId !== userId) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "Unauthorized",
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
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                profilepic: true,
              },
            },
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

        return res.status(HttpStatusCode.OK).json({
          message: "Post updated successfully",
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
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                profilepic: true,
              },
            },
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
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              profilepic: true,
            },
          },
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

      return res.status(HttpStatusCode.OK).json({
        message: "Post updated successfully",
        data: updatedPost,
      });
    } catch (err: any) {
      console.log("Error while editing post", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
  likeUnlikePost: async (req: customRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
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

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: "Post does not exist",
        });
      }

      if (post.likes.includes(userId!)) {
        const updatedLikes = post.likes.filter((id: string) => id !== userId);

        const updatedPost = await prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            likes: updatedLikes,
          },
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                profilepic: true,
              },
            },
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

        return res.status(HttpStatusCode.OK).json({
          message: "Post unliked successfully",
          data: updatedPost,
        });
      }

      const likedPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: {
            push: userId,
          },
        },
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              profilepic: true,
            },
          },
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

      // Send notification
      try {
        const authorId = post.authorId;

        if (authorId !== userId) {
          await prisma.notification.create({
            data: {
              type: "POST_LIKE",
              from: userId!,
              to: authorId,
            },
          });
        }
      } catch (err: any) {
        console.log("Error while creating notification", err.message);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          message: "Internal server error",
        });
      }

      res.status(HttpStatusCode.OK).json({
        message: "Post liked successfully",
        data: likedPost,
      });
    } catch (err: any) {
      console.log("Error while liking/unliking post", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
  getUserPosts: async (req: customRequest, res: Response) => {
    try {
      const userid = req.params.id;

      const user = await prisma.user.findUnique({
        where: {
          id: userid,
        },
      });

      if (!user) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: "User not found",
        });
      }

      const posts = await prisma.post.findMany({
        where: {
          authorId: userid,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

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
              fullName: true,
              profilepic: true,
            },
          },
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
  deletePost: async (req: customRequest, res: Response) => {
    try {
      const id = req.user?.userId;
      const postId = req.params.id;

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

      if (post?.authorId !== id) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "Unauthorized",
        });
      }

      if (post.image) {
        const public_id = post.image.split("/").pop()!.split(".")[0];
        await deleteFromCloudinary(public_id);
      }

      await prisma.post.delete({
        where: {
          id: postId,
        },
      });

      res.status(HttpStatusCode.OK).json({
        message: "Post deleted successfully",
      });
    } catch (err: any) {
      console.log("Error while deleting post", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
};

export default postController;
