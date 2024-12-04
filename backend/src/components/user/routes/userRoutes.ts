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
  changePassword,
  confirmAdminUpdate,
  getAllAdmins,
  getAllUsers,
  getUser,
  requestAdminUpdatePin,
  updateUserProfile,
} from '@components/user/controllers/userController';
import { protect } from '@middleware/protect/protect';

import { userMiddleware } from '@middleware/userMiddleware';
import { authMiddleware } from '@middleware/authMiddleware';
// import { authMiddleware } from '@middleware/userMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and profile operations
 */

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The user's first name
 *               lastName:
 *                 type: string
 *                 description: The user's last name
 *               phoneNumber:
 *                 type: string
 *                 description: The user's phone number
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: An optional profile image file
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
 *                   example: Profile updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 63cfe2f9e7d1e812b79b2d3a
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     phoneNumber:
 *                       type: string
 *                       example: +1234567890
 *                     imgUrl:
 *                       type: string
 *                       example: https://example.com/profile-image.jpg
 *       400:
 *         description: Invalid email update attempt
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

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
 *                 example: 123456
 *               updates:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: John
 *                   lastName:
 *                     type: string
 *                     example: Doe
 *                   phoneNumber:
 *                     type: string
 *                     example: +1234567890
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
 *                   example: Profile updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     example: 63cfe2f9e7d1e812b79b2d3a
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     phoneNumber:
 *                       type: string
 *                       example: +1234567890
 *       400:
 *         description: Invalid or expired PIN
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/change-password:
 *   post:
 *     summary: Change the authenticated user's password
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
 *               currentPassword:
 *                 type: string
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Invalid input or password mismatch
 *       500:
 *         description: Server error
 */

router.get('/me', userMiddleware, getUser);
router.get(
  '/',
  protect,
  catchApiError(async (req, res) => {
    if (!req.user?.isAdmin) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, {
        message: 'Access denied',
      });
    }
    const users = await getAllUsers(req, res);
    // Ensure no duplicate response
    if (!res.headersSent) {
      successResponse(res, users, 'Users retrieved successfully');
    }
  })
);
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
router.post('/confirm-update', protect, confirmAdminUpdate);
router.put('/update', userMiddleware, authMiddleware, updateUserProfile);
router.post('/request-pin', protect, requestAdminUpdatePin);

router.post('/change-password', protect, changePassword);

export default router;
