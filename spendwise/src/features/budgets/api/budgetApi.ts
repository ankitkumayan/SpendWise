import { createApi } from '@reduxjs/toolkit/query/react'

import { authenticatedBaseQuery } from '../../../app/baseQuery'
import type { Budget } from '../types'

export const budgetApi = createApi({
  reducerPath: 'budgetApi',

  baseQuery: authenticatedBaseQuery,

  tagTypes: ['Budget'],

  endpoints: (builder) => ({
    getBudgets: builder.query<Budget[], void>({
      query: () => '/budgets',

      providesTags: ['Budget'],
    }),

    addBudget: builder.mutation<
      Budget,
      Omit<Budget, 'id'>
    >({
      query: (budget) => ({
        url: '/budgets',
        method: 'POST',
        body: budget,
      }),

      invalidatesTags: ['Budget'],
    }),

    updateBudget: builder.mutation<
      Budget,
      Budget
    >({
      query: (budget) => ({
        url: `/budgets/${budget.id}`,
        method: 'PUT',
        body: budget,
      }),

      invalidatesTags: ['Budget'],
    }),

    deleteBudget: builder.mutation<void, number>({
      query: (id) => ({
        url: `/budgets/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Budget'],
    }),
  }),
})

export const {
  useGetBudgetsQuery,
  useAddBudgetMutation,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
} = budgetApi