import { customRequest, HttpStatusCode } from "../../types/types.js";
import { Response } from "express";

const userController = {
  getUserProfile: (req: customRequest, res: Response) => {
    try {
      const userId = req.params.id;
    } catch (err: any) {
      console.log("Error while fetching user profile", err.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  },
  getSuggested: async (req: customRequest, res: Response) => {
    try {
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
