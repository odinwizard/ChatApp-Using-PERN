import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import prisma from '../db/prisma.js';
import generateToken from '../utils/generateToken.js';

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

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = await prisma.user.create({
            data:{
                fullName,
                username,
                password: hashedPassword,
                gender,
                profileImage: gender === "male" ? boyProfilePic : girlProfilePic,
            }
        });
        if(newUser){
            generateToken(newUser.id, res);
            res.status(201).json({ 
                id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                profileImage: newUser.profileImage,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error for signup' });
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({where: {username}});
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        generateToken(user.id, res);
        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profileImage: user.profileImage,
        });
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal server error for login' });
    }
};


export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie('jwt', '', {maxAge: 0});
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal server error for logout' });  
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({where: {id: req.user.id}});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profileImage: user.profileImage,
        });
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal server error for getMe' });
    }
};