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
  upload.fields([
    { name: "profilepic", maxCount: 1 },
    { name: "coverphoto", maxCount: 1 },
  ]),
  userController.updateProfile
);

//DELETE cover photo/profile image
userRouter.delete("/user/:img", verifyToken, userController.removeImage);

//Follow/unfollow user
userRouter.put(
  "/user/follow/:id",
  verifyToken,
  userController.followUnfollowUser
);

export default userRouter;
