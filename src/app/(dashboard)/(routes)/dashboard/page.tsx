"use client";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import LoadingComponent from "@/components/dashboard/Loading";
import { Transaction } from "@prisma/client";
import { Button } from "@/components/ui/button";
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
import {
  ArrowDownToDot,
  ArrowUpFromDot,
  RefreshCcw,
  Wallet,
  Wallet2, CircleDollarSign, Target, Banknote
} from "lucide-react";
import { useRouter } from "next/navigation";
import LineChartComponent from "@/components/ui/chart";
import useBalanceStore from "@/store/balanceStore";
import useTransactionStore from "@/store/transactionStore";
import useGoalStore from "@/store/goalStore";
import useChartDataStore from "@/store/chartDataStore";

const DashboardPage: FunctionComponent = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [chartData, setChartData] = useState({});
  const [chartLoading, setChartLoading] = useState(true);

  const {
    balanceError,
    currentBalanceByUserId,
    originalBalanceByUserId,
    currentBalanceLoading,
    originalBalanceLoading,
    getCurrentBalanceByUserId,
    getOriginalBalanceByUserId
  } = useBalanceStore();

  const {
    transactionsByUserId,
    transactionError,
    loading,
    getTransactionByUserId,
  } = useTransactionStore();

  const {
    goalLoading,
    goalError,
    goalByUserId,
    getGoalByUserId
  } = useGoalStore();

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


  useEffect(() => {
    const loadUserById = async () => {
      try {
        if (isLoaded) {
          await getOriginalBalanceByUserId(user?.id || "");
          await getGoalByUserId(user?.id || "");
          await getCurrentBalanceByUserId(user?.id || "");
          await getTransactionByUserId(user?.id || "");
          await getChartDataByUserId(user?.id || "");
          await setupChart();
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadUserById();
  }, [getGoalByUserId, getOriginalBalanceByUserId, getCurrentBalanceByUserId, getTransactionByUserId, user?.id, isLoaded,]);

  const expenses = useMemo(() => {
    if (transactionsByUserId === null) {
      return 0;
    }

    // Filter out the expenses
    const expenses = transactionsByUserId.filter(
      (transaction: Transaction) => transaction.transactionType === 0
    );

    // Calculate the total expenses
    const totalExpenses = expenses.reduce(
      (acc: number, transaction: Transaction) => acc + transaction.amount,
      0
    );

    return totalExpenses;
  }, [transactionsByUserId]);

  const income = useMemo(() => {
    if (transactionsByUserId === null) {
      return 0;
    }

    // Filter out the income
    const income = transactionsByUserId.filter(
      (transaction: Transaction) => transaction.transactionType === 1
    );

    // Calculate the total income
    const totalIncome = income.reduce(
      (acc: number, transaction: Transaction) => acc + transaction.amount,
      0
    );

    return totalIncome;
  }, [transactionsByUserId]);

  const totalTransactions = useMemo(() => {
    if (transactionsByUserId === null) {
      return 0;
    }

    return transactionsByUserId.length;
  }, [transactionsByUserId]);

  // const change = useMemo(() => {
  //   // Ensure the original balance is not null and not zero to avoid division by zero
  //   if (
  //     originalBalanceByUserId === null ||
  //     originalBalanceByUserId.balance === 0
  //   ) {
  //     return 0;
  //   }

  //   // Calculate the percentage change
  //   const change =
  //     ((currentBalanceByUserId - originalBalanceByUserId.balance) /
  //       originalBalanceByUserId.balance) *
  //     100;

  //   return change;
  // }, [currentBalanceByUserId, originalBalanceByUserId]) as number; // The return type is number

  const handleRefresh = async () => {
    console.log("Refreshing...");
    await getCurrentBalanceByUserId(user?.id || "");
    await getTransactionByUserId(user?.id || "");
    await getChartDataByUserId(user?.id || "");
    await setupChart();
  };

  if (currentBalanceLoading || loading || !isLoaded || originalBalanceLoading || chartDataLoading || chartLoading) {
    return <LoadingComponent />;
  } else if (!originalBalanceLoading && !goalLoading) {
    if (originalBalanceByUserId == null || goalByUserId == null) {
      return <>
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Balance and Goal have not been set</AlertDialogTitle>
              <AlertDialogDescription>
                Please setup balance and goal before begin your journey.
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

  if (balanceError || transactionError || chartDataError) {
    return <><div>Error: {balanceError || transactionError || chartDataError}</div></>;
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gray-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Balance
                </CardTitle>
                <Wallet size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${currentBalanceByUserId}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-400 font-bold">
                  Total Expenses
                </CardTitle>
                <CircleDollarSign size={20} className="text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${expenses}</div>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-400 font-bold">
                  Total Income/Deposit
                </CardTitle>
                <Banknote size={20} className="text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${income}</div>
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
                <CardTitle>Transactions</CardTitle>
                <CardDescription>Total: {totalTransactions}</CardDescription>
              </CardHeader>
              <CardContent>
                {(transactionsByUserId || []).map(
                  (transaction: Transaction) => (
                    <div
                      key={transaction.id}
                      className={`flex flex-row justify-between ${transaction.transactionType === 0
                          ? "text-red-500"
                          : "text-green-500"
                        }`}
                    >
                      <div className="text-sm">{transaction.title}</div>
                      <div className="text-sm">${transaction.amount}</div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
