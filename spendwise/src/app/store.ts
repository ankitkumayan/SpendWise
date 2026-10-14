import { configureStore } from '@reduxjs/toolkit'

import languageReducer from './languageSlice'
import authReducer from '../features/auth/authSlice'

import { authApi } from '../features/auth/authApi'
import { transactionApi } from '../features/transactions/api/transactionApi'
import { budgetApi } from '../features/budgets/api/budgetApi'

export const store = configureStore({
  reducer: {
    language: languageReducer,
    auth: authReducer,

    [authApi.reducerPath]:
      authApi.reducer,

    [transactionApi.reducerPath]:
      transactionApi.reducer,

    [budgetApi.reducerPath]:
      budgetApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(transactionApi.middleware)
      .concat(budgetApi.middleware),
})

export type RootState = ReturnType<
  typeof store.getState
>

export type AppDispatch = typeof store.dispatch