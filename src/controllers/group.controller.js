import prisma from '../config/prisma.js';
import { nanoIdFormat } from '../lib/utils/nanoIdFormat.js';

// GET /groups — all groups with card count
export const getAllGroups = async (req, res) => {
    try {
        const groups = await prisma.group.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { cards: true } } },
        });
        res.status(200).json({ message: 'OK', code: 200, data: groups });
    } catch (err) {
        res.status(500).json({ message: err.message, code: 500 });
    }
};

// GET /groups/:id — single group with its cards
export const getGroupById = async (req, res) => {
    try {
        const group = await prisma.group.findUnique({
            where: { id: req.params.id },
            include: { cards: { orderBy: { createdAt: 'desc' } } },
        });
        if (!group) return res.status(404).json({ message: 'Group not found', code: 404 });
        res.status(200).json({ message: 'OK', code: 200, data: group });
    } catch (err) {
        res.status(500).json({ message: err.message, code: 500 });
    }
};

// POST /groups — create group
export const createGroup = async (req, res) => {
    try {
        const { name, description, coverImage } = req.body;
        if (!name) return res.status(400).json({ message: 'Name is required', code: 400 });
        const id = nanoIdFormat('grp-');
        const group = await prisma.group.create({
            data: { id, name, description: description || null, coverImage: coverImage || null },
            include: { _count: { select: { cards: true } } },
        });
        res.status(201).json({ message: 'Group created', code: 201, data: group });
    } catch (err) {
        res.status(500).json({ message: err.message, code: 500 });
    }
};

// PUT /groups/:id — update group
export const updateGroup = async (req, res) => {
    try {
        const { name, description, coverImage } = req.body;
        const group = await prisma.group.update({
            where: { id: req.params.id },
            data: { name, description, coverImage },
            include: { _count: { select: { cards: true } } },
        });
        res.status(200).json({ message: 'Group updated', code: 200, data: group });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: 'Group not found', code: 404 });
        res.status(500).json({ message: err.message, code: 500 });
    }
};

// DELETE /groups/:id — delete group (cards become ungrouped via onDelete: SetNull)
export const deleteGroup = async (req, res) => {
    try {
        await prisma.group.delete({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Group deleted', code: 200 });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: 'Group not found', code: 404 });
        res.status(500).json({ message: err.message, code: 500 });
    }
};
