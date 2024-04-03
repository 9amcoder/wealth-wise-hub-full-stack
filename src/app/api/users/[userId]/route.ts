import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params } : { params: { userId: string } }
){
    try {
        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: params.userId
            }
        });
        return Response.json(user);
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}