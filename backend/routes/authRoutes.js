import express from 'express';
import { loginInspector, getProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/inspector-login', loginInspector);
router.post('/login', loginInspector);
router.get('/profile/:uid', getProfile);

export default router;
