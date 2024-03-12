"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { post } from "@/config/axiosConfig";
import Tesseract from "tesseract.js";

const UploadReceiptPage: React.FC<UploadReceiptPage> = () => {
  const [selectedFile, setSelectedFile] = useState<any>();
  const [extractedText, setExtractedText] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleOcr = () => {
    if (!selectedFile) return;
    Tesseract.recognize(
      selectedFile,
      "eng",
      { logger: (m: any) => console.log(m) } // Optional logger
    ).then(({ data: { text } }) => {
      setExtractedText(text);
    });
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
                  onClick={handleOcr}>
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
