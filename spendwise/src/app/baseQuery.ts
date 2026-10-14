import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'

import { logout } from '../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
  baseUrl:
    import.meta.env.VITE_API_BASE_URL,

  prepareHeaders: (
    headers,
    { getState },
  ) => {
    const state = getState() as {
      auth: {
        token: string | null
      }
    }

    const token = state.auth.token

    if (token) {
      headers.set(
        'Authorization',
        `Bearer ${token}`,
      )
    }

    return headers
  },
})

export const authenticatedBaseQuery:
  BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (
    args,
    api,
    extraOptions,
  ) => {
    const result = await baseQuery(
      args,
      api,
      extraOptions,
    )

    if (result.error?.status === 401) {
      api.dispatch(logout())
    }

    return result
  }