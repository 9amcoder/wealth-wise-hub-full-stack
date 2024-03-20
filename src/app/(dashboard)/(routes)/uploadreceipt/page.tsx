"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { get, post } from "@/config/axiosConfig";
import { Label } from "@/components/ui/label";
import React from "react";
// import Tesseract from "tesseract.js";

const UploadReceiptPage: React.FC<UploadReceiptPage> = () => {
  const [selectedFile, setSelectedFile] = useState<any>();
  const [extractedText, setExtractedText] = useState<any>("");

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
    const response = await post(
      "https://wealthwise-receipts.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-receipt:analyze?api-version=2023-07-31",
      req,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_KEY,
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
    const operationId = await initialanalysis();
    const result = await analyseResults(operationId);

    if (result) {
      console.log("=== Receipt Information ===");

      const analyzedReceipts = result.analyzeResult.documents.map(
        (extractedReceipt: any, idx: any) => {
          const s = { index: idx + 1 };

          console.log("receipt", extractedReceipt);
          setExtractedText(extractedReceipt);
        }
      );
    }
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
              "Ocp-Apim-Subscription-Key": process.env.AZURE_KEY,
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
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#282458]">Upload Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
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
            <CardContent>
              {extractedText && (
                <form>
                  <div className="grid grid-cols-2 gap-6">
                    <Label>Merchant Name:</Label>
                    <Input
                      value={extractedText?.fields?.MerchantName?.valueString}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {extractedText?.fields?.Items?.valueArray?.map(
                      (item: any, index: number) => (
                        <React.Fragment key={index}>
                          <Label>Item {index + 1} Description:</Label>

                          <Input
                            value={item?.valueObject?.Description?.valueString}
                          />
                          <Label>Item {index + 1} Price:</Label>
                          <Input
                            value={item?.valueObject?.TotalPrice?.content}
                          />
                        </React.Fragment>
                      )
                    )}
                    <Label>Tax Details:</Label>
                    <Input value={extractedText?.fields?.TotalTax?.content} />
                    <Label>Total Price:</Label>
                    <Input value={extractedText?.fields?.Total?.content} />
                  </div>
                  <Button
                    className="text-[#282458] mt-2"
                    variant="outline"
                    type="button">
                    Submit
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UploadReceiptPage;
