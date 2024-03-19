import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params } : { params: { userId: string } }
){
    try {
        const expenses = await prisma.$queryRaw`SELECT CONCAT(Temp."Month",'-',Temp."Year") AS "TransactionPeriod", SUM(Temp."Expenses") AS "TotalExpense" FROM (SELECT date_part('month', "transactionDate") AS "Month", date_part('year',"transactionDate") AS "Year", "amount" AS "Expenses" FROM "Transaction" WHERE "userId" = ${params.userId}) AS Temp GROUP BY Temp."Month", Temp."Year" ORDER BY Temp."Month", Temp."Year"`
        return Response.json(expenses);
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}