import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import prisma from '../db/prisma.js';

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullName, username, password , confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        const user = await prisma.user.findUnique({where: {username}});
        if (user) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const login = async (req: Request, res: Response) => {};
export const logout = async (req: Request, res: Response) => {};