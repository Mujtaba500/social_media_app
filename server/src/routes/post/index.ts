import { Router } from "express";
import verifyToken from "../../middleware/auth/index.js";
import postValidator from "../../validators/post/index.js";

const postRouter = Router();

// Create posts
postRouter.post("/post", verifyToken, postValidator);

// Update post
postRouter.put("/post/:id", verifyToken, postValidator);

// Get current user posts
postRouter.get("/myposts", verifyToken);

// Get all posts
postRouter.get("/posts", verifyToken);

// Delete post
postRouter.delete("/post/:id", verifyToken);

export default postRouter;
