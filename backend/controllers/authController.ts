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

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
      <h1 style="color: #3A0CA3; text-align: center;">Welcome to Havenly!</h1>
      <p style="font-size: 16px; line-height: 1.5;">Hi there,</p>
      <p style="font-size: 16px; line-height: 1.5;">
        Thank you for joining Havenly! We're excited to have you on board. Please use the verification code below to confirm your email address:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 24px; font-weight: bold; color: #3A0CA3; padding: 10px 20px; border: 1px dashed #3A0CA3; border-radius: 5px;">
          ${code}
        </span>
      </div>
      <p style="font-size: 16px; line-height: 1.5;">
        If you didn't create this account, you can safely ignore this email.
      </p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="http://localhost:5000/api/auth/verify?email=${email}&code=${code}" style="text-decoration: none; padding: 10px 20px; background-color: #3A0CA3; color: white; font-size: 16px; border-radius: 5px;">Verify Email</a>
      </div>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
      <footer style="text-align: center; font-size: 14px; color: #999;">
        <p>
          Havenly Inc., 1234 Street Name, City, State, ZIP Code<br />
          Need help? <a href="mailto:support@yourdomain.com" style="color: #3A0CA3; text-decoration: none;">Contact Support</a>
        </p>
        <p>© 2024 Havenly. All rights reserved.</p>
      </footer>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'Havenly Email Verification',
    html: htmlContent, // Use HTML content instead of plain text
  });
};

// Register user
export const register = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      adminCode,
    } = req.body;

    // check if all fields are filled
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber
    ) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // check if password and confirm password are the same
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if phone number already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({
        message: 'Phone number is already registered',
      });
    }
    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const isAdmin = adminCode === process.env.ADMIN_CODE;

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpiration = new Date(Date.now() + 2 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      adminCode: isAdmin ? adminCode : undefined,
      isAdmin,
      verificationCode,
      verificationCodeExpiration,
    });

    await user.save();
    await sendVerificationEmail(email, verificationCode);

    res
      .status(201)
      .json({ message: 'Registration successful. Verify your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+adminCode');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Account not verified' });
    }

    const isAdmin = user.adminCode === process.env.ADMIN_CODE;

    const token = jwt.sign(
      { id: user._id, isAdmin },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
      }
    );

    const { adminCode, ...userData } = user.toObject();

    res.json({
      message: 'Login successful',
      token,
      user: { ...userData, isAdmin },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Verify user
export const verify = async (req: Request, res: Response) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const user = await User.findOne({ email });
    if (!user || user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (new Date() > user.verificationCodeExpiration) {
      return res.status(400).json({ message: 'Verification code expired.' });
    }

    user.isVerified = true;
    user.verificationCode = null as any;
    await user.save();

    res.json({ message: 'Account verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const requestNewCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Generate a new verification code
    const newVerificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Update the user's verification code and expiration time
    user.verificationCode = newVerificationCode;
    user.verificationCodeExpiration = new Date(Date.now() + 1 * 60 * 1000); // Set the expiration time to 2 minutes from now
    await user.save();

    // Send the new verification code email
    await sendVerificationEmail(email, newVerificationCode);

    res.json({ message: 'New verification code sent to your email.' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error requesting new code.', error });
  }
};
