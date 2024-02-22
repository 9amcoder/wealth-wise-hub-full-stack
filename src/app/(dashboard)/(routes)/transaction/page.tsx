'use client'

import React, {ChangeEvent, useEffect, useState} from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { PreviewTransaction, previewColumns } from "@/components/dashboard/transaction/preview-columns";
import { Transaction, transactionColumns } from "@/components/dashboard/transaction/transaction-columns";
import { PreviewDataTable } from "@/components/dashboard/transaction/preview-data-table";
import { TransactionDataTable } from "@/components/dashboard/transaction/transaction-data-table";

interface TransactionPageProps {}

const TransactionPage: React.FC<TransactionPageProps> = () => {

    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(true)

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

    // fetch data from the server (see app/api folder)
    useEffect(() => {
        fetch('/api/transactions')
          .then((res) => res.json())
          .then((data) => {
            setData(data)
            setLoading(false)
          })
      }, [])

    if (isLoading) return <p>Loading...</p>

    if (!data || (Array.isArray(data) && data.length === 0)) {
        return <p>No transaction data</p>;
      }

    return (
        <div className="grid gap-3 m-[2]">
            <div className="grid grid-flow-row-dense grid-cols-3 gap-1">
                <div className="col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-[#282458]">Upload Invoice</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Input id="picture" type="file" onChange={handleFileChange}/>
                                        {selectedFile && (
                                            <div className="mt-2">
                                                <Image
                                                    src={selectedFile}
                                                    alt="Preview"
                                                    className="rounded-md"
                                                    height={0}
                                                    width={0}
                                                    style={{width: '200px', height: '425px'}}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-[#282458]">Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PreviewDataTable columns={previewColumns} data={data}/>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[#282458]">Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TransactionDataTable columns={transactionColumns} data={data}/>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default TransactionPage;
