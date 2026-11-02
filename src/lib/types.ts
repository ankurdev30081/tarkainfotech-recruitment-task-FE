export interface Category {
  id: number;
  name: string;
  total_expenses: number;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  created_at: string;
}

export interface Summary {
  total: number;
  count: number;
  average: number;
}

export interface NewCategory {
  name: string;
}

export interface NewExpense {
  title: string;
  amount: number;
  category_id: number;
}

/** POST /categories response */
export type CreatedCategory = Omit<Category, "total_expenses">;

/** POST /expenses response */
export interface CreatedExpense extends NewExpense {
  id: number;
  created_at: string;
}
