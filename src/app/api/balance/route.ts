import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId, balance } = req.body
        const result = await prisma.balanceHistory.create({
            data: {
                balance: balance,
                userId: userId
            }
        })
        return res.status(201).json(result)
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}