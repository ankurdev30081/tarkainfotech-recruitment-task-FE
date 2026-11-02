import type { ExpenseFormState } from "@/store/expenseFormSlice";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function validateCategory(name: string): string | undefined {
  if (!name.trim()) return "Category name cannot be empty";
}

export function validateExpense({ title, amount, categoryId }: ExpenseFormState): FieldErrors<ExpenseFormState> {
  const errors: FieldErrors<ExpenseFormState> = {};
  if (!title.trim()) errors.title = "Title cannot be empty";
  if (!(Number(amount) > 0)) errors.amount = "Amount must be a positive number";
  if (!categoryId) errors.categoryId = "Please select a category";
  return errors;
}
