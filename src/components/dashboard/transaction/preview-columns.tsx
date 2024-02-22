"use client"

import { ColumnDef } from "@tanstack/react-table"

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
]
