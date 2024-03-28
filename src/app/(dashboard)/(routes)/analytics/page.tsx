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
import useChartDataStore from "@/store/chartDataStore";

interface AnalyticPageProps { }

const AnalyticPage: React.FC<AnalyticPageProps> = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [insights, setInsights] = useState(null);
  const [chartData, setChartData] = useState({});
  const [chartLoading, setChartLoading] = useState(true);
  const [insightLoading, setInsightLoading] = useState(true);

  const {
    goalLoading,
    goalError,
    goalByUserId,
    getGoalByUserId
  } = useGoalStore();

  const {
    currentBalanceLoading,
    balanceError,
    currentBalanceByUserId,
    getCurrentBalanceByUserId
  } = useBalanceStore();

  const {
    chartDataLoading,
    chartDataError,
    chartElements,
    getChartDataByUserId
  } = useChartDataStore();

  // fetch data from the server (see app/api folder)
  useEffect(() => {
    const loadUserById = async () => {
      try {
        if (isLoaded) {
          await getCurrentBalanceByUserId(user?.id || "");
          await getGoalByUserId(user?.id || "");
          await getChartDataByUserId(user?.id || "");

            const chart_periods = chartElements.map(e => e.period);
            const chart_budgets = chartElements.map(e => e.budgets);
            const chart_expenses = chartElements.map(e => e.expenses);
            const chart_deposits = chartElements.map(e => e.deposits);

            const data = {
              labels: chart_periods,
              datasets: [
                {
                  label: "Budget",
                  data: chart_budgets,
                  fill: false,
                  borderColor: "rgba(52, 44, 255, 1)",
                  pointBorderColor: "blue",
                  tension: 0.1,
                },
                {
                  label: "Expenses",
                  data: chart_expenses,
                  fill: false,
                  borderColor: "rgba(235,74, 75, 1)",
                  borderDash: [5, 5],
                  pointBorderColor: "red",
                  tension: 0.1,
                },
                {
                  label: "Deposits",
                  data: chart_deposits,
                  fill: false,
                  borderColor: "rgba(191,214, 65, 1)",
                  borderDash: [5, 5],
                  pointBorderColor: "green",
                  tension: 0.1,
                },
              ],
            };

            setChartData(data);
            setChartLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadUserById();
  }, [getCurrentBalanceByUserId, getGoalByUserId, setChartData, setChartLoading, user?.id, isLoaded]);

  if (goalLoading || currentBalanceLoading || chartDataLoading || chartLoading) {
    return <LoadingComponent />;
  }

  if (goalError) {
    return <div> Error: {goalError}</div>;
  }

  if (balanceError) {
    return <div> Error: {balanceError}</div>;
  }

  if (chartDataError) {
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
                  <h3 className="pt-3 text-gray-10">${currentBalanceByUserId}</h3>
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