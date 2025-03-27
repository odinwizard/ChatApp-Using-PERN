import { Request, Response } from 'express';
import prisma from '../db/prisma.js';





export const sendMessage = async (req: Request, res: Response) => {
    try {
        const {message} = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        let conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, receiverId],
                },
            }
        });
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participantIds: {
                        set: [
                           senderId ,
                           receiverId
                        ],
                    },
                },
            });
        }
        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id,
            }
        });

        if(newMessage){
            conversation = await prisma.conversation.update({
                where:{
                    id: conversation.id
                },
                data:{
                    message: {
                        connect: {
                            id: newMessage.id,
                        },
                    },
                },
            });
        }

        //socket.io will go here


        res.status(201).json(newMessage);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error for sending message' });
        
    }
};

export const getMessage = async (req: Request, res: Response) => {
    try {
        const {id: userToChatId} = req.params;
        const senderId = req.user.id;
        const conversation = await prisma.conversation.findFirst({
            where: {
                participantIds:{
                    hasEvery: [senderId, userToChatId],
                },
            },
            include:{
                message: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            }
        });
        if (!conversation) {
            return res.status(400).json({ message: 'No messages yet' });
        }
        res.status(200).json(conversation.message);


    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error for getting message' });
    }
};

export const getUserForSidebar = async (req: Request, res: Response) => {
    try {
        const authUserId = req.user.id;
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: authUserId,
                },
            },
            select: {
                id: true,
                fullName: true,
                profileImage: true,
            },
        });
    res.status(200).json(users);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error for getting user for sidebar' });
        
    }
};