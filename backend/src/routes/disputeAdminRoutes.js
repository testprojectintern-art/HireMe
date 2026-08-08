import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
    getDisputes,
    getDisputeById,
    resolveDispute,
    suspendFromDispute,
    addDisputeNote,
} from '../controllers/disputeAdminController.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/',                      getDisputes);
router.get('/:id',                   getDisputeById);
router.patch('/:id/resolve',         resolveDispute);
router.patch('/:id/suspend',         suspendFromDispute);
router.post('/:id/notes',            addDisputeNote);

export default router;
