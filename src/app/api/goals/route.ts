import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const goalSchema = z.object({
    goalName: z.string(),
    goalAmount: z.number(),
    goalDate: z.date(),
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

        const goal = await prisma.goalHistory.create({
            data: {
                goalName: payload.goalName,
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