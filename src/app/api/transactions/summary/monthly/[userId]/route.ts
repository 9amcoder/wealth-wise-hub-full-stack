import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params } : { params: { userId: string } }
){
    try {
        const expenses = await prisma.$queryRaw`SELECT 
        CONCAT(Temp."Month",'-',Temp."Year") AS "period", SUM(Temp."Amount") AS "amount", 
        Temp."TransactionType" AS "type"
        FROM (
            SELECT date_part('month', "transactionDate") AS "Month", date_part('year',"transactionDate") AS "Year", "amount" as "Amount", "transactionType" AS "TransactionType"
            FROM "Transaction" 
            WHERE "userId" = ${params.userId}
        ) AS Temp 
        GROUP BY Temp."Month", Temp."Year", Temp."TransactionType" 
        ORDER BY Temp."Month", Temp."Year", Temp."TransactionType"`
        return Response.json(expenses);
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}