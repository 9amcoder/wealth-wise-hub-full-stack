'use client'
import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Wallet2, CircleDollarSign, Target } from "lucide-react";
import LineChartComponent from "@/components/ui/chart";
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import LoadingComponent from "@/components/dashboard/Loading";
interface GoalUpdateFormProps { }

const GoalUpdateForm: React.FC<GoalUpdateFormProps> = () => {
    const router = useRouter()
    const [error, setError] = useState('')

    const { user, isLoaded } = useUser();

    const formSchema = z.object({
        target_amount: z.coerce.number().min(0.1, {
            message: "Goal must be greater than 0"
        }),
        target_date: z.coerce.date().min(new Date(), {
            message: "Target date must not be a date in the past"
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            target_amount: 0.0,
            target_date: new Date()
        },
    })

    if (!isLoaded) {
        console.log(user?.id);
        return <div>Loading...</div>; // Handle loading state
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit goal</DialogTitle>
                            <DialogDescription>
                                Make changes to your goal here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid items-center gap-4">
                                <FormField control={form.control} name="target_amount" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#282458]">Target Amount</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <FormField control={form.control} name="target_date" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#282458]">Target Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[375px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => date <= new Date()}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="text-[#282458]" variant="outline" type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </form>
        </Form>
    );

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(user?.id)
        console.log(values)

        let results = [
            await fetch(`/api/goals/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user?.id,
                    goalAmount: values.target_amount,
                    goalDate: values.target_date
                }),
            })
        ];

        console.log(results);

        if (results[0].status == 200 && results[1].status == 200) {
            router.push('/analytics');
        } else {
            return <div> Error: {error}</div>
        }
    }
};

export default GoalUpdateForm;
