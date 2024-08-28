import { Router } from "express";
import verifyToken from "../../middleware/auth/index.js";
import authValidator from "../../validators/auth/index.js";
import authController from "../../controllers/auth/index.js";

const authRouter = Router();

authRouter.post(
  "/auth/signup",
  authValidator.createUser,
  authController.createUser
);

authRouter.post("/auth/login", authValidator.login, () => {});

authRouter.post("/auth/logout", () => {});

authRouter.get("/auth/user", verifyToken, () => {});

export default authRouter;
