"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useUser } from "@clerk/nextjs";
import useTransactionStore from "@/store/transactionStore";
import LoadingComponent from "@/components/dashboard/Loading";
import { useRouter } from "next/navigation";

const TransactionPage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const {
    loading,
    transactionError,
    transactionsByUserId,
    getTransactionById,
    getTransactionByUserId,
    deleteTransaction,
  } = useTransactionStore();

  const user_id = user?.id;

  const handleRefresh = () => {
    try {
      getTransactionByUserId(user_id || "");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = (id: string) => {
    try {
      deleteTransaction(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = (id: string) => {
    try {
      router.push(`/transaction/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadUserById = async () => {
      try {
        if (isLoaded) {
          await getTransactionByUserId(user_id || "");
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadUserById();
  }, [getTransactionByUserId, user_id, isLoaded]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (transactionError) {
    return <div> Error: {transactionError}</div>;
  }

  return (
    <>
      <div className="mx-2 my-2">
        <Button
          variant="default"
          onClick={() => router.push(`/addtransaction`)}
        >
          Add New +
        </Button>
        <Button className="ml-5" variant="secondary" onClick={handleRefresh}>
          Refresh
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead> Title</TableHead>
            <TableHead> Amount </TableHead>
            <TableHead> Date and Time </TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!transactionsByUserId ||
          (Array.isArray(transactionsByUserId) &&
            transactionsByUserId.length === 0) ? (
            <TableRow>
              <TableCell colSpan={4}>No data</TableCell>
            </TableRow>
          ) : (
            transactionsByUserId.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {transaction.title}
                </TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>
                  {new Date(transaction.transactionDate).toLocaleDateString() +
                    " " +
                    new Date(transaction.transactionDate).toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={handleUpdate.bind(this, transaction.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="ml-5"
                    variant="destructive"
                    onClick={handleRemove.bind(this, transaction.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default TransactionPage;
