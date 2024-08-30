import { Router } from "express";
import verifyToken from "../../middleware/auth/index.js";
// import { refreshAccessToken } from "../../controllers/token/index.js";

const tokenRouter = Router();

tokenRouter.post("/refresh_token", verifyToken);

export default tokenRouter;
