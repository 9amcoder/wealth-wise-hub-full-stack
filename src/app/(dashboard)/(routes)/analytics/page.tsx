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

interface AnalyticPageProps { }
const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Budget",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: "rgba(75, 192, 192, 1)",
      pointBorderColor: "blue",
      tension: 0.1,
    },
    {
      label: "Expenses",
      data: [15, 30, 70, 50, 46, 49, 30],
      fill: false,
      borderColor: "rgba(45, 102, 92, 1)",
      borderDash: [5, 5],
      pointBorderColor: "green",
      tension: 0.1,
    },
  ],
};

const AnalyticPage: React.FC<AnalyticPageProps> = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [insights, setInsights] = useState([])

  const {
    goalLoading,
    goalError,
    goalByUserId,
    getGoalByUserId
  } = useGoalStore();

  const {
    balance,
    balanceLoading,
    balanceError,
    balanceByUserId,
    getBalanceByUserId
  } = useBalanceStore();

  // fetch data from the server (see app/api folder)
  useEffect(() => {
    const loadUserById = async () => {
      try {
        if (isLoaded) {
          await getGoalByUserId(user?.id || "");
          await getBalanceByUserId(user?.id || "");
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadUserById();
  }, [getGoalByUserId, getBalanceByUserId, user?.id, isLoaded]);

  if (goalLoading || balanceLoading) {
    return <LoadingComponent />;
  }

  if (goalError) {
    return <div> Error: {goalError}</div>;
  }

  if (balanceError) {
    return <div> Error: {balanceError}</div>;
  }

  return (
    console.log("Goal by UserId" + goalByUserId?.goalAmount + " " + goalByUserId?.goalDate),
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
                  <h3 className="pt-3 text-gray-10">${balanceByUserId?.balance}</h3>
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
                    <GoalUpdateForm goal={goalByUserId}/>
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
        <div className="p-2 grid divide-x divide-gray-300">
          <CardContent>
            <div className="grid gap-4 items-center justify-center">
              < Button className="text-[#282458] w-[100px]" variant="outline" type="button" onClick={() => { alert("Generating insights") }}>Start</Button>
            </div>
          </CardContent>
        </div>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[450px]">
            <LineChartComponent data={data} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnalyticPage;
