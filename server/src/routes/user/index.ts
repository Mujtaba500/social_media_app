import { Router } from "express";
import verifyToken from "../../middleware/auth/index.js";
import userController from "../../controllers/user/index.js";

const userRouter = Router();

// Get user profile
userRouter.get("/user/:id", verifyToken, userController.getUserProfile);

//Get suggested Users
userRouter.get("/users", verifyToken, userController.getSuggested);

// Update profile
userRouter.put("/user", verifyToken, userController.updateProfile);

export default userRouter;
