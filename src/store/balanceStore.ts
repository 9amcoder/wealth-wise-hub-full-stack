import handleApiError from "@/config/apiErrorHandler";
import { get, post, put, remove } from "@/config/axiosConfig";
import { BalanceHistory, User } from "@prisma/client";
import { AxiosError } from "axios";
import { create } from "zustand";
import { Transaction } from "@prisma/client";

interface BalanceStore {
    originalBalanceByUserId: BalanceHistory | null;
    currentBalanceByUserId: number;
    originalBalanceLoading: boolean;
    currentBalanceLoading: boolean;
    balanceError: string | null;
    getOriginalBalanceByUserId: (userId: string) => Promise<void>;
    getCurrentBalanceByUserId: (userId: string) => Promise<void>;
}

const useBalanceStore = create<BalanceStore>((set) => ({
    originalBalanceByUserId: null,
    currentBalanceByUserId: 0,
    originalBalanceLoading: false,
    currentBalanceLoading: false,
    balanceError: null,
    getOriginalBalanceByUserId: async (userId) => {
        try {
            const response = await get(`/balance/${userId}`);
            set({ originalBalanceByUserId: response.data });
            set({ balanceError: null, originalBalanceLoading: true });
        } catch (balanceError) {
            const errorMessage = handleApiError(balanceError as AxiosError);
            set({ balanceError: errorMessage });
            throw new Error(errorMessage);
        } finally {
            set({ originalBalanceLoading: false });
        }
    },
    getCurrentBalanceByUserId: async (userId) => {
        try {
            const originalBalanceResponse = await get(`/balance/${userId}`);
            let originalBalance: BalanceHistory = originalBalanceResponse.data;

            const transactionResponse = await get(`/transactions/${userId}`);
            let transactions: Transaction[] = transactionResponse.data;

            if (!originalBalance) {
                set({ currentBalanceByUserId: 0 });
            } else if (originalBalance && transactions.length <= 0) {
                set({ currentBalanceByUserId: originalBalance.balance });
            } else if (originalBalance && transactions.length > 0) {
                let sumTransactions = 0;
                transactions.map(obj => {
                    let amount = obj.amount
                    if (obj.transactionDate > originalBalance.createdAt) {
                        if (obj.transactionType === 0) {
                            amount = amount * (-1)
                        }
                        sumTransactions += amount
                    }
                })

                let currentBalance = originalBalance.balance + sumTransactions

                set({ currentBalanceByUserId: currentBalance });
            }

            set({ balanceError: null, currentBalanceLoading: true });
        } catch (balanceError) {
            const errorMessage = handleApiError(balanceError as AxiosError);
            set({ balanceError: errorMessage });
            throw new Error(errorMessage);
        } finally {
            set({ currentBalanceLoading: false });
        }
    }
}));

export default useBalanceStore;
