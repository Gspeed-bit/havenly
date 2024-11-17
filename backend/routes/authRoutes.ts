import express from 'express';
import {
  login,
  register,
  requestNewCode,
  verify,
} from '../controllers/authController';
import rateLimit from 'express-rate-limit';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints for user authentication
 */

/**
 * @swagger
 * /api/auth/register:
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
 * @swagger
 * /api/auth/login:
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
 * @swagger
 * /api/auth/verify:
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

// Request new verification code (if expired)
/**
 * @swagger
 * /api/auth/verification-code/request:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Request a new verification code
 *     description: Allows a user to request a new verification code if the previous one expired.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user requesting a new verification code.
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: New verification code sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "New verification code sent to your email."
 *       400:
 *         description: User not found or validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Server error while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error requesting new code."
 */

// Set up rate limiter for /api/auth/request-new-code
const requestNewCodeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // Limit each IP to 3 requests per windowMs
  message: "Too many requests, please try again later.",
});

router.post('/verification-code/request', requestNewCodeLimiter, requestNewCode);

export default router;
