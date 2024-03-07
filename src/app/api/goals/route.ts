import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { goalAmount, goalDate, userId } = req.body
        const result = await prisma.goalHistory.create({
            data: {
                goalAmount: goalAmount,
                goalDate: goalDate,
                userId: userId
            }
        })
        return res.status(201).json(result)
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}