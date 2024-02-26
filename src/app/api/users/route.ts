import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(){
    try {
        const users = await prisma.user.findMany();
        return Response.json(users);
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}