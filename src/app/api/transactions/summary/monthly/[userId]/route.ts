import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params } : { params: { userId: string } }
){
    try {
        const balance = await prisma.balanceHistory.findUnique({
            where: {
              userId: params.userId,
            },
          });
          if (!balance) {
            return Response.json(
              {
                message: "User not found",
              },
              { status: 404 }
            );
        }

        const expenses = await prisma.$queryRaw`SELECT 
        CONCAT(Temp."Month",'-',Temp."Year") AS "period", SUM(Temp."Amount") AS "amount", 
        Temp."TransactionType" AS "type"
        FROM (
            SELECT "transactionDate", date_part('month', "transactionDate") AS "Month", date_part('year',"transactionDate") AS "Year", "amount" as "Amount", "transactionType" AS "TransactionType"
            FROM "Transaction" 
            WHERE "userId" = ${params.userId} AND "transactionDate" >= ${balance.createdAt}
            ORDER BY "transactionDate" DESC
        ) AS Temp 
        GROUP BY Temp."Year", Temp."Month", Temp."TransactionType"
        ORDER BY Temp."Year" ASC, Temp."Month" ASC`
        return Response.json(expenses);
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}