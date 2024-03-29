import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const balanceSchema = z.object({
    balance: z.number(),
    userId: z.string()
});

export async function POST(req: Request, res: Response) {
    try {
        const payload = await req.json();

        const user = await prisma.user.findUnique({
            where: {
              clerkUserId: payload.userId,
            },
        });

        if (!user) {
            return Response.json(
                {
                    message: "User not found",
                },
                { 
                    status: 404 
                }
            );
        }

        const find_balance = await prisma.balanceHistory.findUnique({
            where: {
              userId: payload.userId,
            },
        });

        if (find_balance) {
            return Response.json(
                {
                    message: "Balance is already available",
                },
                { 
                    status: 409
                }
            );
        }

        const response = balanceSchema.safeParse(payload);

        if (!response.success) {
            const [errors] = response.error.errors;
            return Response.json(
              {
                message: "Invalid request",
                error: errors.message,
              },
              { status: 400 }
            );
        }

        const balance = await prisma.balanceHistory.create({
            data: {
                balance: payload.balance,
                userId: payload.userId
            }
        })
        return Response.json(balance);
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}

export async function PUT(req: Request, res: Response) {
    try {
        const payload = await req.json();

        const user = await prisma.user.findUnique({
            where: {
              clerkUserId: payload.userId,
            },
        });

        if (!user) {
            return Response.json(
                {
                    message: "User not found",
                },
                { 
                    status: 404 
                }
            );
        }

        const balance = await prisma.balanceHistory.findUnique({
            where: {
              userId: payload.userId,
            },
        });

        if (!balance) {
            return Response.json(
                {
                    message: "Balance not found",
                },
                { 
                    status: 404 
                }
            );
        }

        const response = balanceSchema.safeParse(payload);

        if (!response.success) {
            const [errors] = response.error.errors;
            return Response.json(
              {
                message: "Invalid request",
                error: errors.message,
              },
              { status: 400 }
            );
        }

        const updated_balance = await prisma.balanceHistory.update({
            where: {
                userId: payload.userId
            },
            data: {
                balance: payload.balance,
                updatedAt: new Date().toISOString()
            }
        })
        return Response.json(updated_balance);
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}
