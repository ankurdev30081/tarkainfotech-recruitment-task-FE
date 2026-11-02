"use client";

import { useState, type FormEvent } from "react";
import { useCategories, useCreateCategory } from "@/hooks/useExpenseApi";
import { validateCategory } from "@/lib/validation";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Input from "./ui/Input";
import { Skeleton, SkeletonGroup } from "./ui/Skeleton";
import StatusMessage from "./ui/StatusMessage";

function CategoryListSkeleton() {
  return (
    <SkeletonGroup label="Loading categories">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex justify-between py-2.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </SkeletonGroup>
  );
}

export default function CategorySection() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const categories = useCategories();
  const createCategory = useCreateCategory();

  // Re-validated on every render, so the message updates as the user types.
  const fieldError = submitted ? validateCategory(name) : undefined;

  const handleChange = (value: string) => {
    setName(value);
    setServerError(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (validateCategory(name)) return;

    createCategory.mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          setName("");
          setSubmitted(false);
        },
        onError: (err) => setServerError(err.message),
      },
    );
  };

  return (
    <Card title="Categories">
      <form onSubmit={handleSubmit} className="flex items-start gap-2" noValidate>
        <Input
          id="category-name"
          label="Category name"
          required
          value={name}
          error={fieldError ?? serverError}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="e.g. Food"
        />
        <Button type="submit" className="mt-6" disabled={createCategory.isPending}>
          Add
        </Button>
      </form>

      <div className="mt-4">
        {categories.isLoading && <CategoryListSkeleton />}
        <StatusMessage message={categories.error?.message} />
        {categories.data?.length === 0 && <StatusMessage type="info" message="No categories yet" />}
        <ul className="divide-y divide-gray-100">
          {categories.data?.map((category) => (
            <li key={category.id} className="flex justify-between py-2 text-sm">
              <span className="text-gray-800">{category.name}</span>
              <span className="text-gray-500">{category.total_expenses} expenses</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
