'use client'
import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Wallet2, CircleDollarSign, Target } from "lucide-react";
import LineChartComponent from "@/components/ui/chart";
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import LoadingComponent from "@/components/dashboard/Loading";
import GoalUpdateForm from "@/components/dashboard/analytics/GoalUpdateForm";
import useGoalStore from "@/store/goalStore";
import useBalanceStore from "@/store/balanceStore";
import useTransactionStore from "@/store/transactionStore";
import useExpenseStore from "@/store/expenseStore";

interface AnalyticPageProps { }

const AnalyticPage: React.FC<AnalyticPageProps> = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [insights, setInsights] = useState(null);
  const [balance, setBalance] = useState();
  const [chartData, setChartData] = useState({});
  const [chartDataLoading, setChartDataLoading] = useState(true);
  const [insightLoading, setInsightLoading] = useState(true);

  const {
    goalLoading,
    goalError,
    goalByUserId,
    getGoalByUserId
  } = useGoalStore();

  const {
    balanceLoading,
    balanceError,
    originalBalanceByUserId,
    getOriginalBalanceByUserId
  } = useBalanceStore();

  const {
    expenseLoading,
    expenseError,
    expensesByUserId,
    getExpensesByUserId
  } = useExpenseStore();

  const {
    loading,
    transactionError,
    transactionsByUserId,
    getTransactionByUserId
  } = useTransactionStore();

  // fetch data from the server (see app/api folder)
  useEffect(() => {
    const loadUserById = async () => {
      try {
        if (isLoaded) {
          await getTransactionByUserId(user?.id || "");
          await getGoalByUserId(user?.id || "");
          await getOriginalBalanceByUserId(user?.id || "");
          await getExpensesByUserId(user?.id || "");

          console.log("Begin calculation");
          console.log("original Balance: " + originalBalanceByUserId);
          console.log("expenses: " + expensesByUserId);
          if (originalBalanceByUserId && expensesByUserId) {
            let rawBalanceDate = new Date(originalBalanceByUserId.createdAt);
            let balanceDate = rawBalanceDate.getMonth() + `-` + rawBalanceDate.getFullYear();

            console.log("Get expense periods");
            let periods = [];
            let budget = [];

            let expense_periods = expensesByUserId.map(expense => expense.TransactionPeriod);

            console.log("Get new balance");
            let new_budget = originalBalanceByUserId.balance;
            budget.push(new_budget);

            for (var i = 0; i < expensesByUserId.length; i++) {
              new_budget = new_budget - expensesByUserId[i].TotalExpense;

              if (balanceDate !== expense_periods[i]) {
                budget.push(new_budget);
              }
            }

            periods.push(...expense_periods);
            let expenses = expensesByUserId.map(expense => expense.TotalExpense);

            console.log("Set up charts");
            const chartData = {
              labels: periods,
              datasets: [
                {
                  label: "Budget",
                  data: budget,
                  fill: false,
                  borderColor: "rgba(75, 192, 192, 1)",
                  pointBorderColor: "blue",
                  tension: 0.1,
                },
                {
                  label: "Expenses",
                  data: expenses,
                  fill: false,
                  borderColor: "rgba(45, 102, 92, 1)",
                  borderDash: [5, 5],
                  pointBorderColor: "green",
                  tension: 0.1,
                },
              ],
            };

            const balance = budget[budget.length - 1];
            setBalance(balance);

            setChartData(chartData);
            setChartDataLoading(false);
            console.log("Begin End calculation");
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadUserById();
  }, [getTransactionByUserId, getGoalByUserId, getOriginalBalanceByUserId, getExpensesByUserId, setBalance, setChartData, setChartDataLoading, user?.id, isLoaded]);

  if (loading || goalLoading || balanceLoading || expenseLoading || chartDataLoading) {
    return <LoadingComponent />;
  }

  if (goalError) {
    return <div> Error: {goalError}</div>;
  }

  if (balanceError) {
    return <div> Error: {balanceError}</div>;
  }

  async function getInsights() {
    setInsightLoading(false);
    setInsights("Generated Insights");
  }

  return (
    <div className="p-3 grid gap-2 m-[2]">
      <Card>
        <div className="p-2 grid grid-cols-2 divide-x divide-gray-300">
          <CardContent>
            <div className="col-span-1 ">
              <div className="m-3 grid grid-cols-3 gap-1">
                <div className="col-span-1 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#F5DA91] to-[#FFCC99]">
                  <Wallet2
                    className="p-2 align-items: flex-start"
                    size={50}
                    color="#804908"
                  />
                </div>
                <div className="p-3 col-span-1 align-items: center flex flex-col">
                  <h2>Balance</h2>
                  <h3 className="pt-3 text-gray-10">${balance}</h3>
                </div>
              </div>
            </div>
          </CardContent>
          <CardContent>
            <div className="col-span-1 ">
              <div className="m-3 grid grid-cols-3 gap-1">
                <div className="col-span-1 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#ffe6e6] to-[#ff9999]">
                  <Target
                    className="p-2 align-items: flex-start"
                    size={50}
                    color="#ff4d4d"
                  />
                </div>
                <div className="p-3 col-span-1 align-items: center flex flex-col">
                  <h2>Goals</h2>
                  <h3 className="text-gray-10">${goalByUserId?.goalAmount}</h3>
                  <h2 className="pt-3 text-gray-10">Target Date</h2>
                  <h3 className="text-gray-10">{new Date(goalByUserId?.goalDate).toLocaleDateString("en-CA")}</h3>
                </div>
                <div className="col-span-1 flex flex-row-reverse">
                  <div className="grid gap-4 py-4">
                    <GoalUpdateForm goal={goalByUserId} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <div className="p-2 grid grid-cols-2 divide-x divide-gray-300">
          <CardContent>
            <div className="col-span-1">
              <LineChartComponent data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </CardContent>
          <CardContent>
            <div className="col-span-1 ">
              <div className="grid gap-4 items-center justify-center">
                {
                  (insightLoading) 
                  ? < Button className="text-[#282458] w-[100px]" variant="outline" type="button" onClick={async () => { await getInsights() }}>More</Button> 
                  : (!insights) 
                    ? <LoadingComponent /> 
                    : <div>{insights}</div>
                }
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

export default AnalyticPage;
