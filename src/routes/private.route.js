import express from 'express';
const router = express.Router();

import { authenticate, requireAdmin } from '../lib/middleware/auth.middleware.js';
import cardRoutes from './card.route.js';
import userRoutes from './user.route.js';
import userCardRoutes from './userCard.route.js';

// All private routes require authentication
router.use(authenticate);

// User's own card collection — any logged-in user
router.use('/my/cards', userCardRoutes);

// User's profile update — any logged-in user
import { updateAvatar } from '../controllers/user.controller.js';
import { upload } from '../config/cloudinary.js';

router.put('/my/avatar', upload.single('avatar'), updateAvatar);

// Admin-only: card management & user management
router.use('/cards', requireAdmin, cardRoutes);
router.use('/users', requireAdmin, userRoutes);

export default router;
