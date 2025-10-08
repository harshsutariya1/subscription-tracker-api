import aj from '../config/arcjet.js';
import { NODE_ENV } from '../config/env.js';

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 1 });

        // (|| NODE_ENV === 'development') temp. condition
        // Skip Arcjet in development
        if (NODE_ENV === "development") {
            return next();
        }

        if (decision.isDenied) {
            if (decision.reason.isRateLimit()) {
                const error = new Error("Too many requests - try again later");
                error.statusCode = 429;
                return next(error);
            }
            if (decision.reason.isBot()) {
                const error = new Error("Access denied - bot detected");
                error.statusCode = 403;
                return next(error);
            }
            if (decision.reason.isShield()) {
                const error = new Error("Access denied - suspicious activity detected");
                error.statusCode = 403;
                return next(error);
            }

            const error = new Error("Access denied by Arcjet");
            error.statusCode = 403;
            return next(error);
        }

        next();
    } catch (error) {
        console.error("Arcjet middleware error:", error);
        next(error);
    }
}

export default arcjetMiddleware;