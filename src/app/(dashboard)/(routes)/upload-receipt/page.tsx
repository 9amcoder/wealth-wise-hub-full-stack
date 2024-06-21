"use client";
import useTransactionStore from "@/store/transactionStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import Image from "next/image";
import { get, post } from "@/config/axiosConfig";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "../../../../components/ui/use-toast";
import React from "react";
import LoadingComponent from "@/components/dashboard/Loading";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import * as z from "zod";
import { Transaction } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTransactionSchema } from "@/components/transaction/AddTransactionForm";

interface ExtractedText {
  title: string;
  amount: number;
  transactionDate: Date;
  transactionType: number;
}

const UploadReceiptPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<any>();
  const [extractedText, setExtractedText] = useState<ExtractedText | null>(
    null
  );
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { transactionError, addTransaction } = useTransactionStore();
  const { user } = useUser();
  const user_id = user?.id;
  const { toast } = useToast();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
      };
      reader.readAsDataURL(file);
      // console.log(reader);
    }
  };

  const initialanalysis = async () => {
    try {
      if (selectedFile) var base64 = selectedFile.split("base64,")[1];

      const req = { base64Source: base64 };
      const response = await post(
        "https://wealthwise-receipts.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-receipt:analyze?api-version=2023-07-31",
        req,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": "xxx",
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(
      //   "Document analysis response:",
      //   response.headers["apim-request-id"]
      // );
      const operationId = response.headers["apim-request-id"];

      // console.log("operationId", operationId);
      return operationId;
    } catch (error) {
      console.error("Error fetching results:", error);
      setError(true);
      setLoading(false);
    }
  };

  const extractButton = async () => {
    setLoading(true);
    setError(false);
    const operationId = await initialanalysis();
    const result = await analyseResults(operationId);

    if (result) {
      const document = result.analyzeResult.documents[0];
      var dateTimeObj;
      const dateextract = document?.fields?.TransactionDate?.valueDate;
      const timeextract = document?.fields?.TransactionTime?.valueTime;
      if (dateextract && timeextract) {
        const dateTime = `${dateextract}T${timeextract}Z`;
        dateTimeObj = new Date(dateTime);
      }

      const extractedData: ExtractedText = {
        title: document?.fields?.MerchantName?.valueString ?? "",
        amount: Number(document?.fields?.Total?.valueNumber ?? 0),
        transactionDate: dateTimeObj ?? new Date(),
        transactionType: 0,
      };

      setExtractedText(extractedData);
    }
    setLoading(false);
  };

  const analyseResults = async (operationId: any) => {
    const maxRetries = 10; // Maximum number of retries
    let retries = 0;

    const fetchResults: any = async () => {
      try {
        const response = await get(
          `https://wealthwise-receipts.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-receipt/analyzeResults/${operationId}?api-version=2023-07-31`,
          {
            headers: {
              "Ocp-Apim-Subscription-Key": "xxx",
            },
          }
        );

        const { data } = response;
        if (data.status === "running" && retries < maxRetries) {
          retries++;
          // console.log(
          //   `Retrying after 5 seconds (Retry ${retries}/${maxRetries})`
          // );
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay for 2 seconds before retrying
          return fetchResults(); // Retry the request
        } else if (data.status === "succeeded") {
          // console.log("Results:", data);
          return data; // Return the final results
        } else {
          throw new Error("Unexpected status or max retries reached");
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        setError(true);
        setLoading(false);
      }
    };

    return fetchResults();
  };

  const form = useForm<z.infer<typeof addTransactionSchema>>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      title: "Receipt Expense",
      amount: 0,
      transactionDate: new Date(),
      userId: user_id,
      transactionType: 0,
    },
  });
  useEffect(() => {
    form.reset(
      extractedText || {
        title: "",
        amount: 0,
        transactionDate: new Date(),
        transactionType: 0,
      }
    );
  }, [extractedText, form]);

  const handleClick: MouseEventHandler<HTMLButtonElement> = async () => {
    await onSubmit(form.getValues());
  };
  const onSubmit = async (data: z.infer<typeof addTransactionSchema>) => {
    if (extractedText) {
      const newTransactionData = {
        title: extractedText.title,
        amount: extractedText.amount,
        transactionDate: extractedText.transactionDate,
        userId: user_id,
        transactionType: 0,
      } as Transaction;

      try {
        await addTransaction(newTransactionData);
        toast({
          title: "Transaction added successfully",
          duration: 10000,
        });
      } catch (error) {
        // console.log("error", error);
        toast({
          title: "Transaction failed to add",
          description: "error",
          duration: 5000,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <div className="w-full md:w-3/4 lg:w-full px-4 py-2 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#282458]">Upload Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col space-y-1.5">
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf, .jpeg, .jpg, .png"
                />
                {selectedFile && (
                  <div className="mt-2">
                    <Image
                      src={selectedFile}
                      alt="Preview"
                      className="rounded-md"
                      height={0}
                      width={0}
                      style={{ width: "auto", height: "255px" }}
                    />
                  </div>
                )}
              </div>

              <Button
                className="text-[#282458] mt-2"
                variant="outline"
                type="button"
                disabled={!selectedFile}
                onClick={extractButton}>
                Extract
              </Button>
              {error && (
                <div className="bg-red-500 text-white px-4 py-2 mt-4 rounded-lg shadow-md">
                  Error extracting data, please click Extract button to retry.
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {loading && <LoadingComponent />}
      {extractedText && (
        <div className="w-full md:w-3/4 lg:w-full px-4 py-2 mt-4">
          <Card>
            <Form {...form}>
              <form>
                <div className="w-full md:w-3/4 lg:w-full px-4 py-2 mt-4 flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>{"Transaction Title"}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                "Please enter the title of transaction"
                              }
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
                          <FormLabel>{"Transaction Amount"}</FormLabel>
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
                                  ? new Date(field.value)
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
                              minDate={new Date(extractedText.transactionDate)}
                              maxDate={new Date()}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <Button
                    type="submit"
                    className="w-full md:w-1/2 lg:w-full px-4 py-2 mt-2"
                    onClick={handleClick}>
                    Submit
                  </Button>
                  {transactionError && (
                    <FormDescription className="text-red-600">
                      Error: {transactionError}
                    </FormDescription>
                  )}
                </div>
              </form>
            </Form>
          </Card>
        </div>
      )}
    </>
  );
};

export default UploadReceiptPage;
