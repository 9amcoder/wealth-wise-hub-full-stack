import handleApiError from "@/config/apiErrorHandler";
import { get, post, put, remove } from "@/config/axiosConfig";
import { BalanceHistory } from "@prisma/client";
import { Item } from "@radix-ui/react-dropdown-menu";
import { AxiosError } from "axios";
import { create } from "zustand";

export interface MonthlyTransaction {
  period: string;
  amount: number;
  type: number;
}

export interface Element {
  amount: number;
  period: string;
}

export interface ChartElement {
  period: string;
  budgets: number;
  expenses: number;
  deposits: number;
}

interface ChartDataStore {
  // budgets: Element[];
  // expenses: Element[];
  // deposits: Element[];
  chartElements: ChartElement[];
  monthlyTransactions: MonthlyTransaction[];
  chartDataLoading: boolean;
  chartDataError: string | null;
  getChartDataByUserId: (userId: string) => Promise<void>;
}

const useChartDataStore = create<ChartDataStore>((set) => ({
  // budgets: [],
  // expenses: [],
  // deposits: [],
  chartElements: [],
  monthlyTransactions: [],
  chartDataLoading: false,
  chartDataError: null,
  getChartDataByUserId: async (userId) => {
    try {
      const originalBalanceResponse = await get(`/balance/${userId}`);
      let balance: BalanceHistory = originalBalanceResponse.data;

      const monthlyTransactionsResponse = await get(
        `transactions/summary/monthly/${userId}`
      );
      let monthlyTransactions: MonthlyTransaction[] =
        monthlyTransactionsResponse.data;

      let chartElements: ChartElement[] = [];

      if (monthlyTransactions.length > 0) {
        const expenses: Element[] = monthlyTransactions.filter((obj) => {
          return obj.type === 0;
        });

        const deposits: Element[] = monthlyTransactions.filter((obj) => {
          return obj.type === 1;
        });

        let temp: { [key: string]: number } = {};
        const aggregatedMonthlyTransactions: MonthlyTransaction[] = [];

        monthlyTransactions.forEach((element) => {
          if (temp[element.period]) {
            const index = temp[element.period] - 1;
            const foundElement = aggregatedMonthlyTransactions[index];
            let currentElementAmount = element.amount;
            if (element.type === 0) {
              currentElementAmount = currentElementAmount * -1;
            }
            let foundElementAmount = foundElement.amount;
            if (foundElement.type === 0) {
              foundElementAmount = foundElementAmount * -1;
            }
            const newElement = {
              ...foundElement,
              amount: currentElementAmount + foundElementAmount,
            };

            aggregatedMonthlyTransactions[index] = newElement;
          } else {
            temp[element.period] = aggregatedMonthlyTransactions.length + 1;
            aggregatedMonthlyTransactions.push(element);
          }
        });

        var new_balance = balance.balance;
        const budgets = aggregatedMonthlyTransactions.map(function (
          transaction
        ) {
          new_balance = new_balance + transaction.amount;
          return { period: transaction.period, amount: new_balance };
        });

        chartElements = budgets.map((element) => {
          let element_expenses: number;
          if (
            expenses.map((expense) => expense.period).includes(element.period)
          ) {
            element_expenses = expenses.find(
              (expense) => expense.period === element.period
            )!.amount;
          } else {
            element_expenses = 0;
          }

          let element_deposits: number;
          if (
            deposits.map((deposit) => deposit.period).includes(element.period)
          ) {
            element_deposits = deposits.find(
              (deposit) => deposit.period === element.period
            )!.amount;
          } else {
            element_deposits = 0;
          }

          let newElement: ChartElement = {
            period: element.period,
            budgets: element.amount,
            expenses: element_expenses,
            deposits: element_deposits,
          };

          return newElement;
        });
      }

      // set({ budgets: budgets });
      // set({ expenses: expenses});
      // set({ deposits: deposits});

      set({ chartElements: chartElements });
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
