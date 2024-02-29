"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PreviewTransaction = {
    transactionDate: string
    title: string
    amount: number
}

export const previewColumns: ColumnDef<PreviewTransaction>[] = [
    {
        accessorKey: "transactionDate",
        header: () => <div className="text-[#282458]">DateTime</div>,
    },
    {
        accessorKey: "title",
        header: () => <div className="text-[#282458]">Item</div>,
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right text-[#282458]">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "CAD",
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const transaction = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Dialog>
                            <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Modify transaction details</DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="text-[#282458]">Edit transaction</DialogTitle>
                                    <DialogDescription>
                                        Make changes to the transaction here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="transactionDate" className="text-right text-[#282458]">
                                          Date Time
                                        </Label>
                                        <Input id="transactionDate" value={transaction.transactionDate}
                                             className="col-span-3"/>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="title" className="text-right text-[#282458]">
                                          Item
                                        </Label>
                                        <Input id="title" value={transaction.title} className="col-span-3"/>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="amount" className="text-right text-[#282458]">
                                          Amount
                                        </Label>
                                        <Input id="amount" value={transaction.amount} className="col-span-3"/>
                                    </div>
                                </div>
                            <DialogFooter>
                                <Button className="text-[#282458] bg-[#F3F3FC] hover:bg-[#E5E5FF]" type="submit">Save changes</Button>
                            </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete transaction</DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-[#282458]">Are you sure?</DialogTitle>
                                    <DialogDescription>
                                        This will permanently remove the transaction from preview table.
                                    </DialogDescription>
                                    <DialogFooter>
                                        <Button className="text-[#282458] bg-[#F3F3FC] hover:bg-[#E5E5FF]" type="submit">Confirm</Button>
                                    </DialogFooter>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
