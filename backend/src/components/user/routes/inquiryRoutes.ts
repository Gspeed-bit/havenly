
import { Router } from 'express';
import { createInquiry, getInquiriesForAdmin, getInquiriesForUser, respondToInquiry } from '../controllers/inquiryController';
import { adminMiddleware, userMiddleware } from '@middleware/userAndAdminMiddleware/protect';

const router = Router();

router.post('/inquiries/send', userMiddleware, createInquiry);
router.post(
  '/inquiries/:inquiryId/respond',
  userMiddleware,
  adminMiddleware,
  respondToInquiry
);
router.get(
  '/inquiry',
  userMiddleware,
  adminMiddleware,
  getInquiriesForAdmin
);
router.get('/user/inquiries', userMiddleware, getInquiriesForUser);

export default router;