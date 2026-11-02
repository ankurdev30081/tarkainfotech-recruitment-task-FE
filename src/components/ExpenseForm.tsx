"use client";

import { useState, type FormEvent } from "react";
import { useCategories, useCreateExpense } from "@/hooks/useExpenseApi";
import { validateExpense } from "@/lib/validation";
import { useAppDispatch, useAppSelector } from "@/store";
import { resetForm, setField, type ExpenseFormState } from "@/store/expenseFormSlice";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Input from "./ui/Input";
import Select from "./ui/Select";
import StatusMessage from "./ui/StatusMessage";

export default function ExpenseForm() {
  const form = useAppSelector((state) => state.expenseForm);
  const dispatch = useAppDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { data: categories = [] } = useCategories();
  const createExpense = useCreateExpense();

  // Re-validated on every render, so messages update as the user corrects input.
  const errors = submitted ? validateExpense(form) : {};

  const update = (field: keyof ExpenseFormState) => (value: string) => {
    dispatch(setField({ field, value }));
    setServerError(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(validateExpense(form)).length) return;

    createExpense.mutate(
      { title: form.title.trim(), amount: Number(form.amount), category_id: Number(form.categoryId) },
      {
        onSuccess: () => {
          dispatch(resetForm());
          setSubmitted(false);
        },
        onError: (err) => setServerError(err.message),
      },
    );
  };

  return (
    <Card title="Add Expense">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        <Input
          id="expense-title"
          label="Title"
          required
          value={form.title}
          error={errors.title}
          onChange={(e) => update("title")(e.target.value)}
          placeholder="e.g. Lunch"
        />
        <Input
          id="expense-amount"
          label="Amount"
          type="number"
          min="0"
          step="0.01"
          required
          value={form.amount}
          error={errors.amount}
          onChange={(e) => update("amount")(e.target.value)}
          placeholder="0.00"
        />
        <Select
          id="expense-category"
          label="Category"
          placeholder="Select a category"
          required
          value={form.categoryId}
          error={errors.categoryId}
          onChange={(e) => update("categoryId")(e.target.value)}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <StatusMessage message={serverError} />
        <Button type="submit" disabled={createExpense.isPending}>
          Add Expense
        </Button>
      </form>
    </Card>
  );
}
