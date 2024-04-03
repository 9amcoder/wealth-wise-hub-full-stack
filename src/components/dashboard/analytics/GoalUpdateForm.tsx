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
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar as CalendarIcon, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast";
import { GoalHistory } from "@prisma/client";
import useGoalStore from "@/store/goalStore";
import LoadingComponent from "@/components/dashboard/Loading"

type GoalUpdateFormComponentProps = { goal: GoalHistory }

export default function GoalUpdateFormComponent({ goal }: GoalUpdateFormComponentProps) {
    const router = useRouter();
    const { user } = useUser();
    const { goalLoading, goalError, updateGoal, getGoalByUserId } = useGoalStore();
    const { toast } = useToast();

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
            target_amount: goal?.goalAmount,
            target_date: goal?.goalDate ? new Date(goal.goalDate) : undefined
        },
    })

    if (goalLoading) {
        return <LoadingComponent />;
    }

    if (goalError) {
        return <div> Error: {goalError}</div>;
    }

    const cardDescription = "Make changes to your goal here. Click save when you're done."
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card className="w-[460px] border-hidden">
                    <CardHeader>
                        <CardTitle>Update goal</CardTitle>
                        <CardDescription>{cardDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField control={form.control} name="target_amount" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[#282458]">Target Amount</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={(e) => {
                                        field.onChange(parseFloat(e.target.value));
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <br />
                        <FormField control={form.control} name="target_date" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[#282458]">Target Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[410px] pl-3 text-left font-normal",
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
                    </CardContent>
                    <CardFooter>
                        <Button className="text-[#282458]" variant="outline" type="submit">Save changes</Button>
                    </CardFooter>
                </Card>
                {goalError && (
                    <FormDescription className="text-red-600">
                        Error: {goalError}
                    </FormDescription>
                )}
            </form>
        </Form>
    );

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let goal = {
            userId: user?.id,
            goalAmount: values.target_amount,
            goalDate: values.target_date
        } as GoalHistory

        try {
            await updateGoal(goal)
            if (!goalLoading) {
                toast({
                    title: "Goal was updated successfully",
                    duration: 10000,
                });
                await getGoalByUserId(user?.id);
            }
        } catch (error) {
            console.log("error", error);
            toast({
                title: "Failed to update goal",
                description: "Error",
                duration: 5000,
                variant: "destructive"
            });
        }
    }
};
