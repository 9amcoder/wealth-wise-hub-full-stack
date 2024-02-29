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
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import Image from "next/image";
import { previewColumns } from "@/components/dashboard/transaction/preview-columns";
import { transactionColumns } from "@/components/dashboard/transaction/transaction-columns";
import { PreviewDataTable } from "@/components/dashboard/transaction/preview-data-table";
import { TransactionDataTable } from "@/components/dashboard/transaction/transaction-data-table";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {DEFAULT_SEGMENT_KEY} from "next/dist/shared/lib/segment";

import { useUser } from "@clerk/nextjs";

interface TransactionPageProps {}

const TransactionPage: React.FC<TransactionPageProps> = () => {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const { user, isLoaded } = useUser();

    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState('')

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
        const fetchData = async () => {
            if (user?.id && isLoaded) {
                try {
                    //TODO: Temporary hardcoded user id for testing
                    const response = await fetch(`/api/transactions/user_2cshbGwAojpabypE6rZc0vRFWt7`);
                    const data = await response.json();
                    setData(data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error:', error);
                    setError('Error fetching data');
                }
            }
        };
    
        const delay = 2000; // Delay in milliseconds
        setTimeout(fetchData, delay);
    }, [user?.id, isLoaded]);

    if (isLoading) {
        return <div> loading...</div>
    }

    if (error) {
        return <div> Error: {error}</div>
    }

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
                                                    style={{width: 'auto', height: '255px'}}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Button className="text-[#282458] mt-2" variant="outline" type="button"
                                        disabled={!selectedFile}>Extract</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-2">
                    <Card className="h-[447px]">
                        <CardHeader>
                            <div className="grid grid-cols-2">
                                <CardTitle className="text-[#282458] col-span-1">Preview</CardTitle>
                                <div className="col-span-1 top-0 right-0">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className="right-0 top-0">
                                                <Button className="text-[#282458]" variant="outline" type="button">Add
                                                    transaction</Button>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle className="text-[#282458]">Add new transaction</DialogTitle>
                                                <DialogDescription>
                                                    Enter information for new transaction here. Click save when you're done.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="transactionDate" className="text-right text-[#282458]">
                                                        Date Time
                                                    </Label>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DateTimePicker className="w-full h-full bg-transparent"
                                                                        views={['year', 'day', 'hours', 'minutes', 'seconds']}/>
                                                    </LocalizationProvider>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="title" className="text-right text-[#282458]">
                                                        Item
                                                    </Label>
                                                    <Input id="title" value="" className="col-span-3"/>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="amount" className="text-right text-[#282458]">
                                                        Amount
                                                    </Label>
                                                    <Input id="amount" value="" className="col-span-3"/>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button className="text-[#282458] bg-[#F3F3FC] hover:bg-[#E5E5FF]" type="submit">Save</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
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
