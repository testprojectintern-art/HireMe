import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
    getJobs,
    getLiveJobs,
    getJobById,
    reassignJob,
    exportJobs,
} from '../controllers/jobAdminController.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/',           getJobs);
router.get('/live',       getLiveJobs);
router.get('/export',     exportJobs);
router.get('/:id',        getJobById);
router.patch('/:id/reassign', reassignJob);

export default router;
