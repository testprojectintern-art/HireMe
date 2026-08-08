import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { getAdminStats, getActivityLog } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats',        getAdminStats);
router.get('/activity-log', getActivityLog);

export default router;
