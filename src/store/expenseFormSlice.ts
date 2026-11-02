import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ExpenseFormState {
  title: string;
  amount: string;
  categoryId: string;
}

const initialState: ExpenseFormState = { title: "", amount: "", categoryId: "" };

const expenseFormSlice = createSlice({
  name: "expenseForm",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof ExpenseFormState; value: string }>,
    ) => {
      state[action.payload.field] = action.payload.value;
    },
    resetForm: () => initialState,
  },
});

export const { setField, resetForm } = expenseFormSlice.actions;
export default expenseFormSlice.reducer;
