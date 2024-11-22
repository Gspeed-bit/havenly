import express from 'express';
import { authMiddleware } from '@middleware/authMiddleware';
import { userMiddleware } from '@middleware/userMiddleware';
import {
  sendInquiry,
  getInquiries,
  updateInquiryStatus,
} from '../controllers/inquiryController';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Inquiries
 *   description: Manage property inquiries.
 */

/**
 * @openapi
 * /inquiries/send:
 *   post:
 *     summary: Send an inquiry
 *     description: Users can send inquiries about properties.
 *     tags:
 *       - Inquiries
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Inquiry details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *                 description: ID of the property.
 *               message:
 *                 type: string
 *                 description: User's message.
 *     responses:
 *       201:
 *         description: Inquiry sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inquiry sent successfully!
 *                 inquiry:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     propertyId:
 *                       type: string
 *                     message:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: pending
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Property not found.
 *       500:
 *         description: Server error.
 */
router.post('/inquiries/send', userMiddleware, sendInquiry);

/**
 * @openapi
 * /inquiries:
 *   get:
 *     summary: Retrieve inquiries
 *     description: Retrieve inquiries based on filters. Users can see their own inquiries; admins can see all inquiries.
 *     tags:
 *       - Inquiries
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Submitted, Under Review, Answered]
 *         description: Filter inquiries by status.
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *         description: Filter inquiries by property ID.
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: (Admin-only) Filter inquiries by user ID.
 *     responses:
 *       200:
 *         description: List of inquiries retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Response message.
 *                   example: Inquiries retrieved successfully.
 *                 inquiries:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Inquiry ID.
 *                       userId:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: User's name.
 *                           email:
 *                             type: string
 *                             description: User's email.
 *                       propertyId:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             description: Property title.
 *                           location:
 *                             type: string
 *                             description: Property location.
 *                           price:
 *                             type: number
 *                             description: Property price.
 *                       message:
 *                         type: string
 *                         description: Inquiry message.
 *                       status:
 *                         type: string
 *                         enum: [Submitted, Under Review, Answered]
 *                         description: Inquiry status.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the inquiry was created.
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the inquiry was last updated.
 *       404:
 *         description: No inquiries found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Response message.
 *                   example: No inquiries found.
 *                 inquiries:
 *                   type: array
 *                   items: {}
 *                   description: An empty array.
 *                   example: []
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.get('/inquiries', userMiddleware, getInquiries);

/**
 * @openapi
 * /inquiries/{id}:
 *   put:
 *     summary: Update inquiry status
 *     description: Admin-only endpoint to update inquiry statuses.
 *     tags:
 *       - Inquiries
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inquiry ID.
 *     requestBody:
 *       description: Status and optional custom message to update the inquiry.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Submitted, Under Review, Answered]
 *                 description: New status for the inquiry.
 *               customMessage:
 *                 type: string
 *                 description: Optional custom message for the inquiry update.
 *                 example: "Our team is now reviewing your inquiry. We will get back to you shortly."
 *     responses:
 *       200:
 *         description: Inquiry status updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inquiry status updated successfully.
 *                 inquiry:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Inquiry ID.
 *                     status:
 *                       type: string
 *                       enum: [Submitted, Under Review, Answered]
 *                       description: Updated status of the inquiry.
 *                     customMessage:
 *                       type: string
 *                       description: Custom message included in the notification.
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of the last update.
 *       400:
 *         description: Invalid status.
 *       403:
 *         description: Access denied (Admin only).
 *       404:
 *         description: Inquiry not found.
 *       500:
 *         description: Server error.
 */
router.put('/inquiries/:id', authMiddleware, updateInquiryStatus);

export default router;
