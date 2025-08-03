import express from 'express';
const router = express.Router();

import sampleRoutes from './sample.routes.js';
import userRoutes from './user.routes.js';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';
router.use('/', sampleRoutes);
router.use('/user', userRoutes);
// ✅ Basic check route (after API)
router.get('/', (req, res) => {
  res.send('API is working ✅');
});

export default router;
