import express from 'express';
import {
  createInspection,
  getPresignedUploadUrl,
  confirmViewUpload,
  submitInspection,
  getInspectionStatus,
  getInspectionById,
  listInspections,
  getInspectionReport,
} from '../controllers/inspectionController.js';

const router = express.Router();

router.get('/', listInspections);
router.post('/', createInspection);
router.post('/:id/upload-url', getPresignedUploadUrl);
router.post('/:id/views/:view/confirm', confirmViewUpload);
router.post('/:id/submit', submitInspection);
router.get('/:id/status', getInspectionStatus);
router.get('/:id/report', getInspectionReport);
router.get('/:id', getInspectionById);

export default router;
