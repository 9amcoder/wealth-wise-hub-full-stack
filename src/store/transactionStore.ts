import handleApiError from "@/config/apiErrorHandler";
import { get, post, put, remove } from "@/config/axiosConfig";
import { Transaction } from "@prisma/client";
import { AxiosError } from "axios";
import { create } from "zustand";

interface TransactionStore {
  transactions: Transaction[];
  transactionDataById: Transaction | null;
  transactionsByUserId: Transaction[];
  loading: boolean;
  transactionError: string | null;
  getTransactions: () => Promise<void>;
  getTransactionById: (id: string) => Promise<void>;
  getTransactionByUserId: (userId: string) => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  transactionDataById: null,
  transactionsByUserId: [],
  loading: false,
  transactionError: null,
  getTransactions: async () => {
    set({ transactionError: null, loading: true });
    try {
      const response = await get("/transactions");
      set({ transactions: response.data });
    } catch (transactionError) {
      const errorMessage = handleApiError(transactionError as AxiosError);
      set({ transactionError: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  getTransactionById: async (id) => {
    set({ transactionError: null, loading: true });
    try {
      const response = await get(`/transaction/${id}`);
      set({ transactionDataById: response.data });
    } catch (transactionError) {
      const errorMessage = handleApiError(transactionError as AxiosError);
      set({ transactionError: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  getTransactionByUserId: async (userId) => {
    set({ transactionError: null, loading: true });
    try {
      const response = await get(`/transactions/${userId}`);
      set({ transactionsByUserId: response.data });
    } catch (transactionError) {
      const errorMessage = handleApiError(transactionError as AxiosError);
      set({ transactionError: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  addTransaction: async (transaction) => {
    set({ transactionError: null, loading: true });
    try {
      const response = await post("/transactions", transaction);
      set({ transactions: response.data });
    } catch (transactionError) {
      const errorMessage = handleApiError(transactionError as AxiosError);
      set({ transactionError: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  updateTransaction: async (transaction) => {
    set({ transactionError: null, loading: true });
    try {
      const response = await put(
        `/transactions`,
        transaction
      );
      const updatedTransactions = response.data;
      set({ transactions: updatedTransactions });
    } catch (transactionError) {
      const errorMessage = handleApiError(transactionError as AxiosError);
      set({ transactionError: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  deleteTransaction: async (id) => {
    set({ transactionError: null, loading: true });
    try {
      await remove(`/transaction/${id}`);
      set((state) => ({
        transactionsByUserId: state.transactionsByUserId.filter(
          (transaction) => transaction.id !== id
        ),
      }));
    } catch (transactionError) {
      const errorMessage = handleApiError(transactionError as AxiosError);
      set({ transactionError: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useTransactionStore;
