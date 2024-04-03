import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params } : { params: { userId: string } }
){
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: params.userId
            },
            orderBy: {
                transactionDate: 'desc'
            }
        });
        return Response.json(transactions);
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}
