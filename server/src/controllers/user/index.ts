import { customRequest, HttpStatusCode, files } from "../../types/types.js";
import { Response } from "express";
import prisma from "../../db/config.js";
import { comparePassword } from "../../utils/pass.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";
import fs from "fs";
import sendNotificationAsync from "../../utils/notification.js";

const userController = {
  getUserProfile: async (req: customRequest, res: Response) => {
    try {
      const username = req.params.username;
      const limit = 5;
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
        include: {
          posts: {
            orderBy: {
              createdAt: "desc", // Use 'desc' for descending order
            },
            take: limit,
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
          },
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

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      const suggestedUsers = await prisma.user.findMany({
        where: {
          id: {
            not: userId,
            notIn: user?.following,
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
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "Unauthorized",
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
          await deleteFromCloudinary(public_id);
        }

        const uploadedResponse = await uploadToCloudinary(
          files.profilepic[0].path,
          "social_media_app"
        );
        updates.profilepic = uploadedResponse.secure_url;
        //remove file from disk storage
        fs.unlinkSync(files.profilepic[0].path);
      }

      if (files.coverphoto) {
        //Delete already existing coverphoto
        if (user.coverphoto) {
          const public_id = user.coverphoto.split("/").pop()!.split(".")[0];
          await deleteFromCloudinary(public_id);
        }

        const uploadedResponse = await uploadToCloudinary(
          files.coverphoto[0].path,
          "social_media_app"
        );
        updates.coverphoto = uploadedResponse.secure_url;
        // Remove file from disk storage
        fs.unlinkSync(files.coverphoto[0].path);
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
        include: {
          posts: {
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
          },
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
  removeImage: async (req: customRequest, res: Response) => {
    try {
      const id = req.user?.userId;
      const img = req.params.img;

      console.log(img);

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

      if (img === "coverphoto") {
        if (user.coverphoto) {
          const public_id = user.coverphoto.split("/").pop()!.split(".")[0];
          await deleteFromCloudinary(public_id);

          await prisma.user.update({
            where: {
              id,
            },
            data: {
              coverphoto: null,
            },
          });
        }
      } else if (img === "profilepic") {
        if (user.profilepic) {
          const public_id = user.profilepic.split("/").pop()!.split(".")[0];
          await deleteFromCloudinary(public_id);

          await prisma.user.update({
            where: {
              id,
            },
            data: {
              profilepic: null,
            },
          });
        }
      }

      res.status(HttpStatusCode.OK).json({
        message: `${img} successfully deleted`,
      });
    } catch (err: any) {
      console.log("Error while deleting images", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
  followUnfollowUser: async (req: customRequest, res: Response) => {
    try {
      await prisma.$transaction(async (prisma: any) => {
        const authId = req.user?.userId;
        const userId = req.params.id;

        if (authId === userId) {
          return res.status(HttpStatusCode.BAD_REQUEST).json({
            message: "You cannot follow/unfollow yourself",
          });
        }

        const userToFollow = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        const currentUser = await prisma.user.findUnique({
          where: {
            id: authId,
          },
        });

        if (!userToFollow || !currentUser) {
          return res.status(HttpStatusCode.NOT_FOUND).json({
            message: "User not found",
          });
        }

        // Unfollow if already following
        if (userToFollow.followers.includes(authId!)) {
          const updatedFolllowers = userToFollow.followers.filter(
            (id: string) => id !== authId
          );
          const updatedFollowing = currentUser.following.filter(
            (id: string) => id !== userId
          );

          const user = await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              followers: updatedFolllowers,
            },
            include: {
              posts: {
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
              },
            },
          });

          await prisma.user.update({
            where: {
              id: authId,
            },
            data: {
              following: updatedFollowing,
            },
          });

          return res.status(HttpStatusCode.OK).json({
            message: "User unfollowed successfully",
            user,
          });
        }

        const user = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            followers: {
              push: authId,
            },
          },
          include: {
            posts: {
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
            },
          },
        });

        await prisma.user.update({
          where: {
            id: authId,
          },
          data: {
            following: {
              push: userId,
            },
          },
        });

        // Send notification
        sendNotificationAsync(authId!, userId, "FOLLOW");

        return res.status(HttpStatusCode.OK).json({
          message: "User followed successfully",
          user,
        });
      });
    } catch (err: any) {
      console.log("Error while following/unfollowing user", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
};

export default userController;
