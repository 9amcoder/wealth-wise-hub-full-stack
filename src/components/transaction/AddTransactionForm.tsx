"use client";

import useTransactionStore from "@/store/transactionStore";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { Transaction } from "@prisma/client";
import { Button } from "../ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "../ui/input";
import LoadingComponent from "../dashboard/Loading";

export const addTransactionSchema = z.object({
  title: z.string().min(1, { message: "must be 1 character long" }).max(255),
  amount: z.number().positive(),
  transactionDate: z.date(),
  userId: z.string(),
});

const AddTransactionForm: React.FC = () => {
  const { loading, transactionError, addTransaction } = useTransactionStore();

  const { user } = useUser();

  const router = useRouter();
  const { toast } = useToast();

  const user_id = user?.id;

  const form = useForm<z.infer<typeof addTransactionSchema>>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      title: "",
      amount: 0,
      transactionDate: new Date(),
      userId: user_id || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof addTransactionSchema>) => {
    const { title, amount, transactionDate, userId } = data;

    const newTransactionData = {
      title,
      amount,
      transactionDate,
      userId,
    } as Transaction;

    try {
      await addTransaction(newTransactionData);
      toast({
        title: "Transaction added successfully",
        duration: 5000,
      });
      router.push(`/transaction`);
    } catch (error) {
      console.log("error", error);
      toast({
        title: "Transaction failed to add",
        description: "error",
        duration: 5000,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (transactionError) {
    return <div> Error: {transactionError}</div>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md w-full flex flex-col gap-4 p-4 bg-white rounded-md shadow-md"
      >
        <FormDescription className="text-black py-4">
          {"Please enter the details of the transaction"}
        </FormDescription>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>{"Transaction title"}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={"Please enter the title of transaction"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>{"Transaction amount"}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={"Please enter the amount"}
                    {...field}
                    onChange={(e) => {
                      field.onChange(parseFloat(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="transactionDate"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>{"Transaction date and time"}</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    placeholderText={"Select date and time"}
                    className="border ml-5"
                    dateFormat={"MM-dd-yyyy, HH:mm"}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption={"Time"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button type="submit" className="w-full">
          Submit
        </Button>
        {transactionError && (
          <FormDescription className="text-red-600">
            Error: {transactionError}
          </FormDescription>
        )}
      </form>
    </Form>
  );
};

export default AddTransactionForm;
