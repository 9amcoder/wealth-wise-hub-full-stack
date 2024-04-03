"use client";
import React, { ChangeEvent, useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Wallet2, CircleDollarSign, Target, ArrowDownToDot, ArrowUpFromDot, RefreshCcw, Wallet, Pencil } from "lucide-react";
import LineChartComponent from "@/components/ui/chart";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/dashboard/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoalUpdateForm from "@/components/dashboard/analytics/GoalUpdateForm";
import useGoalStore from "@/store/goalStore";
import useBalanceStore from "@/store/balanceStore";
import useChartDataStore from "@/store/chartDataStore";


interface AnalyticPageProps { }

const AnalyticPage: React.FC<AnalyticPageProps> = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [insights, setInsights] = useState("");
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
    originalBalanceLoading,
    balanceError,
    currentBalanceByUserId,
    originalBalanceByUserId,
    getOriginalBalanceByUserId,
    getCurrentBalanceByUserId,
  } = useBalanceStore();

  const {
    chartDataLoading,
    chartDataError,
    chartElements,
    getChartDataByUserId,
  } = useChartDataStore();

  async function setupChart() {
    const chart_periods = chartElements.map((e) => e.period);
    const chart_budgets = chartElements.map((e) => e.budgets);
    const chart_expenses = chartElements.map((e) => e.expenses);
    const chart_deposits = chartElements.map((e) => e.deposits);

    const data = {
      labels: chart_periods,
      datasets: [
        {
          label: "Balance",
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
          borderColor: "rgba(82,233, 125, 1)",
          borderDash: [5, 5],
          pointBorderColor: "green",
          tension: 0.1,
        },
      ],
    };

    setChartData(data);
    setChartLoading(false);
  }

  function redirectToInitialpage() {
    router.push(`initial`);
  }

    const balanceChange = useMemo(() => {
    // Ensure the balances is not null and not zero to avoid division by zero
    if (
      chartElements.length <= 0 || chartElements.at(-1)?.budgets == null || chartElements.at(-2)?.budgets == null || chartElements.at(-2)?.budgets == 0
    ) {
      return 0;
    }

    // Calculate the percentage change
    let previousMonthBudget = chartElements.at(-2)?.budgets;
    let recentMonthBudget = chartElements.at(-1)?.budgets;

    const balanceChange = ((recentMonthBudget - previousMonthBudget)/ previousMonthBudget) * 100;

    return balanceChange.toFixed(0);
  }, [chartElements]) as number; // The return type is number

  const expenseChange = useMemo(() => {
    // Ensure the balances is not null and not zero to avoid division by zero
    if (
      chartElements.length <= 0 || chartElements.at(-1)?.expenses == null || chartElements.at(-2)?.expenses == null || chartElements.at(-2)?.expenses == 0
    ) {
      return 0;
    }

    // Calculate the percentage change
    let previousMonthExpense = chartElements.at(-2)?.expenses;
    let recentMonthExpense = chartElements.at(-1)?.expenses;

    const expenseChange = ((recentMonthExpense - previousMonthExpense)/previousMonthExpense) * 100;

    return expenseChange.toFixed(0);
  }, [chartElements]) as number; // The return type is number

  // fetch data from the server (see app/api folder)
  useEffect(() => {
    const loadUserById = async () => {
      try {
        if (isLoaded) {
          await getOriginalBalanceByUserId(user?.id || "");
          await getGoalByUserId(user?.id || "");
          await getCurrentBalanceByUserId(user?.id || "");
          await getChartDataByUserId(user?.id || "");
          await setupChart();


        }
      } catch (error) {
        console.log(error);
      }
    };
    loadUserById();
  }, [getOriginalBalanceByUserId, getCurrentBalanceByUserId, getGoalByUserId, getChartDataByUserId, user?.id, isLoaded]);

  const handleRefresh = async () => {
    console.log("Refreshing...");
    await getCurrentBalanceByUserId(user?.id || "");
    await getChartDataByUserId(user?.id || "");
    await setupChart();
  };

  if (goalLoading ||
    originalBalanceLoading ||
    currentBalanceLoading ||
    chartDataLoading ||
    chartLoading
  ) {
    return <LoadingComponent />;
  } else if (!originalBalanceLoading && !goalLoading) {
    if (originalBalanceByUserId == null || goalByUserId == null) {
      return <>
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Balance and Goal have not been set</AlertDialogTitle>
              <AlertDialogDescription>
                Please setup balance and goal before using analytics feature.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={redirectToInitialpage}>Go</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    }
  }

  if (balanceError || goalError || chartDataError) {
    return <div>Error: {balanceError || goalError || chartDataError}</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-transparent">
          <Button onClick={handleRefresh} variant="outline" className="w-full text-black">
            {" "}
            <RefreshCcw size={15} className="mr-2" />
            Refresh
          </Button>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-r from-[#F6F0E2] to-[#FFF2CD]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium text-yellow-600 font-bold">
                  Total Balance
                </CardTitle>
                <Wallet size={20} className="text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-medium">
                  ${currentBalanceByUserId}
                </div>
                <p className="text-xs text-muted-foreground">
                  {/* {change}% changes from original balance */}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-[#FFF2F2] to-[#FFD9D9]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium text-red-600 font-bold">
                  Recent Month Expenses
                </CardTitle>
                <ArrowUpFromDot size={20} className="text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-medium">${chartElements.at(-1)?.expenses > 0 ? chartElements.at(-1)?.expenses : 0}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-[#F0FEF6] to-[#CBFFDD]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium text-green-600 font-bold">
                  Recent Month Deposit
                </CardTitle>
                <ArrowDownToDot size={20} className="text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-medium">${chartElements.at(-1)?.deposits > 0 ? chartElements.at(-1)?.deposits : 0}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-[#EEF5FF] to-[#CDE3FF]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium text-blue-600 font-bold">
                  Goal
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <button><Pencil size={20} className="text-blue-600"></Pencil></button>
                  </DialogTrigger>
                  <DialogContent>
                    <div>{goalByUserId && <GoalUpdateForm goal={goalByUserId} />}</div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-medium">${goalByUserId?.goalAmount}</div>
                <div className="text-2xl font-medium">{new Date(goalByUserId?.goalDate || Date.now()).toLocaleDateString("en-CA")}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <LineChartComponent
                  data={chartData}
                  options={{ maintainAspectRatio: false }}
                />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Insights</CardTitle>
              </CardHeader>
              <CardContent>
                  <div>
                    <ul className="list-disc">
                      {chartElements.length > 1 && <li>Balance has been {balanceChange == 0 ? 'unchanged' : balanceChange < 0 ? 'decreased' : 'increased' } at {Math.abs(balanceChange)}% from the previous month.</li>}
                      {chartElements.length > 1 && <li><li>Expense was {expenseChange == 0 ? 'unchanged from' : expenseChange < 0 ? `${Math.abs(expenseChange)}% lower than` : `${Math.abs(expenseChange)}% higher than` } the previous month.</li></li>}  
                      {chartElements.length <= 1 && <li>There is not enough information for insights.</li>}
                    </ul>
                  </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};


export default AnalyticPage;
