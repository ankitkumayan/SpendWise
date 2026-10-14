export type TransactionType = 'income' | 'expense'

export type Transaction = {
  id: number
  description: string
  category: string
  amount: number
  type: TransactionType
  date: string
}