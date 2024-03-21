import handleApiError from "@/config/apiErrorHandler";
import { get, post, put, remove } from "@/config/axiosConfig";
import { GoalHistory } from "@prisma/client";
import { AxiosError } from "axios";
import { create } from "zustand";

interface GoalStore {
    goal: GoalHistory | null,
    goalByUserId: GoalHistory | null;
    goalLoading: boolean;
    goalError: string | null;
    getGoalByUserId: (userId: string) => Promise<void>;
    updateGoal: (goal: GoalHistory) => Promise<void>;
}

const useGoalStore = create<GoalStore>((set) => ({
    goal: null,
    goalByUserId: null,
    goalLoading: false,
    goalError: null,
    getGoalByUserId: async (userId) => {
        try {
            console.log("Get goal");
            const response = await get(`/goals/${userId}`);
            set({ goalByUserId: response.data });
            set({ goalError: null, goalLoading: true });
        } catch (goalError) {
            const errorMessage = handleApiError(goalError as AxiosError);
            set({ goalError: errorMessage });
            throw new Error(errorMessage);
        } finally {
            set({ goalLoading: false });
        }
    },
    updateGoal: async (goal) => {
        set({ goalError: null, goalLoading: true });
        try {
            const response = await put(
                `/goals`,
                goal
            );
            const updatedGoal = response.data;
            set({ goal: updatedGoal });
        } catch (goalError) {
            const errorMessage = handleApiError(goalError as AxiosError);
            set({ goalError: errorMessage });
            throw new Error(errorMessage);
        } finally {
            set({ goalLoading: false });
        }
    },
}));

export default useGoalStore;
