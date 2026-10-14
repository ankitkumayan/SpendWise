import type { Transaction } from '../../features/transactions/types'

const defaultTransactions: Transaction[] = [
  {
    id: 1,
    description: 'Grocery Store',
    category: 'Food',
    amount: 84.32,
    type: 'expense',
    date: '2026-10-05',
  },
  {
    id: 2,
    description: 'Salary',
    category: 'Income',
    amount: 2400,
    type: 'income',
    date: '2026-10-03',
  },
  {
    id: 3,
    description: 'Netflix',
    category: 'Entertainment',
    amount: 18.99,
    type: 'expense',
    date: '2026-10-02',
  },
  {
    id: 4,
    description: 'Gas Station',
    category: 'Transportation',
    amount: 62.4,
    type: 'expense',
    date: '2026-10-01',
  },
]

const STORAGE_KEY = 'spendwise_transactions'

export function getTransactions(): Transaction[] {
  const storedTransactions =
    localStorage.getItem(STORAGE_KEY)

  if (!storedTransactions) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultTransactions),
    )

    return defaultTransactions
  }

  return JSON.parse(storedTransactions) as Transaction[]
}

export function saveTransactions(
  transactions: Transaction[],
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions),
  )
}
