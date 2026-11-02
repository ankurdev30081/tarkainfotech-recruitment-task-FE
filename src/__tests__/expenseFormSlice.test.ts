import { describe, expect, it } from "vitest";
import reducer, { resetForm, setField } from "@/store/expenseFormSlice";

describe("expenseFormSlice", () => {
  it("updates a single field", () => {
    const state = reducer(undefined, setField({ field: "title", value: "Lunch" }));
    expect(state).toEqual({ title: "Lunch", amount: "", categoryId: "" });
  });

  it("resets the form", () => {
    const filled = { title: "Lunch", amount: "10", categoryId: "1" };
    expect(reducer(filled, resetForm())).toEqual({ title: "", amount: "", categoryId: "" });
  });
});
