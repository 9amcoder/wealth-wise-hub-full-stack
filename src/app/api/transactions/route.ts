import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { encryptTransaction, decryptTransaction } from "@/lib/security";
import { title } from "process";

const prisma = new PrismaClient();

const transactionSchema = z.object({
  userId: z.string(),
  title: z.string(),
  transactionDate: z.string().optional(),
  amount: z.number(),
  transactionType: z.number(),
});

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany();
    
    const newTransactions = [];

    transactions.forEach(element => {
      console.log("Before: " + element.title);
      const transaction = {
        ...element,
        title: decryptTransaction(element.title),
      };
      console.log("After: " + element.title);

      newTransactions.push(transaction);
    });

    console.log(newTransactions);

    return Response.json(transactions);
  } catch (error) {
    console.error(error);
    return Response.error();
  }
}

export async function POST(req: Request, res: Response) {
  try {
    const payload = await req.json();

    // encrypt transaction information
    let title = payload["title"];
    payload["title"] = encryptTransaction(title);


    // if user not found from prisma then return 404
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: payload.userId,
      },
    });
    if (!user) {
      return Response.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const response = transactionSchema.safeParse(payload);

    if (!response.success) {
      const [errors] = response.error.errors;
      return Response.json(
        {
          message: "Invalid request",
          error: errors.message,
        },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: payload.userId,
        title: payload.title,
        transactionDate: payload.transactionDate,
        amount: payload.amount,
        transactionType: payload.transactionType,
      },
    });
    return Response.json(transaction);
  } catch (error) {
    console.error(error);
    return Response.error();
  }
}

// update 
export async function PUT(req: Request, res: Response) {
  try {
    const payload = await req.json();
    const response = transactionSchema.safeParse(payload);

    if (!response.success) {
      const [errors] = response.error.errors;
      return Response.json(
        {
          message: "Invalid request",
          error: errors.message,
        },
        { status: 400 }
      );
    }
    // if id is null or undefined then return 400
    if (!payload.id) {
      return Response.json(
        {
          message: "Invalid request",
          error: "id is required",
        },
        { status: 400 }
      );
    }
    
    //if transaction not found from prisma then return 404
    const findTransaction = await prisma.transaction.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!findTransaction) {
      return Response.json(
        {
          message: "Transaction not found",
        },
        { status: 404 }
      );
    }


    const transaction = await prisma.transaction.update({
      where: {
        id: payload.id,
      },
      data: {
        title: payload.title,
        transactionDate: payload.transactionDate,
        amount: payload.amount,
        transactionType: payload.transactionType,
      },
    });
    return Response.json(transaction);
  } catch (error) {
    console.error(error);
    return Response.error();
  }
}
