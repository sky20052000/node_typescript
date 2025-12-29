import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import Student  from "../query/userQuery.js";
export const registerUser = async (req: Request, res: Response) => {
  try {
    const data = req.validatedBody;
    if (!data) {
      return res.status(500).json({
        success: false,
        message: 'Validation data missing!',
      });
    }

     const usernameExits = await Student.userUsernameOrEmailExists(
      data.email,
      data.phoneNumber,
    );
    // console.log(usernameExits.rows[0]['count'], "bb")
    if (Number(usernameExits.rows[0]["count"]) > 0) {
      return res
        .status(400)
        .send({ success: false, message: "User already exist!" });
    }
    // Business validation
    if (data.password !== data.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords don't match",
      });
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
     const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiration = new Date(Date.now() + 2 * 60 * 1000);
    const userPayload = {
      email: data.email.trim().toLowerCase(),
      name: data.name.trim(),
      password: hashedPassword,
      phoneNumber: data.phoneNumber.trim(),
      role: data.role || 'student',
      status: data.status || 'active',
      city: data.city?.trim() || null,
      presently: data.presently?.trim() || null,
      institute_name: data.institute_name?.trim() || null,
      user_state: data.user_state?.trim() || null,
      date_joined: new Date(),
      otp,
      otpExpiration
    };
    await Student.createUser(userPayload);
    return res.status(201).json({
      success: true,
      message: 'User Registered successfully!',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong!',
    });
  }
};


