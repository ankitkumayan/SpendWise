import { http, HttpResponse } from 'msw'

import {
  getTransactions,
  saveTransactions,
} from './data/transactions'

import {
  getBudgets,
  saveBudgets,
} from './data/budgets'

export const handlers = [
  // -------------------------
  // Transactions
  // -------------------------

  http.get(
    'http://localhost:5000/api/transactions',
    () => {
      return HttpResponse.json(
        getTransactions(),
      )
    },
  ),

  http.post(
    'http://localhost:5000/api/transactions',
    async ({ request }) => {
      const body = (await request.json()) as Omit<
        Awaited<
          ReturnType<typeof getTransactions>
        >[number],
        'id'
      >

      const transactions = getTransactions()

      const newTransaction = {
        id: Date.now(),
        ...body,
      }

      transactions.unshift(newTransaction)

      saveTransactions(transactions)

      return HttpResponse.json(
        newTransaction,
        { status: 201 },
      )
    },
  ),

  http.put(
    'http://localhost:5000/api/transactions/:id',
    async ({ params, request }) => {
      const id = Number(params.id)

      const body = (await request.json()) as Omit<
        Awaited<
          ReturnType<typeof getTransactions>
        >[number],
        'id'
      >

      const transactions = getTransactions()

      const index = transactions.findIndex(
        (transaction) =>
          transaction.id === id,
      )

      if (index === -1) {
        return new HttpResponse(null, {
          status: 404,
        })
      }

      const updatedTransaction = {
        id,
        ...body,
      }

      transactions[index] =
        updatedTransaction

      saveTransactions(transactions)

      return HttpResponse.json(
        updatedTransaction,
      )
    },
  ),

  http.delete(
    'http://localhost:5000/api/transactions/:id',
    ({ params }) => {
      const id = Number(params.id)

      const transactions = getTransactions()

      const updatedTransactions =
        transactions.filter(
          (transaction) =>
            transaction.id !== id,
        )

      if (
        updatedTransactions.length ===
        transactions.length
      ) {
        return new HttpResponse(null, {
          status: 404,
        })
      }

      saveTransactions(
        updatedTransactions,
      )

      return new HttpResponse(null, {
        status: 204,
      })
    },
  ),

  // -------------------------
  // Budgets
  // -------------------------

  http.get(
    'http://localhost:5000/api/budgets',
    () => {
      return HttpResponse.json(
        getBudgets(),
      )
    },
  ),

  http.post(
    'http://localhost:5000/api/budgets',
    async ({ request }) => {
      const body =
        (await request.json()) as Omit<
          import('../features/budgets/types').Budget,
          'id'
        >

      const budgets = getBudgets()

      const newBudget = {
        id: Date.now(),
        ...body,
      }

      budgets.push(newBudget)

      saveBudgets(budgets)

      return HttpResponse.json(
        newBudget,
        { status: 201 },
      )
    },
  ),

  http.put(
    'http://localhost:5000/api/budgets/:id',
    async ({ params, request }) => {
      const id = Number(params.id)

      const body =
        (await request.json()) as Omit<
          import('../features/budgets/types').Budget,
          'id'
        >

      const budgets = getBudgets()

      const index = budgets.findIndex(
        (budget) => budget.id === id,
      )

      if (index === -1) {
        return new HttpResponse(null, {
          status: 404,
        })
      }

      const updatedBudget = {
        id,
        ...body,
      }

      budgets[index] = updatedBudget

      saveBudgets(budgets)

      return HttpResponse.json(
        updatedBudget,
      )
    },
  ),

  http.delete(
    'http://localhost:5000/api/budgets/:id',
    ({ params }) => {
      const id = Number(params.id)

      const budgets = getBudgets()

      const updatedBudgets =
        budgets.filter(
          (budget) =>
            budget.id !== id,
        )

      if (
        updatedBudgets.length ===
        budgets.length
      ) {
        return new HttpResponse(null, {
          status: 404,
        })
      }

      saveBudgets(updatedBudgets)

      return new HttpResponse(null, {
        status: 204,
      })
    },
  ),
]