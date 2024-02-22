import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(){
    try {
        const transactions = await prisma.transaction.findMany();
        return NextResponse.json(transactions);
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}