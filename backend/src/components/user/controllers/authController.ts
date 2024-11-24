import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '@components/user/models/userModel'; // Adjust the path as necessary
import { KEYS } from 'config/config';
import { StatusCodes } from 'utils/apiResponse';
import sendResetPasswordEmail, {
  generateVerificationCode,
  sendVerificationEmail,
} from 'utils/emailUtils';
import { sanitizeUser } from 'utils/sanitizeUser';

// Usage in the registration logic
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

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Please fill in all fields' });
    }

    if (password !== confirmPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({
      $or: [{ phoneNumber }, { email }],
    });
    if (existingUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Phone number or email is already registered' });
    }
    const isAdmin = adminCode === KEYS.adminCode;

    // Generate a 6-digit verification code using crypto
    const verificationCode = generateVerificationCode(6); // Generates a 6-character code

    const codeExpirationMinutes = parseInt(KEYS.codeExpirationMinutes, 10);

    const verificationCodeExpiration = new Date(
      Date.now() + codeExpirationMinutes * 60 * 1000
    );
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
      .status(StatusCodes.CREATED)
      .json({ message: 'Registration successful. Verify your email.' });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error registering user', error });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+adminCode');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(StatusCodes.UNAUTHENTICATED)
        .json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Account not verified' });
    }
    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isAdmin = user.adminCode === process.env.ADMIN_CODE;

    const token = jwt.sign(
      { id: user._id, isAdmin },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '15m',
      }
    );

    // Sanitize the user data before sending it in the response
    const sanitizedUser = sanitizeUser(
      user.toObject() as unknown as Record<string, unknown>,
      ['password', 'adminCode', 'verificationCode']
    );

    res.status(StatusCodes.SUCCESS).json({
      message: 'Login successful',
      token,
      user: { ...sanitizedUser, isAdmin },
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Server error', error });
  }
};

// Verify user
export const verify = async (req: Request, res: Response) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Email and code are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'User not found' });
    }

    // Check if the user has a verification code stored
    if (!user.verificationCode) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'No verification code found for this user' });
    }
    // Directly compare the stored verification code with the user input
    if (user.verificationCode !== verificationCode) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid verification code' });
    }

    // Check if the verification code has expired
    if (
      !user.verificationCodeExpiration ||
      new Date() > user.verificationCodeExpiration
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Verification code expired' });
    }

    // Proceed with verifying the user's account
    user.isVerified = true;
    user.verificationCode = null; // Remove the verification code after successful verification
    user.verificationCodeExpiration = null; // Clear expiration time as well
    await user.save();

    res.json({ message: 'Account verified successfully' });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Server error', error });
  }
};

export const requestNewCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'User not found.' });
    }

    // Generate a new verification code using crypto
    const newVerificationCode = generateVerificationCode(6); // Generates a 6-character code

    // Update the user's verification code and expiration time
    user.verificationCode = newVerificationCode;
    const codeExpirationMinutes = parseInt(
      process.env.CODE_EXPIRATION_MINUTES || '2',
      10
    );
    user.verificationCodeExpiration = new Date(
      Date.now() + codeExpirationMinutes * 60 * 1000
    ); // Set expiration time

    await user.save();

    // Send the new verification code email
    await sendVerificationEmail(email, newVerificationCode);

    res.json({ message: 'New verification code sent to your email.' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error requesting new code.', error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Find user by reset token
    const user = await User.findOne({ resetPasswordCode: token });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Invalid or expired reset token.' });
    }

    // Check if the reset token has expired
    if (
      user.resetPasswordExpiration &&
      Date.now() > user.resetPasswordExpiration.getTime()
    ) {
      return res.status(400).json({ message: 'Reset token has expired.' });
    }

    // Hash the new password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetPasswordCode = null; // Clear the reset token after use
    user.resetPasswordExpiration = null; // Clear the expiration time

    await user.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const requestResetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Generate a reset password code
    const resetPasswordToken = randomBytes(20).toString('hex');
    const resetPasswordExpiration = Date.now() + 3600000; // 1 hour expiration

    // Save the reset password code and expiration to the user's record
    user.resetPasswordCode = resetPasswordToken;
    user.resetPasswordExpiration = new Date(resetPasswordExpiration); // Correct

    await user.save();

    // Send the reset password email (you'll need to implement this function)
    await sendResetPasswordEmail(email, resetPasswordToken);

    res.json({ message: 'Reset password email sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};
