import { Router } from "express";
import { getAllUsers, getUser } from "../controllers/user controllers/user.controller.js";
import authorize from "../middleware/auth.middleware.js";

const userRouter = Router();

// User routes
userRouter.get("/", authorize, getAllUsers);

userRouter.get("/:id", authorize, getUser);

userRouter.post("/", (req, res) => {
  // Create new user
  res.json({ message: "Create User endpoint" });
});

userRouter.put("/:id", (req, res) => {
  // Update user details
  res.json({ message: "Update User endpoint" });
});

userRouter.delete("/:id", (req, res) => {
  // Delete user
  res.json({ message: "Delete User endpoint" });
});

export default userRouter;
