-- DropForeignKey
ALTER TABLE "BalanceHistory" DROP CONSTRAINT "BalanceHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "GoalHistory" DROP CONSTRAINT "GoalHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "InsightHistory" DROP CONSTRAINT "InsightHistory_balanceId_fkey";

-- DropForeignKey
ALTER TABLE "InsightHistory" DROP CONSTRAINT "InsightHistory_expenseId_fkey";

-- DropForeignKey
ALTER TABLE "InsightHistory" DROP CONSTRAINT "InsightHistory_goalId_fkey";

-- DropForeignKey
ALTER TABLE "InsightHistory" DROP CONSTRAINT "InsightHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalHistory" ADD CONSTRAINT "GoalHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BalanceHistory" ADD CONSTRAINT "BalanceHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightHistory" ADD CONSTRAINT "InsightHistory_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "BalanceHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightHistory" ADD CONSTRAINT "InsightHistory_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "GoalHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightHistory" ADD CONSTRAINT "InsightHistory_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightHistory" ADD CONSTRAINT "InsightHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;
