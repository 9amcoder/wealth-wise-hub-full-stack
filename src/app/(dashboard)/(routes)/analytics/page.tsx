import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import React from "react";
import { Wallet2, CircleDollarSign } from "lucide-react";
import LineChartComponent from "@/components/ui/chart";

interface AnalyticPageProps {}
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
                  <h3 className="pb-6">Goals</h3>
                  <Label className="pt-3 text-gray-10">$899.00</Label>
                </div>
                <div className="col-span-1 flex flex-row-reverse">
                  <Button
                    className="text-gray-700 outline-none rounded-md focus:border-gray-400 focus:border float-left"
                    variant="outline"
                    size="sm">
                    Modify
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardContent>
            <div className="col-span-1 ">
              <div className="m-3 grid grid-cols-3 gap-1">
                <div className="col-span-1 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#9ADAFF] to-[#99CCFF]">
                  <CircleDollarSign
                    className="p-2 align-items: flex-start"
                    size={50}
                    color="#16395B"
                  />
                </div>
                <div className="p-3 col-span-1 align-items: center flex flex-col">
                  <h3 className="pb-6">Expenses</h3>
                  <Label className="pt-3 text-gray-10">$899.00</Label>
                </div>
                <div className="col-span-1 flex flex-row-reverse">
                  <Button
                    className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
                    variant="outline"
                    size="sm">
                    Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      <Card>
        <div className="p-2 grid grid-cols-2 divide-x divide-gray-300">
          <CardContent>
            <div className="col-span-1">
              <Label>Insights</Label>
              <CardDescription>18% overbudget in last 5 weeks.</CardDescription>
            </div>
          </CardContent>
          <CardContent>
            <div className="col-span-2">
              <Label>Recommendations</Label>
              <CardDescription>18% overbudget in last 5 weeks.</CardDescription>
            </div>
          </CardContent>
        </div>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[400px]">
            <LineChartComponent data={data} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticPage;
