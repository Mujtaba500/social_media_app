import { Router } from "express";
import verifyToken from "../../middleware/auth/index.js";
import postValidator from "../../validators/post/index.js";
import upload from "../../middleware/multer_cloudinary/index.js";
import postController from "../../controllers/post/index.js";

const postRouter = Router();

// Create posts
postRouter.post(
  "/post",
  verifyToken,
  upload.single("postImg"),
  postValidator,
  postController.createPost
);

// Update post
postRouter.put("/post/:id", verifyToken, postValidator);

// Get current user posts
postRouter.get("/myposts", verifyToken);

// Get all posts
postRouter.get("/posts", verifyToken);

// Delete post
postRouter.delete("/post/:id", verifyToken);

export default postRouter;
