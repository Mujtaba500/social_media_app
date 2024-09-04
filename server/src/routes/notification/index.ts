import { Router } from "express";
import verifyToken from "../../middleware/auth/index.js";

const notificationRouter = Router();

// Get all notifications
notificationRouter.get("/notifications", verifyToken);

// Clear all notifications
notificationRouter.delete("/notifications", verifyToken);

export default notificationRouter;
