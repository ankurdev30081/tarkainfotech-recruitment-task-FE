import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const queryKeys = {
  categories: ["categories"],
  expenses: ["expenses"],
  summary: ["summary"],
} as const;

export const useCategories = () =>
  useQuery({ queryKey: queryKeys.categories, queryFn: api.getCategories });

export const useExpenses = () =>
  useQuery({ queryKey: queryKeys.expenses, queryFn: api.getExpenses });

export const useSummary = () =>
  useQuery({ queryKey: queryKeys.summary, queryFn: api.getSummary });

/** Refreshes all data after any successful action. */
function useRefreshAll() {
  const queryClient = useQueryClient();
  return () =>
    Object.values(queryKeys).forEach((queryKey) =>
      queryClient.invalidateQueries({ queryKey }),
    );
}

export function useCreateCategory() {
  const onSuccess = useRefreshAll();
  return useMutation({ mutationFn: api.createCategory, onSuccess });
}

export function useCreateExpense() {
  const onSuccess = useRefreshAll();
  return useMutation({ mutationFn: api.createExpense, onSuccess });
}
