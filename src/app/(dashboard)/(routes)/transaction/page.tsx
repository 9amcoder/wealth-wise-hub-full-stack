'use client'

import React, {ChangeEvent, useState} from "react";
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

const transactions = [
    {
        datetime: "2023-05-01 10:47:05",
        item: "Banana",
        amount: 20.00
    },
    {
        datetime: "2023-05-19 04:01:27",
        item: "Orange",
        amount: 15.00
    },
    {
        datetime: "2023-07-25 02:26:41",
        item: "Cupcake",
        amount: 32.50
    },
    {
        datetime: "2023-04-03 05:51:56",
        item: "Bowling",
        amount: 549.67
    },
    {
        datetime: "2023-10-12 21:52:52",
        item: "Grape",
        amount: 43.34
    },
    {
        datetime: "2023-08-08 08:56:38",
        item: "Milk",
        amount: 11.45
    },
    {
        datetime: "2023-02-04 10:03:33",
        item: "Tim Hortons",
        amount: 3.76
    },
]

const TransactionPage: React.FC<TransactionPageProps> = () => {

    const [selectedFile, setSelectedFile] = useState<string | null>(null);

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
                            <PreviewDataTable columns={previewColumns} data={transactions}/>
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
                        <TransactionDataTable columns={transactionColumns} data={transactions}/>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default TransactionPage;
