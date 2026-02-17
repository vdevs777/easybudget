import AsyncStorage from "@react-native-async-storage/async-storage";

import { Status } from "@/types/enums/status";
import { Ordering } from "@/types/enums/ordering";
import { v4 } from "uuid";

const STORAGE_KEY = "@orcamento-de-servicos:budget";
const COUNTER_KEY = "@orcamento-de-servicos:budget_counter";

export type BudgetModel = {
  id: string;
  customer: string;
  title: string;
  items: ServiceModel[];
  totalValue: number;
  discountPct?: number;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
};

export type ServiceModel = {
  id: string;
  title: string;
  description: string;
  qty: number;
  price: number;
};

export type BudgetRequest = Omit<BudgetModel, "id" | "createdAt" | "updatedAt">;

async function generateIncrementId(): Promise<string> {
  try {
    const current = await AsyncStorage.getItem(COUNTER_KEY);

    const currentNumber = current ? Number(current) : 0;
    const nextNumber = currentNumber + 1;

    await AsyncStorage.setItem(COUNTER_KEY, String(nextNumber));

    return String(nextNumber);
  } catch (error) {
    throw new Error("BUDGETS_GENERATE_ID: " + error);
  }
}

async function get(): Promise<BudgetModel[]> {
  try {
    const storage = await AsyncStorage.getItem(STORAGE_KEY);
    return storage ? JSON.parse(storage) : [];
  } catch (error) {
    throw new Error("BUDGETS_GET: " + error);
  }
}

async function getByStatusAndOrdering(params: {
  ordering?: Ordering;
  statuses?: Status[];
}): Promise<BudgetModel[]> {
  try {
    const storage = await AsyncStorage.getItem(STORAGE_KEY);
    let budgets: BudgetModel[] = storage ? JSON.parse(storage) : [];

    const { ordering, statuses } = params;

    if (!ordering && (!statuses || statuses.length === 0)) {
      throw new Error("Pelo menos um filtro deve ser selecionado.");
    }

    if (statuses && statuses.length > 0) {
      budgets = budgets.filter((budget) => statuses.includes(budget.status));
    }

    const getBudgetValue = (budget: BudgetModel) => {
      const total = budget.items.reduce(
        (sum, item) => sum + item.qty * item.price,
        0,
      );

      if (budget.discountPct) {
        return total * (1 - budget.discountPct / 100);
      }

      return total;
    };

    if (ordering) {
      budgets.sort((a, b) => {
        switch (ordering) {
          case Ordering.NEWER:
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

          case Ordering.OLDEST:
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );

          case Ordering.HIGHEST_VALUE:
            return getBudgetValue(b) - getBudgetValue(a);

          case Ordering.LOWEST_VALUE:
            return getBudgetValue(a) - getBudgetValue(b);

          default:
            return 0;
        }
      });
    }

    return budgets;
  } catch (error) {
    throw new Error("BUDGETS_GET_BY_STATUS_AND_ORDERING: " + error);
  }
}

async function save(items: BudgetModel[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    throw new Error("BUDGETS_SAVE: " + error);
  }
}

async function add(newItem: BudgetRequest): Promise<string> {
  const items = await get();

  const mappedNewItem: BudgetModel = {
    ...newItem,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: await generateIncrementId(),
  };

  const updatedItems = [...items, mappedNewItem];
  await save(updatedItems);
  return mappedNewItem.id;
}

async function duplicateById(id: string): Promise<string> {
  try {
    const budgets = await get();

    const budgetToDuplicate = budgets.find((budget) => budget.id === id);

    if (!budgetToDuplicate) {
      throw new Error("Orçamento não encontrado.");
    }

    const now = new Date();

    const duplicatedBudget: BudgetModel = {
      ...budgetToDuplicate,
      id: await generateIncrementId(),
      title: `${budgetToDuplicate.title} (Cópia)`,
      createdAt: now,
      updatedAt: now,
      items: budgetToDuplicate.items.map((item) => ({
        ...item,
        id: v4(),
      })),
    };

    const updatedBudgets = [...budgets, duplicatedBudget];
    await save(updatedBudgets);

    return duplicatedBudget.id;
  } catch (error) {
    throw new Error("BUDGETS_DUPLICATE: " + error);
  }
}

async function edit(id: string, data: BudgetRequest): Promise<BudgetModel[]> {
  try {
    const budgets = await get();

    const budgetIndex = budgets.findIndex((budget) => budget.id === id);

    if (budgetIndex === -1) {
      throw new Error("Orçamento não encontrado.");
    }

    const currentBudget = budgets[budgetIndex];

    const updatedBudget: BudgetModel = {
      ...currentBudget,
      ...data,
      id: currentBudget.id,
      createdAt: currentBudget.createdAt,
      updatedAt: new Date(),
    };

    const updatedBudgets = [...budgets];
    updatedBudgets[budgetIndex] = updatedBudget;

    await save(updatedBudgets);

    return updatedBudgets;
  } catch (error) {
    throw new Error("BUDGETS_EDIT: " + error);
  }
}

async function deleteById(id: string): Promise<BudgetModel[]> {
  try {
    const budgets = await get();

    const exists = budgets.some((budget) => budget.id === id);

    if (!exists) {
      throw new Error("Orçamento não encontrado.");
    }

    const updatedBudgets = budgets.filter((budget) => budget.id !== id);

    await save(updatedBudgets);

    return updatedBudgets;
  } catch (error) {
    throw new Error("BUDGETS_DELETE: " + error);
  }
}

async function getById(id: string): Promise<BudgetModel> {
  try {
    const budgets = await get();

    const budget = budgets.find((budget) => budget.id === id);

    if (!budget) {
      throw new Error("Orçamento não encontrado.");
    }

    return budget;
  } catch (error) {
    throw new Error("BUDGETS_GET_BY_ID: " + error);
  }
}

export const budgetStorage = {
  getByStatusAndOrdering,
  duplicateById,
  deleteById,
  getById,
  save,
  edit,
  get,
  add,
};
