import { Router } from "express";
import verifyToken from "../../middleware/auth/index.js";

const commentRouter = Router();

commentRouter.post("/comment/:postId", verifyToken);

commentRouter.get("/comments/:postId", verifyToken);

commentRouter.put("/comment/:commentId", verifyToken);

commentRouter.delete("/comment/:commentId", verifyToken);

commentRouter.put("/comment/like/:commentId", verifyToken);

export default commentRouter;
