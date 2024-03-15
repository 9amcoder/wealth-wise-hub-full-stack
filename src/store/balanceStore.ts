import handleApiError from "@/config/apiErrorHandler";
import { get, post, put, remove } from "@/config/axiosConfig";
import { BalanceHistory } from "@prisma/client";
import { AxiosError } from "axios";
import { create } from "zustand";

interface BalanceStore {
    balance: BalanceHistory | null
    balanceByUserId: BalanceHistory | null;
    balanceLoading: boolean;
    balanceError: string | null;
    getBalanceByUserId: (userId: string) => Promise<void>;
}

const useBalanceStore = create<BalanceStore>((set) => ({
    balance: null,
    balanceByUserId: null,
    balanceLoading: false,
    balanceError: null,
    getBalanceByUserId: async (userId) => {
        set({ balanceError: null, balanceLoading: true });
        try {
            console.log("user id", userId);
            const response = await get(`/balance/${userId}`);
            set({ balanceByUserId: response.data });
        } catch (balanceError) {
            const errorMessage = handleApiError(balanceError as AxiosError);
            set({ balanceError: errorMessage });
            throw new Error(errorMessage);
        } finally {
            set({ balanceLoading: false });
        }
    }
}));

export default useBalanceStore;
