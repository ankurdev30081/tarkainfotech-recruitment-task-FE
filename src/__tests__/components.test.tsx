import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "@/app/page";
import CategorySection from "@/components/CategorySection";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import SummarySection from "@/components/SummarySection";
import { api } from "@/lib/api";
import { renderWithProviders } from "./test-utils";

vi.mock("@/lib/api", () => ({
  api: {
    getCategories: vi.fn(),
    createCategory: vi.fn(),
    getExpenses: vi.fn(),
    createExpense: vi.fn(),
    getSummary: vi.fn(),
  },
}));

const mockApi = vi.mocked(api);

const food = { id: 1, name: "Food", total_expenses: 1 };
const createdLunch = { id: 1, title: "Lunch", amount: 250.5, category_id: 1, created_at: "2026-04-14T12:00:00" };
const lunch = { id: 1, title: "Lunch", amount: 250.5, category: "Food", created_at: "2026-04-14T12:00:00" };

beforeEach(() => {
  vi.resetAllMocks();
  mockApi.getCategories.mockResolvedValue([food]);
  mockApi.getExpenses.mockResolvedValue([lunch]);
  mockApi.getSummary.mockResolvedValue({ total: 250.5, count: 1, average: 250.5 });
});

describe("CategorySection", () => {
  it("displays categories with expense count", async () => {
    renderWithProviders(<CategorySection />);
    expect(await screen.findByText("Food")).toBeInTheDocument();
    expect(screen.getByText("1 expenses")).toBeInTheDocument();
  });

  it("creates a category and clears the input", async () => {
    mockApi.createCategory.mockResolvedValue({ id: 2, name: "Travel" });
    renderWithProviders(<CategorySection />);
    const input = screen.getByLabelText("Category name");

    await userEvent.type(input, "Travel");
    await userEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => expect(mockApi.createCategory).toHaveBeenCalledWith({ name: "Travel" }, expect.anything()));
    await waitFor(() => expect(input).toHaveValue(""));
  });

  it("rejects an empty name without calling the API", async () => {
    renderWithProviders(<CategorySection />);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Category name cannot be empty");
    expect(mockApi.createCategory).not.toHaveBeenCalled();
  });

  it("shows the server error for a duplicate category", async () => {
    mockApi.createCategory.mockRejectedValue(new Error("Category already exists"));
    renderWithProviders(<CategorySection />);
    await userEvent.type(screen.getByLabelText("Category name"), "Food");
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Category already exists");
  });
});

describe("ExpenseForm", () => {
  async function fillForm(title: string, amount: string, category?: string) {
    if (title) await userEvent.type(screen.getByLabelText("Title"), title);
    if (amount) await userEvent.type(screen.getByLabelText("Amount"), amount);
    if (category) {
      await screen.findByRole("option", { name: category });
      await userEvent.selectOptions(screen.getByLabelText("Category"), category);
    }
    await userEvent.click(screen.getByRole("button", { name: "Add Expense" }));
  }

  it("lists categories in the dropdown", async () => {
    renderWithProviders(<ExpenseForm />);
    expect(await screen.findByRole("option", { name: "Food" })).toBeInTheDocument();
  });

  it.each([
    ["", "10", "Food", "Title cannot be empty"],
    ["Lunch", "", "Food", "Amount must be a positive number"],
    ["Lunch", "-5", "Food", "Amount must be a positive number"],
    ["Lunch", "0", "Food", "Amount must be a positive number"],
    ["Lunch", "10", undefined, "Please select a category"],
  ])("validates title=%j amount=%j category=%j", async (title, amount, category, message) => {
    renderWithProviders(<ExpenseForm />);
    await fillForm(title, amount, category);
    expect(screen.getByRole("alert")).toHaveTextContent(message);
    expect(mockApi.createExpense).not.toHaveBeenCalled();
  });

  it("submits a valid expense and resets the form", async () => {
    mockApi.createExpense.mockResolvedValue(createdLunch);
    renderWithProviders(<ExpenseForm />);
    await fillForm("Lunch", "250.5", "Food");

    await waitFor(() =>
      expect(mockApi.createExpense).toHaveBeenCalledWith(
        { title: "Lunch", amount: 250.5, category_id: 1 },
        expect.anything(),
      ),
    );
    await waitFor(() => expect(screen.getByLabelText("Title")).toHaveValue(""));
    expect(screen.getByLabelText("Category")).toHaveValue("");
  });

  it("shows a server error", async () => {
    mockApi.createExpense.mockRejectedValue(new Error("Category does not exist"));
    renderWithProviders(<ExpenseForm />);
    await fillForm("Lunch", "10", "Food");
    expect(await screen.findByRole("alert")).toHaveTextContent("Category does not exist");
  });
});

describe("ExpenseList", () => {
  it("shows title, amount, category and date", async () => {
    renderWithProviders(<ExpenseList />);
    const row = (await screen.findByText("Lunch")).closest("tr")!;
    expect(within(row).getByText("250.50")).toBeInTheDocument();
    expect(within(row).getByText("Food")).toBeInTheDocument();
    expect(within(row).getByText(new Date(lunch.created_at).toLocaleString())).toBeInTheDocument();
  });

  it("shows an empty state", async () => {
    mockApi.getExpenses.mockResolvedValue([]);
    renderWithProviders(<ExpenseList />);
    expect(await screen.findByText("No expenses yet")).toBeInTheDocument();
  });
});

