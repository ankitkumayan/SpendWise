import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

type User = {
  id: number
  name: string
  email: string
}

type AuthResponse = {
  token: string
  user: User
}

type RegisterRequest = {
  name: string
  email: string
  password: string
}

type LoginRequest = {
  email: string
  password: string
}

export const authApi = createApi({
  reducerPath: 'authApi',

  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_API_BASE_URL,
  }),

  endpoints: (builder) => ({
    register: builder.mutation<
      AuthResponse,
      RegisterRequest
    >({
      query: (body) => ({
        url: '/Auth/register',
        method: 'POST',
        body,
      }),
    }),

    login: builder.mutation<
      AuthResponse,
      LoginRequest
    >({
      query: (body) => ({
        url: '/Auth/login',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
} = authApi