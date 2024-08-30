import authRouter from "./auth/index.js";
import tokenRouter from "./token/index.js";
import userRouter from "./user/index.js";

const allRoutes = [authRouter, userRouter, tokenRouter];

export default allRoutes;
