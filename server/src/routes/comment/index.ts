import { Router } from "express";
import verifyToken from "../../middleware/auth/index.js";
import commentValidator from "../../validators/comment/index.js";

const commentRouter = Router();

commentRouter.post("/comment/:postId", verifyToken, commentValidator);

commentRouter.get("/comments/:postId", verifyToken);

commentRouter.put("/comment/:commentId", verifyToken, commentValidator);

commentRouter.delete("/comment/:commentId", verifyToken);

commentRouter.put("/comment/like/:commentId", verifyToken);

export default commentRouter;
