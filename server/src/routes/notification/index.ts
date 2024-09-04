import { Router } from "express";
import verifyToken from "../../middleware/auth/index.js";
import notificationController from "../../controllers/notification/index.js";

const notificationRouter = Router();

// Get all notifications
notificationRouter.get(
  "/notifications",
  verifyToken,
  notificationController.getAll
);

// Clear all notifications
notificationRouter.delete(
  "/notifications",
  verifyToken,
  notificationController.deleteAll
);

export default notificationRouter;
