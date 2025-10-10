import Subscription from "../../models/subscription.model.js";
import Joi from "joi";

const subscriptionSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    price: Joi.number().min(0).required(),
    currency: Joi.string().valid('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR').default('USD'),
    billingCycle: Joi.string().valid('monthly', 'yearly', 'weekly', 'daily', 'custom').required(),
    category: Joi.string().valid('entertainment', 'productivity', 'education', 'health', 'finance', 'other').required(),
    paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'upi', 'other').required(),
    status: Joi.string().valid('active', 'paused', 'canceled', 'expired').required(),
    startDate: Joi.date().max('now').required(),
    renewalDate: Joi.date().greater(Joi.ref('startDate')),
});

// Create new subscription
export const createSubscription = async (req, res, next) => {
    try {
        // Validate input
        const { error, value } = subscriptionSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            return next(err);
        }

        // Create subscription
        const subscription = await Subscription.create({
            ...value,
            user: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Subscription created successfully",
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};

// Fetch subscriptions for a particular user
export const getUserSubscriptions = async(req, res, next)=>{
    try {
        const userId = req.params.userId;
        const subscriptions = await Subscription.find({ user: userId });
        res.status(200).json({
            success: true,
            message: "User subscriptions fetched successfully",
            data: subscriptions,
        });
    } catch (error) {
        next(error);
    }
};