import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params } : { params: { userId: string } }
){
    try {
        const transactions = await prisma.user.findMany({
            where: {
                clerkUserId: params.userId
            }
        });
        return Response.json(transactions);
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}