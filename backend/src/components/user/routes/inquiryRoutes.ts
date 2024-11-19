import express from 'express';
import { authMiddleware } from '@middleware/authMiddleware'; 
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
 *   description: Endpoints for managing property inquiries
 */

/**
 * @openapi
 * /api/inquiries/send:
 *   post:
 *     summary: Send an inquiry for a property
 *     description: Send an inquiry with the property ID, user message, and contact info.
 *     tags:
 *       - Inquiries
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Inquiry details to send.
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
 *                 description: Message from the user.
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *     responses:
 *       201:
 *         description: Inquiry sent successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.post('/inquiries/send', authMiddleware, sendInquiry);

/**
 * @openapi
 * /api/inquiries:
 *   get:
 *     summary: Retrieve a list of inquiries
 *     description: Retrieve inquiries based on filters (userId, propertyId, status).
 *     tags:
 *       - Inquiries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of inquiries
 *       500:
 *         description: Internal server error
 */
router.get('/inquiries', authMiddleware, getInquiries);

/**
 * @openapi
 * /api/inquiries/{id}:
 *   put:
 *     summary: Update the status of an inquiry
 *     description: Admin-only endpoint to update inquiry status.
 *     tags:
 *       - Inquiries
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Inquiry status update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, contacted, resolved]
 *     responses:
 *       200:
 *         description: Inquiry status updated
 *       400:
 *         description: Invalid status
 *       403:
 *         description: Access denied (Admin only)
 *       404:
 *         description: Inquiry not found
 *       500:
 *         description: Internal server error
 */
router.put('/inquiries/:id', authMiddleware, updateInquiryStatus);

export default router;
