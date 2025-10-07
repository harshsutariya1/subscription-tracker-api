import mongoose from "mongoose";
import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } from "../../config/env.js";

// Handle registration
export const signUp = async (req, res, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		// Registration logic here
		const { name, email, password } = req.body || {};
		if (!name || !email || !password || name.trim() === "" || email.trim() === "" || password.trim() === "") {
			const error = new Error("Name, email, and password are required");
			error.statusCode = 400;
			return next(error);
		}

		//check if user already exists
		const existingUser = await User.findOne({ email }).session(session);
		if (existingUser) {
			const error = new Error(`User already exists with this email: ${email}`);
			error.statusCode = 409;
			return next(error);
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new user
		const newUser = new User({
			fullName: name,
			email,
			password: hashedPassword,
		});
		await newUser.save({ session });

		// Create JWT Token
		const token = jwt.sign(
			{ userId: newUser._id },
			JWT_SECRET,
			{ expiresIn: JWT_EXPIRES_IN }
		);

		await session.commitTransaction();
		session.endSession();

		res.cookie("token", token, {
			httpOnly: true,
			secure: NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 24 * 60 * 60 * 1000,
		});

		res.status(201).json({
			success: true,
			message: "User registered successfully",
			data: {
				token,
				id: newUser._id,
				email: newUser.email,
				fullName: newUser.fullName,
			}
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		next(error);
	}
};