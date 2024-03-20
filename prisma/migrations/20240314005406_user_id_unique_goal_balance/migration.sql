/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `BalanceHistory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `GoalHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BalanceHistory_userId_key" ON "BalanceHistory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GoalHistory_userId_key" ON "GoalHistory"("userId");
