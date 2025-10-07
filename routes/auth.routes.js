import { Router } from "express";
import { signIn } from "../controllers/auth controllers/signin.controller.js";
import { signUp } from "../controllers/auth controllers/signup.controller.js";
import { signOut } from "../controllers/auth controllers/signout.controller.js";

const authRouter = Router();

// Auth routes  /api/v1/auth/...
authRouter.post("/sign-in", signIn);

authRouter.post("/sign-up", signUp);

authRouter.post("/sign-out", signOut);

export default authRouter;
