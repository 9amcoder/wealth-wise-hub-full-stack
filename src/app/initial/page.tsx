"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LoadingComponent from "@/components/dashboard/Loading";
import useBalanceStore from "@/store/balanceStore";
import useGoalStore from "@/store/goalStore";

interface InitialPageProps {}

const InitialPage: React.FC<InitialPageProps> = () => {
  const { user, isLoaded } = useUser();
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  const {
    originalBalanceByUserId,
    balanceError,
    originalBalanceLoading,
    getOriginalBalanceByUserId,
  } = useBalanceStore();

  const { goalLoading, goalError, goalByUserId, getGoalByUserId } =
    useGoalStore();

  const formSchema = z.object({
    balance: z.coerce.number().min(0, {
      message: "Balance must be a postitive number",
    }),
    target_amount: z.coerce.number().min(0.1, {
      message: "Goal must be greater than 0",
    }),
    target_date: z.coerce.date().min(new Date(), {
      message: "Target date must not be a date in the past",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      balance: 0.0,
      target_amount: 0.0,
    },
  });

  const label = "Let's set your current balance and future goal";

  // fetch data from the server (see app/api folder)
  useEffect(() => {
    const loadGoalandBalance = async () => {
      if (isLoaded) {
        try {
          await getOriginalBalanceByUserId(user?.id || "");
          await getGoalByUserId(user?.id || "");
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
    loadGoalandBalance();
  }, [getGoalByUserId, getOriginalBalanceByUserId, user?.id, isLoaded]);

  if (goalLoading || originalBalanceLoading) {
    return <LoadingComponent />;
  } else {
    if (goalByUserId == null || originalBalanceByUserId == null) {
      return (
        <div className="grid h-screen place-items-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card className="w-[600px]">
                <CardHeader>
                  <CardTitle className="text-[#282458]">{label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="balance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#282458]">
                          Balance
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <br />
                  <FormField
                    control={form.control}
                    name="target_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#282458]">
                          Target Amount
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <br />
                  <FormField
                    control={form.control}
                    name="target_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#282458]">
                          Target Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[550px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date <= new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    className="text-[#282458]"
                    variant="outline"
                    type="submit"
                  >
                    Begin
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      );
    }
    router.push("/dashboard");
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let results = [
      await fetch(`/api/balance/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          balance: values.balance,
        }),
      }),
      await fetch(`/api/goals/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          goalAmount: values.target_amount,
          goalDate: values.target_date,
        }),
      }),
    ];

    if (results[0].status == 200 && results[1].status == 200) {
      router.push("/dashboard");
    } else {
      return <div>Error</div>;
    }
  }
};

export default InitialPage;
