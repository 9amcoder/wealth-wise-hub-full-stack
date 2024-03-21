import handleApiError from "@/config/apiErrorHandler";
import { get, post, put, remove } from "@/config/axiosConfig";
import { BalanceHistory } from "@prisma/client";
import { AxiosError } from "axios";
import { create } from "zustand";

interface BalanceStore {
    balance: BalanceHistory | null
    originalBalanceByUserId: BalanceHistory | null;
    balanceLoading: boolean;
    balanceError: string | null;
    getOriginalBalanceByUserId: (userId: string) => Promise<void>;
}

const useBalanceStore = create<BalanceStore>((set) => ({
    balance: null,
    originalBalanceByUserId: null,
    balanceLoading: false,
    balanceError: null,
    getOriginalBalanceByUserId: async (userId) => {
        try {
            console.log("Get original balance");
            const response = await get(`/balance/${userId}`);
            set({ originalBalanceByUserId: response.data });
            set({ balanceError: null, balanceLoading: true });
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
