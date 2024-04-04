import { PrismaClient } from "@prisma/client";
import { decryptTransaction } from "@/lib/data-encryption";

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

        const decryptedTransaction = [];

        transactions.forEach(element => {
            let newTitle = decryptTransaction(element.title);
            const transaction = {
                ...element,
                title: newTitle,
            };

            decryptedTransaction.push(transaction);
        });

        return Response.json(decryptedTransaction);
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}
