import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import User from '../models/userModel';

const sendVerificationEmail = async (email: string, code: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'Havenly Email Verification',
    text: `Your verification code is: ${code}`,
  });
};

// Registration code in user controller
export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, adminCode } =
      req.body;

    const isAdmin = adminCode === process.env.ADMIN_CODE;

    // Generate a unique verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString(); // 6-digit code

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with isAdmin status, hashed password, and verification code
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Use hashed password here
      phoneNumber,
      adminCode: isAdmin ? adminCode : undefined,
      isAdmin,
      verificationCode,
    });

    // Save the new user
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      message:
        'User registered successfully. Please check your email for verification.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+adminCode'); // Include `adminCode` for admin check

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Account not verified' });
    }

    // Determine if the user is an admin by checking the adminCode
    const isAdmin = user.adminCode === process.env.ADMIN_CODE;

    // Generate token with the correct `isAdmin` status
    const token = jwt.sign(
      { id: user._id, isAdmin },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // Exclude `adminCode` from the response
    const { adminCode, ...userData } = user.toObject();

    res.json({
      message: 'Login successful',
      token,
      user: { ...userData, isAdmin }, // Include `isAdmin` in response
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const { email, verificationCode } = req.body;

    // Find the user based on the email and verification code provided
    const user = await User.findOne({ email, verificationCode });

    // If no user is found, respond with an error
    if (!user) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationCode = ''; // Optional: Clear verification code after successful verification
    await user.save();

    // Respond with a success message
    res.json({ message: 'Account verified successfully' });
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ message: 'Server error', error });
  }
};
