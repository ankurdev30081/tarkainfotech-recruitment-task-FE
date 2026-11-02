import CategorySection from "@/components/CategorySection";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import SummarySection from "@/components/SummarySection";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
      <SummarySection />
      <div className="grid gap-6 md:grid-cols-2">
        <CategorySection />
        <ExpenseForm />
      </div>
      <ExpenseList />
    </main>
  );
}
