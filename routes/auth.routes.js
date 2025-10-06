import { Router } from "express";

const authRouter = Router();

// Auth routes
authRouter.post("/sign-in", (req, res) => {
  // Handle login
  res.json({ message: "Login endpoint" });
});

authRouter.post("/sign-up", (req, res) => {
  // Handle registration
  res.json({ message: "Register endpoint" });
});

authRouter.post("/sign-out", (req, res) => {
  // Handle logout
  res.json({ message: "Logout endpoint" });
});

export default authRouter;
