import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const goalSchema = z.object({
    goalAmount: z.number(),
    goalDate: z.string().datetime(),
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

        const find_goal = await prisma.goalHistory.findUnique({
            where: {
              userId: payload.userId,
            },
        });

        if (find_goal) {
            return Response.json(
                {
                    message: "Goal is already available",
                },
                { 
                    status: 409
                }
            );
        }

        const response = goalSchema.safeParse(payload);

        if (!response.success) {
            const [errors] = response.error.errors;
            console.log(errors)
            return Response.json(
              {
                message: "Invalid request",
                error: errors.message,
              },
              { status: 400 }
            );
        }

        const goal = await prisma.goalHistory.create({
            data: {
                goalAmount: payload.goalAmount,
                goalDate: payload.goalDate,
                userId: payload.userId
            }
        })

        return Response.json(goal);
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

        const goal = await prisma.balanceHistory.findUnique({
            where: {
              userId: payload.userId,
            },
        });

        if (!goal) {
            return Response.json(
                {
                    message: "Goal not found",
                },
                { 
                    status: 404 
                }
            );
        }

        const response = goalSchema.safeParse(payload);

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

        const updated_balance = await prisma.goalHistory.update({
            where: {
                userId: payload.userId
            },
            data: {
                goalAmount: payload.goalAmount,
                goalDate: payload.goalDate,
                updatedAt: new Date().toISOString()
            }
        })
        return Response.json(updated_balance);
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}
