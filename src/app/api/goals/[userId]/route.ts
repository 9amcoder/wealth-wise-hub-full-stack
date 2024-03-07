import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params } : { params: { userId: string } }
){
    try {
        const goal = await prisma.goalHistory.findFirst({
            where: {
                userId: params.userId
            }
        });
        return Response.json(goal);
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}