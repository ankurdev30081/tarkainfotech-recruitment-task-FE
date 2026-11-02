import type { ReactNode } from "react";

/** A single pulsing placeholder block. Size it with Tailwind classes. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

/** Wraps skeleton placeholders and announces the loading state to screen readers. */
export function SkeletonGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
