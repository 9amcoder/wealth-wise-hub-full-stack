import handleApiError from "@/config/apiErrorHandler";
import { get, post, put, remove } from "@/config/axiosConfig";
import { AxiosError } from "axios";
import { create } from "zustand";

export interface Expense {
    TransactionPeriod: string,
    TotalExpense: number
}

interface ExpenseStore {
    expenses: Expense[]
    expensesByUserId: Expense[] | null;
    expenseLoading: boolean;
    expenseError: string | null;
    getExpensesByUserId: (userId: string) => Promise<void>;
}

const useExpenseStore = create<ExpenseStore>((set) => ({
    expenses: [],
    expensesByUserId: [],
    expenseLoading: false,
    expenseError: null,
    getExpensesByUserId: async (userId) => {
        set({ expenseError: null, expenseLoading: true });
        try {
            const response = await get(`/expense/${userId}`);
            set({ expensesByUserId: response.data });
        } catch (expenseError) {
            const errorMessage = handleApiError(expenseError as AxiosError);
            set({ expenseError: errorMessage });
            throw new Error(errorMessage);
        } finally {
            set({ expenseLoading: false });
        }
    }
}));

export default useExpenseStore;
