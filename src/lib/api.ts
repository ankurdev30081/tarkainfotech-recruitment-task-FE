import type {
  Category,
  CreatedCategory,
  CreatedExpense,
  Expense,
  NewCategory,
  NewExpense,
  Summary,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Turns a FastAPI error body into a readable message. */
function errorMessage(body: unknown): string {
  const detail = (body as { detail?: unknown })?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  return "Something went wrong";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    throw new Error("Unable to reach the server");
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(errorMessage(body));
  return body as T;
}

const post = <T>(path: string, data: unknown) =>
  request<T>(path, { method: "POST", body: JSON.stringify(data) });

export const api = {
  getCategories: () => request<Category[]>("/categories"),
  createCategory: (data: NewCategory) => post<CreatedCategory>("/categories", data),
  getExpenses: () => request<Expense[]>("/expenses"),
  createExpense: (data: NewExpense) => post<CreatedExpense>("/expenses", data),
  getSummary: () => request<Summary>("/summary"),
};
