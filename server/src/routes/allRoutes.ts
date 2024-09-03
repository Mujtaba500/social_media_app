import authRouter from "./auth/index.js";
import tokenRouter from "./token/index.js";
import userRouter from "./user/index.js";
import postRouter from "./post/index.js";

const allRoutes = [authRouter, userRouter, tokenRouter, postRouter];

export default allRoutes;
