import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(){
    try {
        const transactions = await prisma.transaction.findMany();
        return Response.json(transactions);
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}