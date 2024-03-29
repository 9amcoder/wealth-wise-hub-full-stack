"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { get, post } from "@/config/axiosConfig";
import { Label } from "@/components/ui/label";
import React from "react";
import LoadingComponent from "@/components/dashboard/Loading";
import { useRouter } from "next/navigation";

interface ExtractedText {
  title: string;
  amount: number;
  transactionDate: Date;
  transactionType: number;
}

const UploadReceiptPage: React.FC<UploadReceiptPage> = () => {
  const [selectedFile, setSelectedFile] = useState<any>();
  const [extractedText, setExtractedText] = useState<ExtractedText | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
      };
      reader.readAsDataURL(file);
      console.log(reader);
    }
  };

  const initialanalysis = async () => {
    if (selectedFile) var base64 = selectedFile.split("base64,")[1];

    const req = { base64Source: base64 };
    console.log("process.env.AZURE_KEY", process.env.AZURE_KEY);
    const response = await post(
      "https://wealthwise-receipts.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-receipt:analyze?api-version=2023-07-31",
      req,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": "",
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "Document analysis response:",
      response.headers["apim-request-id"]
    );
    const operationId = response.headers["apim-request-id"];

    console.log("operationId", operationId);
    return operationId;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const operationId = await initialanalysis();
    const result = await analyseResults(operationId);

    if (result) {
      const document = result.analyzeResult.documents[0];
      const dateextract = document?.fields?.TransactionDate?.valueDate ?? "";
      const timeextract = document?.fields?.TransactionTime?.content ?? "";

      const dateTime = `${dateextract}T${timeextract}Z`;
      console.log("datetime", dateTime);

      const dateTimeObj = new Date(dateTime);

      const extractedData: ExtractedText = {
        title: document?.fields?.MerchantName?.valueString ?? "",
        amount: parseFloat(document?.fields?.Total?.content ?? "0"),
        transactionDate: dateTimeObj ?? "",
        transactionType: 0,
      };

      setExtractedText(extractedData);
    }
    setLoading(false);
  };

  const analyseResults = async (operationId: any) => {
    const maxRetries = 5; // Maximum number of retries
    let retries = 0;

    const fetchResults: any = async () => {
      try {
        const response = await get(
          `https://wealthwise-receipts.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-receipt/analyzeResults/${operationId}?api-version=2023-07-31`,
          {
            headers: {
              "Ocp-Apim-Subscription-Key": "",
            },
          }
        );

        const { data } = response;
        console.log("Current status:", data.status);

        if (data.status === "running" && retries < maxRetries) {
          retries++;
          console.log(
            `Retrying after 5 seconds (Retry ${retries}/${maxRetries})`
          );
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay for 2 seconds before retrying
          return fetchResults(); // Retry the request
        } else if (data.status === "succeeded") {
          console.log("Results:", data);
          return data; // Return the final results
        } else {
          throw new Error("Unexpected status or max retries reached");
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        throw error;
      }
    };

    return fetchResults();
  };

  return (
    <>
      <div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-[#282458]">Upload Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="w-1/4 ">
                  <div className="flex flex-col space-y-1.5">
                    <Input
                      id="picture"
                      type="file"
                      onChange={handleFileChange}
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
                </div>
                <Button
                  className="text-[#282458] mt-2"
                  variant="outline"
                  type="button"
                  disabled={!selectedFile}
                  onClick={handleSubmit}>
                  Extract
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <div className="px-4">
              {loading && <LoadingComponent />}
              {extractedText && (
                <form>
                  <div className="grid grid-cols-2 gap-6 py-4">
                    <Label>Merchant Name:</Label>
                    <Input value={extractedText.title} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Label>Transaction Date:</Label>
                    <Input value={extractedText.transactionDate} />
                    <Label>Total Money Spent:</Label>
                    <Input value={extractedText.amount} />
                  </div>
                  <Button
                    className="text-[#282458] mt-2"
                    variant="outline"
                    type="button"
                    onClick={() => router.push(`/addtransaction`)}>
                    Submit
                  </Button>
                </form>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UploadReceiptPage;
