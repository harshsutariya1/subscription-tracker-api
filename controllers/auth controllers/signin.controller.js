import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } from "../../config/env.js";

export const signIn = async (req, res, next) => {
	try {
		const { email, password } = req.body || {};

		// Validate input
		if (!email || !password || email.trim() === "" || password.trim() === "") {
			const error = new Error("Email and password are required");
			error.statusCode = 400;
			return next(error);
		}

		// Find user by email (no session needed)
		const user = await User.findOne({ email });
		if (!user) {
			const error = new Error("Invalid email or password");
			error.statusCode = 401;
			return next(error);
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			const error = new Error("Invalid email or password");
			error.statusCode = 401;
			return next(error);
		}

		// Create JWT Token
		const token = jwt.sign(
			{ userId: user._id },
			JWT_SECRET,
			{ expiresIn: JWT_EXPIRES_IN }
		);

		// Set HTTP-only cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 24 * 60 * 60 * 1000, // 1 day
		});

		res.status(200).json({
			success: true,
			message: "Login successful",
			token,
			user: {
				id: user._id,
				fullName: user.fullName,
				email: user.email,
			},
		});
	} catch (error) {
		next(error);
	}
};