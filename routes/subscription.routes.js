import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { createSubscription, getUserSubscriptions } from "../controllers/subscription controllers/subscription.controller.js";

const subscriptionRouter = Router();

// Standard subscription routes
subscriptionRouter.get("/", authorize, (req, res) => {
  // Fetch all subscriptions
  res.json({ message: "Subscriptions List endpoint" });
});

subscriptionRouter.get("/:id", authorize, (req, res) => {
  // Fetch particular subscription
  res.json({ message: "Subscription Details endpoint" });
});

// Create new subscription
subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", authorize, (req, res) => {
  // Update subscription details
  res.json({ message: "Update Subscription endpoint" });
});

subscriptionRouter.delete("/:id", authorize, (req, res) => {
  // Delete subscription
  res.json({ message: "Delete Subscription endpoint" });
});

// Fetch subscriptions for a particular user
subscriptionRouter.get("/user/:userId", authorize, getUserSubscriptions);

subscriptionRouter.put("/:id/cancel", authorize, (req, res) => {
  // Cancel a subscription
  res.json({ message: "Cancel Subscription endpoint" });
});

subscriptionRouter.put("/upcoming-renewals", authorize, (req, res) => {
  // Get upcoming renewals
  res.json({ message: "Get Upcoming Renewals endpoint" });
});

subscriptionRouter.get("/due/:days", authorize, (req, res) => {
  // Fetch subscriptions due in next 'n' days
  res.json({ message: "Due Subscriptions endpoint" });
});

export default subscriptionRouter;
