"use client";

import { useExpenses } from "@/hooks/useExpenseApi";
import { formatAmount, formatDate } from "@/lib/format";
import Card from "./ui/Card";
import { Skeleton, SkeletonGroup } from "./ui/Skeleton";
import StatusMessage from "./ui/StatusMessage";

const headers = ["Title", "Amount", "Category", "Date"];

function ExpenseListSkeleton() {
  return (
    <SkeletonGroup label="Loading expenses">
      <div className="flex gap-4 border-b border-gray-200 py-2">
        {headers.map((h) => (
          <Skeleton key={h} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: 4 }, (_, row) => (
        <div key={row} className="flex gap-4 py-3">
          {headers.map((h) => (
            <Skeleton key={h} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </SkeletonGroup>
  );
}

export default function ExpenseList() {
  const { data: expenses, isLoading, error } = useExpenses();

  return (
    <Card title="Expenses">
      {isLoading && <ExpenseListSkeleton />}
      <StatusMessage message={error?.message} />
      {expenses?.length === 0 && <StatusMessage type="info" message="No expenses yet" />}
      {!!expenses?.length && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="py-2 pr-4 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="py-2 pr-4">{expense.title}</td>
                  <td className="py-2 pr-4">{formatAmount(expense.amount)}</td>
                  <td className="py-2 pr-4">{expense.category}</td>
                  <td className="py-2 pr-4">{formatDate(expense.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
