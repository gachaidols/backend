import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { nanoIdFormat } from "../lib/utils/nanoIdFormat.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const id = nanoIdFormat("uuid-");

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already in use", code: 400 });
    }

    const hashedPw = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({ data: { id, name, email, password: hashedPw } });
    res
      .status(201)
      .json({ message: "User created successfully", code: 201, data: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message, code: 500 });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found", code: 404 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password", code: 401 });
    }
    const token = jsonwebtoken.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res
      .status(200)
      .json({ message: "Login successful", code: 200, data: { id: user.id, name: user.name, email: user.email, role: user.role, lastPackDate: user.lastPackDate, token } });
  } catch (err) {
    res.status(500).json({ message: err.message, code: 500 });
  }
};