import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type Language = 'en' | 'fr'

type LanguageState = {
  current: Language
}

const storedLanguage =
  localStorage.getItem('spendwise_language') as Language | null

const initialState: LanguageState = {
  current: storedLanguage === 'fr' ? 'fr' : 'en',
}

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (
      state,
      action: PayloadAction<Language>,
    ) => {
      state.current = action.payload

      localStorage.setItem(
        'spendwise_language',
        action.payload,
      )
    },
  },
})

export const { setLanguage } = languageSlice.actions

export default languageSlice.reducer