import prisma from '../config/prisma.js';
import { nanoIdFormat } from '../lib/utils/nanoIdFormat.js';

// GET /my/cards — get all UserCards for the requesting user
// req.userId must be set by auth middleware (we'll read from JWT header for now)
export const getMyCards = async (req, res) => {
    try {
        const userId = req.userId;
        const userCards = await prisma.userCard.findMany({
            where: { userId },
        });
        res.status(200).json({ message: 'OK', code: 200, data: userCards });
    } catch (err) {
        res.status(500).json({ message: err.message, code: 500 });
    }
};

// POST /my/cards — add or increment a card for a user
// body: { cardId }
export const addCardToUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { cardId } = req.body;

        const existing = await prisma.userCard.findUnique({
            where: { userId_cardId: { userId, cardId } },
        });

        let userCard;
        if (existing) {
            userCard = await prisma.userCard.update({
                where: { userId_cardId: { userId, cardId } },
                data: { count: { increment: 1 } },
            });
        } else {
            userCard = await prisma.userCard.create({
                data: { id: nanoIdFormat('ucid-'), userId, cardId },
            });
        }

        res.status(200).json({ message: 'Card added', code: 200, data: userCard });
    } catch (err) {
        res.status(500).json({ message: err.message, code: 500 });
    }
};
