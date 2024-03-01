/*
  Warnings:

  - You are about to drop the column `balance` on the `InsightHistory` table. All the data in the column will be lost.
  - You are about to drop the column `expense` on the `InsightHistory` table. All the data in the column will be lost.
  - You are about to drop the column `goal` on the `InsightHistory` table. All the data in the column will be lost.
  - Added the required column `balanceId` to the `InsightHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expenseId` to the `InsightHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goalId` to the `InsightHistory` table without a default value. This is not possible if the table is not empty.
  - Made the column `recommendationHistoryId` on table `InsightHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "InsightHistory" DROP CONSTRAINT "InsightHistory_recommendationHistoryId_fkey";

-- DropIndex
DROP INDEX "Transaction_title_key";

-- AlterTable
ALTER TABLE "BalanceHistory" ALTER COLUMN "balance" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "GoalHistory" ALTER COLUMN "goalName" SET DEFAULT 'Untitled',
ALTER COLUMN "goalAmount" SET DEFAULT 0,
ALTER COLUMN "goalDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "InsightHistory" DROP COLUMN "balance",
DROP COLUMN "expense",
DROP COLUMN "goal",
ADD COLUMN     "balanceId" TEXT NOT NULL,
ADD COLUMN     "expenseId" TEXT NOT NULL,
ADD COLUMN     "goalId" TEXT NOT NULL,
ALTER COLUMN "recommendationHistoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "title" SET DEFAULT 'Untitled';

-- AddForeignKey
ALTER TABLE "InsightHistory" ADD CONSTRAINT "InsightHistory_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "BalanceHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightHistory" ADD CONSTRAINT "InsightHistory_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "GoalHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightHistory" ADD CONSTRAINT "InsightHistory_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightHistory" ADD CONSTRAINT "InsightHistory_recommendationHistoryId_fkey" FOREIGN KEY ("recommendationHistoryId") REFERENCES "RecommendationHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
