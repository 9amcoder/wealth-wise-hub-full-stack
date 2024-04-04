import { PrismaClient } from "@prisma/client";
import { decryptTransaction } from "@/lib/data-encryption";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params } : { params: { userId: string } }
){
    try {
        // Check if userId is provided
        if (!params.userId) {
            return Response.json({ message: 'No user id' });
        }

        const transactions = await prisma.transaction.findMany({
            where: {
                userId: params.userId
            },
            orderBy: {
                transactionDate: 'desc'
            }
        });

        // Check if transactions are found for the given user
        if (transactions.length === 0) {
            return Response.json(transactions);
        }
    
        const decryptedTransaction = transactions.map((element: { title: string, [key: string]: any }) => {
            let newTitle: string = decryptTransaction(element.title);
            return {
                ...element,
                title: newTitle,
            };
        });
    
        return Response.json(decryptedTransaction);
    } catch (error) {
        console.error(error);
        return Response.error();
    }
}
