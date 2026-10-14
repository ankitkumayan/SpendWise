import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type User = {
  id: number
  name: string
  email: string
}

type AuthState = {
  token: string | null
  user: User | null
}

const storedToken = localStorage.getItem('spendwise_token')
const storedUser = localStorage.getItem('spendwise_user')

const initialState: AuthState = {
  token: storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,
}

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string
        user: User
      }>,
    ) => {
      state.token = action.payload.token
      state.user = action.payload.user

      localStorage.setItem(
        'spendwise_token',
        action.payload.token,
      )

      localStorage.setItem(
        'spendwise_user',
        JSON.stringify(action.payload.user),
      )
    },

    logout: (state) => {
      state.token = null
      state.user = null

      localStorage.removeItem('spendwise_token')
      localStorage.removeItem('spendwise_user')
    },
  },
})

export const {
  setCredentials,
  logout,
} = authSlice.actions

export default authSlice.reducer