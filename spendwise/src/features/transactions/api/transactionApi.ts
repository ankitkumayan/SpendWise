import { createApi } from '@reduxjs/toolkit/query/react'

import { authenticatedBaseQuery } from '../../../app/baseQuery'
import type { Transaction } from '../types'

export const transactionApi = createApi({
  reducerPath: 'transactionApi',

  baseQuery: authenticatedBaseQuery,

  tagTypes: ['Transaction'],

  endpoints: (builder) => ({
    getTransactions: builder.query<
      Transaction[],
      void
    >({
      query: () => '/transactions',

      providesTags: ['Transaction'],
    }),

    addTransaction: builder.mutation<
      Transaction,
      Omit<Transaction, 'id'>
    >({
      query: (transaction) => ({
        url: '/transactions',
        method: 'POST',
        body: transaction,
      }),

      invalidatesTags: ['Transaction'],
    }),

    updateTransaction: builder.mutation<
      Transaction,
      Transaction
    >({
      query: (transaction) => ({
        url: `/transactions/${transaction.id}`,
        method: 'PUT',
        body: transaction,
      }),

      invalidatesTags: ['Transaction'],
    }),

    deleteTransaction: builder.mutation<
      void,
      number
    >({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Transaction'],
    }),
  }),
})

export const {
  useGetTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApi