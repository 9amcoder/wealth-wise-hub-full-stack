import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const transactionSchema = z.object({
  userId: z.string(),
  title: z.string(),
  transactionDate: z.string().optional(),
  amount: z.number(),
});

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany();
    return Response.json(transactions);
  } catch (error) {
    console.error(error);
    return Response.error();
  }
}

export async function POST(req: Request, res: Response) {
  try {
    const payload = await req.json();
    // if user not fond from prisma then return 404
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

    const transaction = await prisma.transaction.update({
      where: {
        id: payload.id,
      },
      data: {
        title: payload.title,
        transactionDate: payload.transactionDate,
        amount: payload.amount,
      },
    });
    return Response.json(transaction);
  } catch (error) {
    console.error(error);
    return Response.error();
  }
}
