import prisma from '../config/prisma.js';
import { nanoIdFormat } from '../lib/utils/nanoIdFormat.js';

// GET /cards — get all cards
export const getAllCards = async (req, res) => {
    try {
        const cards = await prisma.card.findMany({ orderBy: { createdAt: 'desc' } });
        res.status(200).json({ message: 'OK', code: 200, data: cards });
    } catch (err) {
        res.status(500).json({ message: err.message, code: 500 });
    }
};

// GET /cards/:id — get single card
export const getCardById = async (req, res) => {
    try {
        const card = await prisma.card.findUnique({ where: { id: req.params.id } });
        if (!card) return res.status(404).json({ message: 'Card not found', code: 404 });
        res.status(200).json({ message: 'OK', code: 200, data: card });
    } catch (err) {
        res.status(500).json({ message: err.message, code: 500 });
    }
};

// POST /cards — create card
export const createCard = async (req, res) => {
    try {
        const { name, image, rarity, type } = req.body;
        const id = nanoIdFormat('cuid-');
        const card = await prisma.card.create({ data: { id, name, image, rarity, type } });
        res.status(201).json({ message: 'Card created', code: 201, data: card });
    } catch (err) {
        res.status(500).json({ message: err.message, code: 500 });
    }
};

// PUT /cards/:id — update card
export const updateCard = async (req, res) => {
    try {
        const { name, image, rarity, type } = req.body;
        const card = await prisma.card.update({
            where: { id: req.params.id },
            data: { name, image, rarity, type },
        });
        res.status(200).json({ message: 'Card updated', code: 200, data: card });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: 'Card not found', code: 404 });
        res.status(500).json({ message: err.message, code: 500 });
    }
};

// DELETE /cards/:id — delete card
export const deleteCard = async (req, res) => {
    try {
        await prisma.card.delete({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Card deleted', code: 200 });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: 'Card not found', code: 404 });
        res.status(500).json({ message: err.message, code: 500 });
    }
};
