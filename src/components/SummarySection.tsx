"use client";

import { useSummary } from "@/hooks/useExpenseApi";
import { formatAmount } from "@/lib/format";
import type { Summary } from "@/lib/types";
import Card from "./ui/Card";
import { Skeleton, SkeletonGroup } from "./ui/Skeleton";
import StatusMessage from "./ui/StatusMessage";

const stats: { label: string; format: (s: Summary) => string }[] = [
  { label: "Total Amount", format: (s) => formatAmount(s.total) },
  { label: "Total Expenses", format: (s) => String(s.count) },
  { label: "Average Amount", format: (s) => formatAmount(s.average) },
];

function StatGrid({ data }: { data?: Summary }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map(({ label, format }) => (
        <div key={label} className="rounded-md bg-gray-50 p-4">
          <p className="text-sm text-gray-500">{label}</p>
          {data ? (
            <p className="text-2xl font-semibold text-gray-900" aria-label={label}>
              {format(data)}
            </p>
          ) : (
            <Skeleton className="mt-2 h-7 w-24" />
          )}
        </div>
      ))}
    </div>
  );
}

export default function SummarySection() {
  const { data, isLoading, error } = useSummary();

  return (
    <Card title="Summary">
      <StatusMessage message={error?.message} />
      {isLoading && (
        <SkeletonGroup label="Loading summary">
          <StatGrid />
        </SkeletonGroup>
      )}
      {data && <StatGrid data={data} />}
    </Card>
  );
}
