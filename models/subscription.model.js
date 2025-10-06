import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minlength: [2, "Subscription name must be at least 2 characters long"],
      maxlength: [100, "Subscription name must be at most 100 characters long"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be greater than or equal to 0"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      trim: true,
      uppercase: true,
      enum: ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR"],
      default: "USD",
    },
    billingCycle: {
      type: String,
      required: [true, "Billing cycle is required"],
      enum: ["monthly", "yearly", "weekly", "daily", "custom"],
    },
    category: {
      type: String,
      trim: true,
      required: [true, "Category is required"],
      enum: [
        "entertainment",
        "productivity",
        "education",
        "health",
        "finance",
        "other",
      ],
      default: "other",
    },
    paymentMethod: {
      type: String,
      trim: true,
      enum: [
        "credit_card",
        "debit_card",
        "paypal",
        "bank_transfer",
        "upi",
        "other",
      ],
      default: "other",
      required: [true, "Payment method is required"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["active", "paused", "canceled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Start date cannot be in the future",
      },
    },
    renewalDate: {
      type: Date,
      required: [true, "Renewal date is required"],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to auto-calculate renewalDate and update status
subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate && this.startDate && this.billingCycle) {
    const startDate = new Date(this.startDate);
    let renewal;

    switch (this.billingCycle) {
      case "monthly":
        renewal = new Date(startDate.setMonth(startDate.getMonth() + 1));
        break;
      case "yearly":
        renewal = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
        break;
      case "weekly":
        renewal = new Date(startDate.setDate(startDate.getDate() + 7));
        break;
      case "daily":
        renewal = new Date(startDate.setDate(startDate.getDate() + 1));
        break;
      case "custom":
        renewal = new Date(startDate.setMonth(startDate.getMonth() + 1));
        break;
      default:
        renewal = null;
    }

    this.renewalDate = renewal;
  }

  // Auto-update status if renewalDate has passed
  if (this.renewalDate && this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
