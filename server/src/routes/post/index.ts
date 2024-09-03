import { Router } from "express";
import verifyToken from "../../middleware/auth/index.js";

const postRouter = Router();

// Create posts
postRouter.post("/post", verifyToken);

// Update post
postRouter.put("/post/:id", verifyToken);

// Get current user posts
postRouter.get("/myposts", verifyToken);

// Get all posts
postRouter.get("/posts", verifyToken);

// Delete post
postRouter.delete("/post/:id", verifyToken);

export default postRouter;
