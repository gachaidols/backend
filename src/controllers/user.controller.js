import prisma from '../config/prisma.js';

// GET /users/me
export const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, name: true, email: true, role: true, lastPackDate: true, createdAt: true },
        });
        if (!user) return res.status(404).json({ message: 'User not found', code: 404 });
        res.status(200).json({ message: 'OK', code: 200, data: user });
    } catch (err) {
        res.status(500).json({ message: err.message, code: 500 });
    }
};

// PUT /users/me/lastPackDate
export const updateLastPackDate = async (req, res) => {
    try {
        const { date } = req.body;
        const user = await prisma.user.update({
            where: { id: req.userId },
            data: { lastPackDate: date },
            select: { id: true, lastPackDate: true },
        });
        res.status(200).json({ message: 'Date updated', code: 200, data: user });
    } catch (err) {
        res.status(500).json({ message: err.message, code: 500 });
    }
};

// PUT /users/me/avatar
export const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded', code: 400 });
        }

        const avatarUrl = req.file.path; // Cloudinary URL

        const user = await prisma.user.update({
            where: { id: req.userId },
            data: { avatar: avatarUrl },
            select: { id: true, name: true, email: true, role: true, avatar: true },
        });

        res.status(200).json({ message: 'Avatar updated successfully', code: 200, data: user });
    } catch (err) {
        res.status(500).json({ message: err.message, code: 500 });
    }
};

// GET /users
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ message: 'OK', code: 200, data: users });
    } catch (err) {
        res.status(500).json({ message: err.message, code: 500 });
    }
};

// GET /users/:id
export const getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        if (!user) return res.status(404).json({ message: 'User not found', code: 404 });
        res.status(200).json({ message: 'OK', code: 200, data: user });
    } catch (err) {
        res.status(500).json({ message: err.message, code: 500 });
    }
};

// PUT /users/:id/role — toggle between user <-> admin
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body; // 'user' | 'admin'
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { role },
            select: { id: true, name: true, email: true, role: true },
        });
        res.status(200).json({ message: 'Role updated', code: 200, data: user });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: 'User not found', code: 404 });
        res.status(500).json({ message: err.message, code: 500 });
    }
};

// DELETE /users/:id
export const deleteUser = async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: req.params.id } });
        res.status(200).json({ message: 'User deleted', code: 200 });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: 'User not found', code: 404 });
        res.status(500).json({ message: err.message, code: 500 });
    }
};
