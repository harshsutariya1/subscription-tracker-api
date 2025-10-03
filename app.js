import express from "express";
import { PORT } from "./config/env.js";

const app = express();

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Subscription Tracker API" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
