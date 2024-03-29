/*
  Warnings:

  - You are about to drop the column `transactionType` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "transactionType" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "transactionType";
