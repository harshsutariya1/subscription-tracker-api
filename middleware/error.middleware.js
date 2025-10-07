/* eslint-disable no-unused-vars */
import { NODE_ENV } from "../config/env.js";

const errorHandler = (err, req, res, next) => {
  try {
    // Default error properties
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errorDetails = {};

    // Handle specific Mongoose errors
    if (err.name === "ValidationError") {
      statusCode = 400;
      message = "Validation Error";
      errorDetails = Object.values(err.errors).map((val) => val.message);
    } else if (err.name === "CastError") {
      statusCode = 400;
      message = "Invalid ID format";
    } else if (err.code === 11000) {
      statusCode = 400;
      // Extract field name from duplicate key error
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      message = `Duplicate value for ${field}. Please use a different value.`;
    } else if (err.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token";
    } else if (err.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token expired";
    }
    // Handle other common errors
    else if (err.name === "SyntaxError") {
      statusCode = 400;
      message = "Bad request: Invalid JSON";
    } else if (err.name === "ReferenceError" || err.name === "TypeError") {
      statusCode = 500;
      message = "Internal server error";
    } else if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
      statusCode = 503;
      message = "Service unavailable: Database connection failed";
    } else if (err.statusCode === 429) {
      statusCode = 429;
      message = "Too many requests";
    } else if (err.name === "UnauthorizedError") {
      statusCode = 401;
      message = "Unauthorized";
    }
    // Handle MongoDB transaction errors
    else if (
      err.name === "MongoServerError" &&
      err.hasErrorLabel?.("TransientTransactionError")
    ) {
      statusCode = 503;
      message = "Transaction failed. Please try again.";
    } else if (
      err.name === "MongoServerError" &&
      err.hasErrorLabel?.("UnknownTransactionCommitResult")
    ) {
      statusCode = 503;
      message = "Transaction commit status unknown. Please verify and retry.";
    }
    // Catch-all for unknown errors
    else {
      statusCode = err.statusCode || 500;
      message = err.message || "Something went wrong";
    }

    // Log error in development
    if (NODE_ENV === "development") {
      console.error(err);
      errorDetails = {
        stack: err.stack,
        url: req.url,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
      };
    } else {
      // In production, log minimal info without sensitive data
      console.error(
        `Error ${statusCode}: ${message} - ${req.method} ${req.url}`
      );
    }

    // Ensure response is sent only once
    if (!res.headersSent) {
      res.status(statusCode).json({
        success: false,
        message,
        ...(NODE_ENV === "development" && { error: errorDetails }),
      });
    }
  } catch (handlerError) {
    // Fallback if error handler itself fails
    console.error("Error in error handler:", handlerError);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

export default errorHandler;
