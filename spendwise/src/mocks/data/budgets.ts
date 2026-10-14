import type { Budget } from '../../features/budgets/types'

const defaultBudgets: Budget[] = [
  {
    id: 1,
    category: 'Food',
    monthlyLimit: 500,
  },
  {
    id: 2,
    category: 'Transportation',
    monthlyLimit: 250,
  },
  {
    id: 3,
    category: 'Entertainment',
    monthlyLimit: 150,
  },
  {
    id: 4,
    category: 'Bills',
    monthlyLimit: 800,
  },
]

const STORAGE_KEY = 'spendwise_budgets'

export function getBudgets(): Budget[] {
  const storedBudgets =
    localStorage.getItem(STORAGE_KEY)

  if (!storedBudgets) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultBudgets),
    )

    return defaultBudgets
  }

  return JSON.parse(storedBudgets) as Budget[]
}

export function saveBudgets(
  budgets: Budget[],
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(budgets),
  )
}