describe("SummarySection", () => {
  it("displays total, count and average", async () => {
    mockApi.getSummary.mockResolvedValue({ total: 430.5, count: 2, average: 215.25 });
    renderWithProviders(<SummarySection />);
    expect(await screen.findByLabelText("Total Amount")).toHaveTextContent("430.50");
    expect(screen.getByLabelText("Total Expenses")).toHaveTextContent("2");
    expect(screen.getByLabelText("Average Amount")).toHaveTextContent("215.25");
  });
});

describe("Data refresh", () => {
  it("refreshes expenses, categories and summary after adding an expense", async () => {
    mockApi.createExpense.mockResolvedValue(createdLunch);
    renderWithProviders(<Home />);
    await screen.findByRole("option", { name: "Food" });

    mockApi.getExpenses.mockResolvedValue([lunch, { ...lunch, id: 2, title: "Dinner", amount: 180 }]);
    mockApi.getCategories.mockResolvedValue([{ ...food, total_expenses: 2 }]);
    mockApi.getSummary.mockResolvedValue({ total: 430.5, count: 2, average: 215.25 });

    await userEvent.type(screen.getByLabelText("Title"), "Dinner");
    await userEvent.type(screen.getByLabelText("Amount"), "180");
    await userEvent.selectOptions(screen.getByLabelText("Category"), "Food");
    await userEvent.click(screen.getByRole("button", { name: "Add Expense" }));

    expect(await screen.findByText("Dinner")).toBeInTheDocument();
    expect(await screen.findByText("2 expenses")).toBeInTheDocument();
    expect(screen.getByLabelText("Total Amount")).toHaveTextContent("430.50");
  });
});

describe("Skeleton loaders", () => {
  it.each([
    ["Loading categories", CategorySection, "getCategories"],
    ["Loading expenses", ExpenseList, "getExpenses"],
    ["Loading summary", SummarySection, "getSummary"],
  ] as const)("shows %s skeleton until data arrives", async (label, Component, method) => {
    let resolve!: (value: never) => void;
    mockApi[method].mockReturnValue(new Promise((r) => (resolve = r)) as never);
    renderWithProviders(<Component />);

    expect(screen.getByRole("status", { name: label })).toBeInTheDocument();
    expect(screen.queryByText(/loading\.\.\./i)).not.toBeInTheDocument();

    resolve((method === "getSummary" ? { total: 0, count: 0, average: 0 } : []) as never);
    await waitFor(() => expect(screen.queryByRole("status", { name: label })).not.toBeInTheDocument());
  });
});

describe("Required fields", () => {
  it("marks every form field as required", () => {
    renderWithProviders(<Home />);
    for (const label of ["Category name", "Title", "Amount", "Category"]) {
      const field = screen.getByLabelText(label);
      expect(field).toBeRequired();
      expect(document.querySelector(`label[for="${field.id}"]`)).toHaveClass("after:content-['*']");
    }
  });
});

describe("Real-time validation", () => {
  it("clears the category error as soon as a name is typed", async () => {
    renderWithProviders(<CategorySection />);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Category name cannot be empty");

    await userEvent.type(screen.getByLabelText("Category name"), "T");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await userEvent.clear(screen.getByLabelText("Category name"));
    expect(screen.getByRole("alert")).toHaveTextContent("Category name cannot be empty");
  });

  it("clears the duplicate-category error when the name is edited", async () => {
    mockApi.createCategory.mockRejectedValue(new Error("Category already exists"));
    renderWithProviders(<CategorySection />);
    await userEvent.type(screen.getByLabelText("Category name"), "Food");
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Category already exists");

    await userEvent.type(screen.getByLabelText("Category name"), "s");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows an error per field and removes each one as it is corrected", async () => {
    renderWithProviders(<ExpenseForm />);
    await screen.findByRole("option", { name: "Food" });
    await userEvent.click(screen.getByRole("button", { name: "Add Expense" }));

    const messages = () => screen.queryAllByRole("alert").map((a) => a.textContent);
    expect(messages()).toEqual([
      "Title cannot be empty",
      "Amount must be a positive number",
      "Please select a category",
    ]);
    expect(screen.getByLabelText("Title")).toHaveAttribute("aria-invalid", "true");

    await userEvent.type(screen.getByLabelText("Title"), "Lunch");
    expect(messages()).toEqual(["Amount must be a positive number", "Please select a category"]);
    expect(screen.getByLabelText("Title")).toHaveAttribute("aria-invalid", "false");

    await userEvent.type(screen.getByLabelText("Amount"), "-1");
    expect(messages()).toEqual(["Amount must be a positive number", "Please select a category"]);
    await userEvent.clear(screen.getByLabelText("Amount"));
    await userEvent.type(screen.getByLabelText("Amount"), "12");
    expect(messages()).toEqual(["Please select a category"]);

    await userEvent.selectOptions(screen.getByLabelText("Category"), "Food");
    expect(messages()).toEqual([]);
  });

  it("does not show errors before the first submit", async () => {
    renderWithProviders(<ExpenseForm />);
    await userEvent.type(screen.getByLabelText("Amount"), "-1");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("clears the server error when the user edits the form", async () => {
    mockApi.createExpense.mockRejectedValue(new Error("Category does not exist"));
    renderWithProviders(<ExpenseForm />);
    await screen.findByRole("option", { name: "Food" });
    await userEvent.type(screen.getByLabelText("Title"), "Lunch");
    await userEvent.type(screen.getByLabelText("Amount"), "10");
    await userEvent.selectOptions(screen.getByLabelText("Category"), "Food");
    await userEvent.click(screen.getByRole("button", { name: "Add Expense" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Category does not exist");

    await userEvent.type(screen.getByLabelText("Title"), "!");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
