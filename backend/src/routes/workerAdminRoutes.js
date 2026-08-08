import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
    getWorkers,
    getPendingWorkers,
    getLiveWorkers,
    getWorkerById,
    verifyWorker,
    suspendWorker,
} from '../controllers/workerAdminController.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/',          getWorkers);
router.get('/pending',   getPendingWorkers);
router.get('/live',      getLiveWorkers);
router.get('/:id',       getWorkerById);
router.patch('/:id/verify',  verifyWorker);
router.patch('/:id/suspend', suspendWorker);

export default router;
