import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { Errors } from "../errors/ApiError.js";

export const userController = {
    updateProfile: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = Number((req as any).user.id);
            console.log('Update Profile Request:', { userId, body: req.body, file: req.file });
            const { name, bio, department } = req.body;

            const updateData: any = {};
            if (name) updateData.name = name;
            if (bio !== undefined) updateData.bio = bio; // Allow empty string to clear
            if (department !== undefined) updateData.department = department; // Allow empty string to clear

            if (req.file) {
                updateData.avatarUrl = `/uploads/avatars/${req.file.filename}`;
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    department: true,
                    bio: true,
                    avatarUrl: true,
                    createdAt: true,
                }
            });

            res.status(200).json({
                success: true,
                data: updatedUser,
            });
        } catch (err) {
            next(err);
        }
    },
};
