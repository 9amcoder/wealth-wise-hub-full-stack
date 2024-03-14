"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { post } from "@/config/axiosConfig";
// import Tesseract from "tesseract.js";

const UploadReceiptPage: React.FC<UploadReceiptPage> = () => {
  const [selectedFile, setSelectedFile] = useState<any>();
  const [extractedText, setExtractedText] = useState("");

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

  const handleSubmit = async (e: any) => {
    if (selectedFile) var base64 = selectedFile.split("base64,")[1];
    console.log(base64);

    const response = await post(
      "https://wealthwise-receipts.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-receipt:analyze?api-version=2023-07-31",
      {
        body: { base64Source: base64 },
        headers: {
          "Ocp-Apim-Subscription-Key": "bb74a5c5575744f38cfca27435cf5738",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Document analysis response:", response);
  };
  // const handleOcr = () => {
  //   if (!selectedFile) return;
  //   Tesseract.recognize(
  //     selectedFile,
  //     "eng",
  //     { logger: (m: any) => console.log(m) } // Optional logger
  //   ).then(({ data: { text } }) => {
  //     setExtractedText(text);
  //   });
  // };

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
                {extractedText && (
                  <div>
                    <h3>Extracted Text:</h3>
                    <p>{extractedText}</p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UploadReceiptPage;
