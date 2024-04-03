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
  periods: [] | null;
  budgets: [] | null;
  expenses: [] | null;
  deposits: [] | null;
}

interface ChartDataStore {
  chartElements: ChartElements | null;
  monthlyTransactions: MonthlyTransaction[];
  chartDataLoading: boolean;
  chartDataError: string | null;
  getChartDataByUserId: (userId: string) => Promise<void>;
}

const useChartDataStore = create<ChartDataStore>((set) => ({
  chartElements: null,
  monthlyTransactions: [],
  chartDataLoading: false,
  chartDataError: null,
  getChartDataByUserId: async (userId) => {
    try {
      const originalBalanceResponse = await get(`/balance/${userId}`);
      let originalBalance: BalanceHistory = originalBalanceResponse.data;

      if (originalBalance) {
        let userCreatedMonth = new Date(originalBalance.createdAt).getMonth()+1;
        let userCreatedYear = new Date(originalBalance.createdAt).getFullYear();

        let originPeriod = `${userCreatedMonth}-${userCreatedYear}`;

        let chartElements = {
          periods: [originPeriod],
          budgets: [originalBalance.balance],
          expenses: null,
          deposits: null
        };

        const monthlyTransactionsResponse = await get(
          `transactions/summary/monthly/${userId}`
        );
        let monthlyTransactions: MonthlyTransaction[] = monthlyTransactionsResponse.data;

        if (monthlyTransactions.length > 0) {
          const originalBudget: MonthlyTransaction = {
            period: originPeriod,
            amount: originalBalance.balance,
            type: 2
          }
          monthlyTransactions.push(originalBudget);

          const uniquePeriods = Array.from(new Set(monthlyTransactions.map((item: any) => item.period)));
          const raw_expenses = monthlyTransactions.filter(item => item.type == 0);
          const raw_deposits = monthlyTransactions.filter(item => item.type == 1);

          const budgets = [];
          const expenses = [];
          const deposits = [];

          let budget: number = originalBalance.balance;
          let expense:number = 0;
          let deposit: number = 0;

          uniquePeriods.forEach((period) => {
            if (raw_expenses.map((exp) => exp.period).includes(period)) {
                expense = raw_expenses.find((e) => e.period === period
                )!.amount;
            } else {
              expense = 0;
            }

            if (raw_deposits.map((dep) => dep.period).includes(period)) {
              deposit = raw_deposits.find((d) => d.period === period
              )!.amount;
            } else {
              deposit = 0;
            }

            budget = budget + deposit - expense;

            budgets.push(budget);
            expenses.push(expense);
            deposits.push(deposit);
          });

          chartElements = {
            periods: uniquePeriods,
            budgets: budgets,
            expenses: expenses,
            deposits: deposits
          }
        }
        
        set({ chartElements: chartElements });
        set({ chartDataError: null, chartDataLoading: true });
      }
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
