import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user.controller.js';

router.get('/', userController.getAllUsers);
router.get('/me', userController.getMe);
router.put('/me/lastPackDate', userController.updateLastPackDate);

router.get('/:id', userController.getUserById);
router.put('/:id/role', userController.updateUserRole);
router.delete('/:id', userController.deleteUser);

export default router;
