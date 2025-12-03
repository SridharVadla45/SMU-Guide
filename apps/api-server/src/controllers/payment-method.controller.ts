import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const listPaymentMethods = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const methods = await prisma.paymentMethod.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' }
        });
        res.json(methods);
    } catch (error) {
        console.error('List payment methods error:', error);
        res.status(500).json({
            message: 'Failed to fetch payment methods',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};

export const addPaymentMethod = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { brand, last4, expMonth, expYear } = req.body;

        // If this is the first method, make it default
        const count = await prisma.paymentMethod.count({ where: { userId } });
        const isDefault = count === 0;

        const method = await prisma.paymentMethod.create({
            data: {
                userId,
                brand,
                last4,
                expMonth,
                expYear,
                isDefault
            }
        });

        res.status(201).json(method);
    } catch (error) {
        console.error('Add payment method error:', error);
        res.status(500).json({
            message: 'Failed to add payment method',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};
