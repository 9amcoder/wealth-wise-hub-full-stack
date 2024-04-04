"use client";
import React, {
  ChangeEvent,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
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
  DialogClose,
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
import {
  Wallet2,
  CircleDollarSign,
  Target,
  ArrowDownToDot,
  ArrowUpFromDot,
  RefreshCcw,
  Wallet,
  Pencil,
  Banknote
} from "lucide-react";
import LineChartComponent from "@/components/ui/chart";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/dashboard/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoalUpdateForm from "@/components/dashboard/analytics/GoalUpdateForm";
import useGoalStore from "@/store/goalStore";
import useBalanceStore from "@/store/balanceStore";
import useChartDataStore from "@/store/chartDataStore";

interface AnalyticPageProps {}

const AnalyticPage: React.FC<AnalyticPageProps> = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [initalSetupLoading, setInitalSetupLoading] = useState(true);
  const [showInitalAlert, setShowInitalAlert] = useState(false);
  const [chartData, setChartData] = useState({});
  const [chartLoading, setChartLoading] = useState(true);

  const { goalLoading, goalError, goalByUserId, getGoalByUserId } =
    useGoalStore();

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

  const setupChart = useCallback(async () => {
    const data = {
      labels: chartElements?.periods,
      datasets: [
        {
          label: "Balance",
          data: chartElements?.budgets,
          fill: false,
          borderColor: "rgba(52, 44, 255, 1)",
          pointBorderColor: "blue",
          tension: 0.1,
        },
        {
          label: "Expenses",
          data: chartElements?.expenses,
          fill: false,
          borderColor: "rgba(235,74, 75, 1)",
          borderDash: [5, 5],
          pointBorderColor: "red",
          tension: 0.1,
        },
        {
          label: "Deposits",
          data: chartElements?.deposits,
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
  }, [chartElements]);

  function redirectToInitialpage() {
    router.push(`initial`);
  }

  const balanceChange = useMemo(() => {
    // Ensure the balances is not null and not zero to avoid division by zero
    if (
      (chartElements?.budgets && chartElements?.budgets?.length <= 0) || chartElements?.budgets?.at(-1) == null || chartElements?.budgets?.at(-2) == null || chartElements?.budgets?.at(-2) == 0
    ) {
      return 0;
    }

    // Calculate the percentage change
    let previousMonthBudget = parseFloat(chartElements.budgets.at(-2)!.toFixed(5));
    let recentMonthBudget = parseFloat(chartElements.budgets.at(-1)!.toFixed(5));

    // Check if recentMonthBudget and previousMonthBudget are not undefined before performing the calculation
    if (recentMonthBudget !== undefined && previousMonthBudget !== undefined) {
      let isChange = 'No change';

      if (recentMonthBudget < previousMonthBudget) {
        isChange = 'Decreased';
      } else if (recentMonthBudget > previousMonthBudget) {
        isChange = 'Increased';
      }

      const bchange = (Math.abs(previousMonthBudget - recentMonthBudget)/ Math.abs(previousMonthBudget)) * 100;

      const balanceChange = {change: isChange, percentage: Math.round(bchange)}
      return balanceChange;
    }

    return 0;
  }, [chartElements]) as {change: string; percentage: number}; // The return type is custom change

  const expenseChange = useMemo(() => {
    // Ensure the balances is not null and not zero to avoid division by zero
    if (
      (chartElements?.expenses && chartElements?.expenses?.length <= 0 )|| chartElements?.expenses?.at(-1) == null || chartElements?.expenses?.at(-2) == null || chartElements?.expenses?.at(-2) == 0
    ) {
      return 0;
    }

    // Calculate the percentage change
    let previousMonthExpense: number = parseFloat(chartElements.expenses.at(-2)!.toFixed(5));
    let recentMonthExpense: number = parseFloat(chartElements.expenses.at(-1)!.toFixed(5));

    // Check if recentMonthExpense and previousMonthExpense are not undefined before performing the calculation
    if (
      recentMonthExpense !== undefined &&
      previousMonthExpense !== undefined
    ) {
      let isChange = 'No change';

      if (recentMonthExpense < previousMonthExpense) {
        isChange = 'Decreased';
      } else if (recentMonthExpense > previousMonthExpense) {
        isChange = 'Increased';
      }

      const echange = (Math.abs(previousMonthExpense - recentMonthExpense)/ Math.abs(previousMonthExpense)) * 100;

      const expenseChange = {change: isChange, percentage: Math.round(echange)}
      return expenseChange;
    }

    return 0;
  }, [chartElements]) as {change: string; percentage: number}; // The return type is custom change 

  const depositChange = useMemo(() => {
    // Ensure the balances is not null and not zero to avoid division by zero
    if (
      (chartElements?.deposits && chartElements?.deposits?.length <= 0 )|| chartElements?.deposits?.at(-1) == null || chartElements?.deposits?.at(-2) == null || chartElements?.deposits?.at(-2) == 0
    ) {
      return 0;
    }

    // Calculate the percentage change
    let previousMonthDeposit = parseFloat(chartElements.deposits.at(-2)!.toFixed(5));
    let recentMonthDeposit = parseFloat(chartElements.deposits.at(-1)!.toFixed(5));

    // Check if recentMonthDeposit and previousMonthDeposit are not undefined before performing the calculation
    if (
      recentMonthDeposit !== undefined &&
      previousMonthDeposit !== undefined
    ) {
      let isChange = 'No change';

      if (recentMonthDeposit < previousMonthDeposit) {
        isChange = 'Decreased';
      } else if (recentMonthDeposit > previousMonthDeposit) {
        isChange = 'Increased';
      }

      const dchange = (Math.abs(previousMonthDeposit - recentMonthDeposit)/ Math.abs(previousMonthDeposit)) * 100;

      const depositChange = {change: isChange, percentage: Math.round(dchange)}
      return depositChange;
    }

  return 0;
}, [chartElements]) as {change: string; percentage: number}; // The return type is custom change


  // This useEffect is for loading user data
  useEffect(() => {
    const loadInitalSetup = async () => {
      try {
        if (isLoaded) {
          await getOriginalBalanceByUserId(user?.id || "");
          await getGoalByUserId(user?.id || "");
          setInitalSetupLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadInitalSetup();
}, [getGoalByUserId, getOriginalBalanceByUserId, user?.id, isLoaded]);

// This useEffect is for loading user data
useEffect(() => {
const loadUserById = async () => {
  try {
    if (!initalSetupLoading && !goalLoading && !originalBalanceLoading) {
      if (goalByUserId && originalBalanceByUserId) {
        await getCurrentBalanceByUserId(user?.id || "");
        await getChartDataByUserId(user?.id || "");
        setShowInitalAlert(false);
      } else {
        setShowInitalAlert(true);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
loadUserById();
}, [getCurrentBalanceByUserId, getChartDataByUserId, initalSetupLoading, goalLoading, originalBalanceLoading, goalByUserId, currentBalanceByUserId]);

// This useEffect is for setting up the chart
useEffect(() => {
if (chartElements) {
  const setupChart = () => {
    const data = {
      labels: chartElements?.periods,
      datasets: [
        {
          label: "Balance",
          data: chartElements?.budgets,
          fill: false,
          borderColor: "rgba(52, 44, 255, 1)",
          pointBorderColor: "blue",
          tension: 0.1,
        },
        {
          label: "Expenses",
          data: chartElements?.expenses,
          fill: false,
          borderColor: "rgba(235,74, 75, 1)",
          borderDash: [5, 5],
          pointBorderColor: "red",
          tension: 0.1,
        },
        {
          label: "Deposits",
          data: chartElements?.deposits,
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
  };

  setupChart();
}
}, [chartElements]);

  const handleRefresh = async () => {
    await getGoalByUserId(user?.id || "");
    await getCurrentBalanceByUserId(user?.id || "");
    await getChartDataByUserId(user?.id || "");
  };

  if(showInitalAlert) {
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

  if (currentBalanceLoading || !isLoaded || originalBalanceLoading || chartDataLoading || chartLoading || initalSetupLoading) {
    return <LoadingComponent />;
  }


  if (balanceError || goalError || chartDataError) {
    return <div>Error: {balanceError || goalError || chartDataError}</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-transparent">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="w-full text-black"
          >
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
                  Current Balance
                </CardTitle>
                <Wallet size={20} className="text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-medium">
                  ${currentBalanceByUserId}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(chartElements?.periods && chartElements?.periods?.length > 1 ) && <div>{balanceChange.change === "No change" ? "No change" : `${balanceChange.change} ${Math.abs(balanceChange.percentage)}%` } from the previous month.</div>}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-[#FFF2F2] to-[#FFD9D9]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium text-red-600 font-bold">
                  Recent Month Expenses
                </CardTitle>
                <CircleDollarSign size={20} className="text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-medium">${(chartElements?.expenses && chartElements?.expenses?.length > 0) ? chartElements?.expenses?.at(-1) : 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(chartElements?.periods && chartElements?.periods?.length > 1 ) && <div>{expenseChange.change === "No change" ? "No change" : `${expenseChange.change} ${Math.abs(expenseChange.percentage)}%` } from the previous month.</div>}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-[#F0FEF6] to-[#CBFFDD]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium text-green-600 font-bold">
                  Recent Month Income/Deposit
                </CardTitle>
                <Banknote size={20} className="text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-medium">${(chartElements?.deposits && chartElements?.deposits?.length > 0) ? chartElements?.deposits?.at(-1) : 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(chartElements?.periods && chartElements?.periods?.length > 1 ) && <div>{depositChange.change === "No change" ? "No change" : `${depositChange.change} ${Math.abs(depositChange.percentage)}%` } from the previous month.</div>}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-[#EEF5FF] to-[#CDE3FF]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium text-blue-600 font-bold">
                  Goal
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <button>
                      <Pencil size={20} className="text-blue-600"></Pencil>
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <div>
                      {goalByUserId && <GoalUpdateForm goal={goalByUserId} />}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-medium">
                  ${goalByUserId?.goalAmount}
                </div>
                <div className="text-2xl font-medium">
                  {new Date(
                    goalByUserId?.goalDate || Date.now()
                  ).toLocaleDateString("en-CA")}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            <Card className="col-span-1">
          {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4"> */}
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <LineChartComponent
                  data={chartData}
                  options={{ maintainAspectRatio: false }}
                />
                <div></div>
              </CardContent>
            </Card>
            {/* <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Insights</CardTitle>
              </CardHeader>
              <CardContent>
                  <div>
                    <ul className="list-disc">
                      {(chartElements?.periods && chartElements?.periods?.length > 1 ) && <li>Balance {balanceChange == 0 ? "did not change" : balanceChange < 0 ? `has been decreased at ${Math.abs(balanceChange)}% ` : `has been increased at ${Math.abs(balanceChange)}%` } from the previous month.</li>}
                      {(chartElements?.periods && chartElements?.periods?.length > 1) && <li><li>Expense was {expenseChange == 0 ? "unchanged from" : expenseChange < 0 ? `${Math.abs(expenseChange)}% lower than` : `${Math.abs(expenseChange)}% higher than` } the previous month.</li></li>}  
                      {(chartElements?.periods && chartElements?.periods?.length <= 1 )&& <li>There is not enough information for insights.</li>}
                    </ul>
                  </div>
              </CardContent>
            </Card> */
            }
          </div>
        </TabsContent>
      </Tabs>
      <div className="text-sm">{`(*)`} Note: Only transactions occurs after balance and goal set up are being used.</div>
    </div>
  );
};

export default AnalyticPage;
