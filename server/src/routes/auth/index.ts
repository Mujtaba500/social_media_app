import { Router } from "express";
import verifyToken from "../../middleware/auth/index.js";

const authRouter = Router();

authRouter.post("/auth/signup", () => {});

authRouter.post("/auth/login", () => {});

authRouter.post("/auth/logout", () => {});

authRouter.get("/auth/user", verifyToken, () => {});

export default authRouter;
