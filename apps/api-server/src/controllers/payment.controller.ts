import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { Errors } from "../errors/ApiError.js";

// Mock Stripe Secret Key (In a real app, this would be in .env)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_mock_key";

export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount, currency = "usd", appointmentId } = req.body;
        const userId = (req as any).user?.id;

        if (!userId) {
            throw Errors.Unauthorized("User not authenticated");
        }

        if (!amount) {
            throw Errors.BadRequest("Amount is required");
        }

        // In a real app, you would call Stripe API here:
        // const paymentIntent = await stripe.paymentIntents.create({
        //   amount: amount * 100, // cents
        //   currency,
        //   metadata: { userId, appointmentId }
        // });

        // Mocking the response
        const clientSecret = `pi_mock_${Math.random().toString(36).substring(7)}_secret_${Math.random().toString(36).substring(7)}`;
        const paymentIntentId = `pi_mock_${Math.random().toString(36).substring(7)}`;

        // Optionally create a pending payment record here if you want to track attempts
        // For this demo, we'll create the record upon confirmation or here as PENDING

        res.json({
            success: true,
            data: {
                clientSecret,
                paymentIntentId
            }
        });

    } catch (error) {
        next(error);
    }
};

export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { paymentIntentId, appointmentId, amount } = req.body;
        const userId = (req as any).user?.id;

        if (!userId) {
            throw Errors.Unauthorized("User not authenticated");
        }

        // In a real app, you would verify the payment intent status with Stripe
        // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        // if (paymentIntent.status !== 'succeeded') throw ...

        // Create the payment record in our DB
        const payment = await prisma.payment.create({
            data: {
                userId,
                amount: parseFloat(amount),
                currency: "usd",
                status: "COMPLETED", // Assuming success for this mock
                stripePaymentId: paymentIntentId,
                appointmentId: appointmentId ? parseInt(appointmentId) : undefined,
            }
        });

        res.json({
            success: true,
            data: payment
        });

    } catch (error) {
        next(error);
    }
};

export const getUserPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            throw Errors.Unauthorized("User not authenticated");
        }

        const payments = await prisma.payment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                appointment: {
                    include: {
                        mentor: {
                            select: { name: true }
                        }
                    }
                }
            }
        });

        res.json({
            success: true,
            data: payments
        });

    } catch (error) {
        next(error);
    }
};
