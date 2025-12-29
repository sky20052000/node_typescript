import { type Request, type Response } from "express";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const data = req.validatedBody;
    if (!data) {
      return res.status(500).json({
        success: false,
        message: 'Validation data missing!',
      });
    }

    // Business validation
    if (data.password !== data.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords don't match",
      });
    }

    // Hash password (12 rounds production में बेहतर)
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Prepare payload for DB
    const userPayload = {
      email: data.email.trim().toLowerCase(),
      name: data.name.trim(),
      password_hash: hashedPassword,
      phoneNumber: data.phoneNumber.trim(),
      role: data.role || 'student',
      status: data.status || 'active',
      city: data.city?.trim() || null,
      presently: data.presently?.trim() || null,
      institute_name: data.institute_name?.trim() || null,
      user_state: data.user_state?.trim() || null,
      date_joined: new Date(),
    };
    return res.status(201).json({
      success: true,
      message: 'Registration successful! Please verify your email.',
      userPayload
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};


