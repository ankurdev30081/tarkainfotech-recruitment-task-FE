import { afterEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";

const mockFetch = (status: number, body: unknown) =>
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify(body), { status }),
  );

afterEach(() => vi.restoreAllMocks());

describe("api client", () => {
  it("returns parsed JSON on success", async () => {
    mockFetch(200, { total: 10, count: 1, average: 10 });
    await expect(api.getSummary()).resolves.toEqual({ total: 10, count: 1, average: 10 });
  });

  it("sends POST body as JSON", async () => {
    const fetchSpy = mockFetch(201, { id: 1, name: "Food" });
    await api.createCategory({ name: "Food" });
    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:8000/categories",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ name: "Food" }) }),
    );
  });

  it("throws the server detail message", async () => {
    mockFetch(409, { detail: "Category already exists" });
    await expect(api.createCategory({ name: "Food" })).rejects.toThrow("Category already exists");
  });

  it("throws the first validation message", async () => {
    mockFetch(422, { detail: [{ msg: "Input should be greater than 0" }] });
    await expect(
      api.createExpense({ title: "x", amount: -1, category_id: 1 }),
    ).rejects.toThrow("Input should be greater than 0");
  });

  it("handles a network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(api.getExpenses()).rejects.toThrow("Unable to reach the server");
  });
});
