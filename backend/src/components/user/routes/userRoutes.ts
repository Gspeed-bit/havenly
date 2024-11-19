import express from 'express';
import {
  getAllAdmins,
  getAllUsers,
  getUser,
} from '@controllers/controllers/userController';
import { authMiddleware } from '@middleware/authMiddleware';
import {
  ApiError,
  catchApiError,
  StatusCodes,
  successResponse,
} from 'utils/apiResponse';

const router = express.Router();

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Retrieve the authenticated user's information
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 isVerified:
 *                   type: boolean
 *                 isAdmin:
 *                   type: boolean
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/me', authMiddleware, catchApiError(getUser));

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve all non-admin users (Admin-only)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of non-admin users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   isVerified:
 *                     type: boolean
 *                   isAdmin:
 *                     type: boolean
 *                     description: Indicates if the user is an admin
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  authMiddleware,
  catchApiError(async (req, res) => {
    if (!req.user?.isAdmin) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, {
        message: 'Access denied',
      });
    }
    await getAllUsers(req, res); // Admin-only route to get all non-admin users
  })
);

/**
 * @swagger
 * /user/admin:
 *   get:
 *     summary: Retrieve all admins (Admin-only)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   isVerified:
 *                     type: boolean
 *                   isAdmin:
 *                     type: boolean
 *                     description: Indicates if the user is an admin
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.get(
  '/admin',
  authMiddleware,
  catchApiError(async (req, res) => {
    if (!req.user?.isAdmin) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, {
        message: 'Access denied',
      });
    }
    const admins = await getAllAdmins(req, res);
    return successResponse(res, admins, 'Admins retrieved successfully');
  })
);

export default router;
