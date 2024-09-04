import { Router } from "express";
import verifyToken from "../../middleware/auth/index.js";
import commentValidator from "../../validators/comment/index.js";
import commentController from "../../controllers/comment/index.js";

const commentRouter = Router();

// Create comment
commentRouter.post(
  "/comment/:postId",
  verifyToken,
  commentValidator,
  commentController.createComment
);

// Get comments for a single post
commentRouter.get("/comments/:postId", verifyToken);

// Edit comment
commentRouter.put("/comment/:commentId", verifyToken, commentValidator);

// delete comment
commentRouter.delete("/comment/:commentId", verifyToken);

// Like/ unlike comment
commentRouter.put("/comment/like/:commentId", verifyToken);

export default commentRouter;
