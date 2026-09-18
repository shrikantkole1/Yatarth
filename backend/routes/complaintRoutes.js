import express from 'express';
import { createComplaint, listComplaints, updateComplaintStatus } from '../controllers/complaintController.js';

const router = express.Router();

router.get('/', listComplaints);
router.post('/', createComplaint);
router.patch('/:id/status', updateComplaintStatus);

export default router;
