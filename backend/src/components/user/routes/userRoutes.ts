import express from 'express';

// import { authMiddleware } from '@middleware/authMiddleware';
import {
  ApiError,
  catchApiError,
  StatusCodes,
  successResponse,
} from 'utils/apiResponse';
// import { userMiddleware } from '@middleware/userMiddleware';
import {
  confirmAdminUpdate,
  getAllAdmins,
  getAllUsers,
  getUser,
  requestAdminUpdatePin,
  updateUserProfile,
} from '@components/user/controllers/userController';
import { protect } from '@middleware/protect/protect';
// import { userMiddleware } from '@middleware/userMiddleware';
import authenticateToken from '@middleware/protect/authenticateToken';

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
router.get('/me', protect, authenticateToken, 
  catchApiError(getUser));

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
  protect,
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
  protect,
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

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *       400:
 *         description: Invalid email update attempt
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/update', protect, updateUserProfile);

/**
 * @swagger
 * /user/request-pin:
 *   post:
 *     summary: Request a PIN for admin profile update (Admin-only)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PIN sent to the admin's email
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.post('/request-pin', protect, requestAdminUpdatePin);

/**
 * @swagger
 * /user/confirm-update:
 *   post:
 *     summary: Confirm admin profile update using PIN (Admin-only)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pin:
 *                 type: string
 *               updates:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *       400:
 *         description: Invalid or expired PIN
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.post('/confirm-update', protect, confirmAdminUpdate);

export default router;
