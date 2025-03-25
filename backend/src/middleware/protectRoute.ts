import env from 'dotenv';
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../db/prisma.js";
env.config();

interface DecodedToken extends JwtPayload {
    userId: string;
}

declare global {
    namespace Express {
        export interface Request {
            user: {
                id:string;
            }
        }
    }
}

const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Middleware started"); // Debug log
        const token = req.cookies.jwt;
        if (!token) {
            console.log("No token provided"); // Debug log
            return res.status(401).json(
                {error: "Unauthorized - no token provided"}
            );
        }
        console.log("Token found:", token); // Debug log
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        if (!decoded) {
            console.log("Invalid token"); // Debug log
            return res.status(401).json(
                {error: "Unauthorized - invalid token"}
            );
        }
        console.log("Token decoded:", decoded); // Debug log
        const user = await prisma.user.findUnique({
            where: {id: decoded.userId}, 
            select: {id: true , username: true, fullName: true, profileImage: true},
        });
        if (!user) {
            console.log("User not found"); // Debug log
            return res.status(404).json(
                {error: "User not found"}
            );
        }
        console.log("User found:", user); // Debug log
        req.user = user;
        console.log("Calling next()"); // Debug log
        next();
    } catch (error: any) {
        console.log("Error in middleware:", error); // Debug log
        return res.status(500).json(
            {error: "Internal server error from middleware"}
        );
    }
};

export default protectRoute;