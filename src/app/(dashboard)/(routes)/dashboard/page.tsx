"use client";
import { FunctionComponent, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useBalanceStore from "@/store/balanceStore";
import { useUser } from "@clerk/nextjs";
import useTransactionStore from "@/store/transactionStore";
import LoadingComponent from "@/components/dashboard/Loading";
import { Transaction } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  ArrowDownToDot,
  ArrowUpFromDot,
  RefreshCcw,
  Wallet,
} from "lucide-react";

const DashboardPage: FunctionComponent = () => {
  const { user, isLoaded } = useUser();

  const {
    currentBalanceLoading,
    balanceError,
    currentBalanceByUserId,
    originalBalanceByUserId,
    originalBalanceLoading,
    getCurrentBalanceByUserId,
  } = useBalanceStore();

  const {
    transactionsByUserId,
    getTransactionByUserId,
    transactionError,
    loading,
  } = useTransactionStore();

  useEffect(() => {
    const loadUserById = async () => {
      try {
        if (isLoaded) {
          await getCurrentBalanceByUserId(user?.id || "");
          await getTransactionByUserId(user?.id || "");
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadUserById();
  }, [getCurrentBalanceByUserId, user?.id, isLoaded, getTransactionByUserId]);

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

  const change = useMemo(() => {
    // Ensure the original balance is not null and not zero to avoid division by zero
    if (
      originalBalanceByUserId === null ||
      originalBalanceByUserId.balance === 0
    ) {
      return 0;
    }

    // Calculate the percentage change
    const change =
      ((currentBalanceByUserId - originalBalanceByUserId.balance) /
        originalBalanceByUserId.balance) *
      100;

    return change;
  }, [currentBalanceByUserId, originalBalanceByUserId]) as number; // The return type is number

  const handleRefresh = async () => {
    console.log("Refreshing...");
    await getCurrentBalanceByUserId(user?.id || "");
    await getTransactionByUserId(user?.id || "");
  };

  if (currentBalanceLoading || loading || !isLoaded || originalBalanceLoading) {
    return <LoadingComponent />;
  }
  
  if (balanceError || transactionError) {
    return <div>Error: {balanceError || transactionError}</div>;
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
                <p className="text-xs text-muted-foreground">
                  {change}% changes from original balance
                </p>
              </CardContent>
            </Card>
            <Card className="bg-red-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-400 font-bold">
                  Total Expenses
                </CardTitle>
                <ArrowUpFromDot size={20} className="text-red-400" />
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
                <ArrowDownToDot size={20} className="text-green-400" />
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
              <CardContent className="pl-2">{/* <Overview /> */}</CardContent>
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
                      className={`flex flex-row justify-between ${
                        transaction.transactionType === 0
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
