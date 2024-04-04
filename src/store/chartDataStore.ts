import handleApiError from "@/config/apiErrorHandler";
import { get, post, put, remove } from "@/config/axiosConfig";
import { BalanceHistory, User } from "@prisma/client";
import { Item } from "@radix-ui/react-dropdown-menu";
import { AxiosError } from "axios";
import { create } from "zustand";

export interface MonthlyTransaction {
  period: string;
  amount: number;
  type: number;
}

export interface ChartElements {
  periods: string[];
  budgets: number[];
  expenses: number[];
  deposits: number[];
}

interface ChartDataStore {
  chartElements: ChartElements | null;
  monthlyTransactions: MonthlyTransaction[];
  chartDataLoading: boolean;
  chartDataError: string | null;
  getChartDataByUserId: (userId: string) => Promise<void>;
}

const useChartDataStore = create<ChartDataStore>((set) => ({
  chartElements: {
    periods: [],
    budgets: [],
    expenses: [],
    deposits: []
  },
  monthlyTransactions: [],
  chartDataLoading: false,
  chartDataError: null,
  getChartDataByUserId: async (userId: string) => {
    try {
      const originalBalanceResponse = await get(`/balance/${userId}`);
      const originalBalance: BalanceHistory = originalBalanceResponse.data;
  
      if (!originalBalance) {
        throw new Error('Original balance not found');
      }
  
      const userCreatedDate = new Date(originalBalance.createdAt);
      const originPeriod = `${userCreatedDate.getMonth() + 1}-${userCreatedDate.getFullYear()}`;
  
      let chartElements: ChartElements = {
        periods: [originPeriod],
        budgets: [originalBalance.balance],
        expenses: [],
        deposits: []
      };
  
      const monthlyTransactionsResponse = await get(`transactions/summary/monthly/${userId}`);
      const monthlyTransactions: MonthlyTransaction[] = monthlyTransactionsResponse.data;
  
      if (monthlyTransactions.length > 0) {
        const originalBudget: MonthlyTransaction = {
          period: originPeriod,
          amount: originalBalance.balance,
          type: 2
        }
        monthlyTransactions.push(originalBudget);
  
        const uniquePeriods = Array.from(new Set(monthlyTransactions.map((item: MonthlyTransaction) => item.period)));

        let budget = originalBalance.balance;
  
        const { budgets, expenses, deposits } = uniquePeriods.reduce<{ budgets: number[], expenses: number[], deposits: number[] }>((acc, period) => {
          const expense = monthlyTransactions.find(item => item.type === 0 && item.period === period)?.amount || 0;
          const deposit = monthlyTransactions.find(item => item.type === 1 && item.period === period)?.amount || 0;

          if (period == originPeriod) {
            acc.budgets.push(budget);
            budget = budget + deposit - expense;
          } else {
            budget = budget + deposit - expense;
            acc.budgets.push(budget);
          }
          
          acc.expenses.push(expense);
          acc.deposits.push(deposit);
        
          return acc;
        }, { budgets: [], expenses: [], deposits: [] });
  
        chartElements = {
          periods: uniquePeriods,
          budgets,
          expenses,
          deposits
        }
      }
  
      set({ chartElements });
      set({ chartDataError: null, chartDataLoading: true });
    } catch (chartDataError) {
      const errorMessage = handleApiError(chartDataError as AxiosError);
      set({ chartDataError: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ chartDataLoading: false });
    }
  },
}));

export default useChartDataStore;
