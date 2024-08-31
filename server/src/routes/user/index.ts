import { Router } from "express";
import verifyToken from "../../middleware/auth/index.js";
import userController from "../../controllers/user/index.js";
import userProfileValidator from "../../validators/userProfile/index.js";
import upload from "../../middleware/multer_cloudinary/index.js";

const userRouter = Router();

// Get user profile
userRouter.get("/user/:id", verifyToken, userController.getUserProfile);

//Get suggested Users
userRouter.get("/users", verifyToken, userController.getSuggested);

// Update profile
userRouter.put(
  "/user/update",
  verifyToken,
  userProfileValidator,
  upload.single("profilepic"),
  userController.updateProfile
);

export default userRouter;
