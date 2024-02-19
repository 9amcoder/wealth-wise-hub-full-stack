-- CreateTable
CREATE TABLE "DemoTable" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoTable_pkey" PRIMARY KEY ("id")
);
