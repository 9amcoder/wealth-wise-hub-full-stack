import { PrismaClient } from "@prisma/client";
import { encrypt } from "@/lib/utils";

const prisma = new PrismaClient();

// get transaction by id

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // check if transaction exists
  if (!params.id) {
    return Response.json(
      {
        message: "Invalid request",
        error: "Transaction id is required",
      },
      { status: 400 }
    );
  }

  // check if id is exist in database
  const transaction = await prisma.transaction.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!transaction) {
    return Response.json(
      {
        message: "Transaction not found",
      },
      { status: 404 }
    );
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: params.id,
      },
    });
    return Response.json(transaction);
  } catch (error) {
    console.error(error);
    return Response.error();
  }
}

// delete transaction by id

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // check if transaction exists
  if (!params.id) {
    return Response.json(
      {
        message: "Invalid request",
        error: "Transaction id is required",
      },
      { status: 400 }
    );
  }
  // check if record is exist in database
  const transaction = await prisma.transaction.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!transaction) {
    return Response.json(
      {
        message: "Transaction not found",
      },
      { status: 404 }
    );
  }
  
  try {
    const transaction = await prisma.transaction.delete({
      where: {
        id: params.id,
      },
    });
    return Response.json(transaction);
  } catch (error) {
    console.error(error);
    return Response.error();
  }
}
