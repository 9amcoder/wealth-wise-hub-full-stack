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
import { addTransactionSchema } from "./AddTransactionForm";
import { format } from "date-fns";
import { useEffect } from "react";

interface UpdateTransactionFormProps {
  id: string;
}

const UpdateTransactionForm: React.FC<UpdateTransactionFormProps> = ({
  id,
}) => {
  const {
    loading,
    transactionError,
    updateTransaction,
    getTransactionById,
    transactionDataById,
  } = useTransactionStore();

  const { user } = useUser();

  const router = useRouter();
  const { toast } = useToast();

  const user_id = user?.id;

  const form = useForm<z.infer<typeof addTransactionSchema>>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: transactionDataById ?? {
      title: undefined,
      amount: undefined,
      transactionDate: undefined,
      userId: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof addTransactionSchema>) => {
    const { title, amount, transactionDate, userId, id } = data;
    const newTransactionData = {
      id,
      title,
      amount,
      transactionDate,
      userId,
    } as Transaction;

    try {
      await updateTransaction(newTransactionData);
      toast({
        title: "Transaction updated successfully",
        duration: 5000,
      });
      router.push(`/transaction`);
    } catch (error) {
      console.log("error", error);
      toast({
        title: "Transaction failed to add",
        description: "error",
        duration: 5000,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchTransactionById = async () => {
      try {
        await getTransactionById(id);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTransactionById();
  }, [id, getTransactionById]);

  useEffect(() => {
    if (transactionDataById) {
      form.reset(transactionDataById);
    }
  }, [transactionDataById, form]);

  if (loading) {
    return <LoadingComponent />;
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
                    selected={
                      typeof field.value === "string"
                        ? isNaN(Date.parse(field.value))
                          ? null
                          : new Date(field.value)
                        : field.value instanceof Date
                        ? new Date(field.value.toISOString())
                        : null
                    }
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
          Update
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

export default UpdateTransactionForm;
