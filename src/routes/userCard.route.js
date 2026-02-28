import express from 'express';
const router = express.Router();
import * as userCardController from '../controllers/userCard.controller.js';

router.get('/', userCardController.getMyCards);
router.post('/', userCardController.addCardToUser);

export default router;
