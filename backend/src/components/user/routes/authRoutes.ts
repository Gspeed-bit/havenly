import express from 'express';
import {
  login,
  register,
  requestNewCode,
  requestResetPassword,
  resetPassword,
  verify,
} from '../controllers/authController';
import rateLimit from 'express-rate-limit';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Authentication
 *   description: Endpoints for user authentication
 */

/**
 * @openapi
 * /register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               adminCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully, verification email sent
 *       400:
 *         description: Validation error (e.g., passwords don't match)
 *       500:
 *         description: Server error
 */
router.post('/register', register);

/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "613a08e7a1b9b5a1e4c47b60"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "1234567890"
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', login);

/**
 * @openapi
 * /verify:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify a user's account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               verificationCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account verified successfully
 *       400:
 *         description: Invalid verification code
 *       500:
 *         description: Server error
 */
router.post('/verify', verify);

/**
 * @openapi
 * /verification-code/request:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Request a new verification code if expired
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: New verification code sent
 *       400:
 *         description: User not found
 *       500:
 *         description: Server error
 */
const requestNewCodeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // Limit each IP to 3 requests per windowMs
  message: 'Too many requests, please try again later.',
});
router.post(
  '/verification-code/request',
  requestNewCodeLimiter,
  requestNewCode
);

/**
 * @openapi
 * /request-reset-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Request a password reset email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset password email sent
 *       400:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/request-reset-password', requestResetPassword);

/**
 * @openapi
 * /reset-password/{token}:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Reset the password using the provided token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The password reset token
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password has been reset successfully
 *       400:
 *         description: Invalid or expired reset token
 *       500:
 *         description: Server error
 */
router.post('/reset-password/:token', resetPassword);


export default router;
