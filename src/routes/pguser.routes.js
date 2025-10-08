import express from 'express';
const router = express.Router();

import { authenticateJWT, checkRole } from '../auth/jwt.auth.js';
import { uploadLocal } from '../config/s3.js';
import { pgdeleteUser, pgforgotPassword, pggetAllUsers, pggetUserById, pgloginUser, pgregisterUser, pgresetPassword, pgupdateUser, pgverifyOtp } from '../controllers/pguser.controller.js';



// PostgreSQL User Routes
// ✅ Public routes

router.post('/register', uploadLocal.single("profilePhoto"), pgregisterUser);
router.post('/login', pgloginUser);
router.post('/forgot-password', pgforgotPassword);
router.post('/verify-otp', pgverifyOtp);
router.post('/reset-password', pgresetPassword);

// ✅ Protected routes (require JWT)

router.get('/', authenticateJWT,checkRole('admin'), pggetAllUsers);
router.get('/:id', authenticateJWT, pggetUserById);
router.post('/update/:id', authenticateJWT, pgupdateUser);
router.put('/:id', uploadLocal.single("profilePhoto"),authenticateJWT, pgupdateUser);
router.delete('/:id', authenticateJWT, checkRole('admin'), pgdeleteUser);
export default router;
