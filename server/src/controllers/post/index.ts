import { Response } from "express";
import { customRequest, HttpStatusCode } from "../../types/types.js";
import prisma from "../../db/config.js";

const postController = {
  createPost: async (req: customRequest, res: Response) => {
    try {
    } catch (err: any) {
      console.log("Error while creating post", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
};

export default postController;
