import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params } : { params: { userId: string } }
){
    try {
        const balance = await prisma.balanceHistory.findUnique({
            where: {
                userId: params.userId
            }
        });
        return Response.json(balance);
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}

export async function DELETE(
    request: Request,
    { params } : { params: { userId: string } }
){
    try {
        const balance = await prisma.balanceHistory.deleteMany({
            where: {
                userId: params.userId
            }
        });
        return Response.json(balance);
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}