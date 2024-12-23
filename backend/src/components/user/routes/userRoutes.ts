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
import {
  adminMiddleware,
  userMiddleware,
} from '@middleware/userAndAdminMiddleware/protect';
import upload from '@middleware/fileUpload/multer';

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
router.get('/me', userMiddleware, getUser);

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
  userMiddleware,
  adminMiddleware,
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
  userMiddleware,
  adminMiddleware,
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
 *     summary: Update user profile
 *     description: Allows a user to update their profile details. Admins can also update additional fields after verifying the PIN.
 *     tags:
 *       - Users
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
 *               pin:
 *                 type: string
 *                 description: The admin PIN (required for admin users)
 *               imgUrl:
 *                 type: string
 *                 format: binary
 *                 description: The user's profile image (optional, if updated). Should be sent as a file.
 *             example:
 *               firstName: "joe"
 *               lastName: "don"
 *               phoneNumber: "08012345678"
 *               pin: "admin-pin"
 *               imgUrl: "file-to-be-uploaded"  # This is a placeholder, in practice, you will upload the file
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
 *                   example: "Profile updated successfully."
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique ID of the user
 *                     firstName:
 *                       type: string
 *                       description: The user's first name
 *                     lastName:
 *                       type: string
 *                       description: The user's last name
 *                     phoneNumber:
 *                       type: string
 *                       description: The user's phone number
 *                     email:
 *                       type: string
 *                       description: The user's email
 *                     imgUrl:
 *                       type: string
 *                       description: The URL of the user's profile image
 *                     isVerified:
 *                       type: boolean
 *                       description: Indicates whether the user is verified
 *       400:
 *         description: Bad request. Validation failed, or invalid admin PIN.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or missing PIN."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred."
 *                 error:
 *                   type: string
 *                   example: "Error message details"
 */
router.put(
  '/update',
  userMiddleware,
  upload.single('image'),
  updateUserProfile
);

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
router.post(
  '/request-pin',
  userMiddleware,
  adminMiddleware,
  requestAdminUpdatePin
);

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
router.post(
  '/confirm-update',
  userMiddleware,
  adminMiddleware,
  confirmAdminUpdate
);

/**
 * @swagger
 * /user/confirm-password:
 *   post:
 *     summary: Confirm a password update for the authenticated user
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
 *                 description: The current password of the user
 *               newPassword:
 *                 type: string
 *                 description: The new password to be set
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
 *         description: New password must be different from the old password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New password must be different from the old password
 *       401:
 *         description: Incorrect current password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Current password is incorrect
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred
 */
router.post('/confirm-password', userMiddleware, changePassword);

export default router;
