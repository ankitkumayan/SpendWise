import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { setLanguage } from '../../app/languageSlice'
import { logout } from '../../features/auth/authSlice'

function TopBar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const language = useAppSelector(
    (state) => state.language.current,
  )

  const user = useAppSelector(
    (state) => state.auth.user,
  )

  const [isMenuOpen, setIsMenuOpen] =
    useState(false)

  const toggleLanguage = () => {
    dispatch(
      setLanguage(language === 'en' ? 'fr' : 'en'),
    )
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {language === 'en'
            ? 'Financial Overview'
            : 'Aperçu financier'}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleLanguage}
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          {language === 'en' ? 'FR' : 'EN'}
        </button>

        <div className="relative">
          <button
            onClick={() =>
              setIsMenuOpen((open) => !open)
            }
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600"
            aria-label="Open user menu"
          >
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
              <div className="border-b border-gray-100 pb-3">
                <p className="font-medium text-gray-900">
                  {user?.name}
                </p>

                <p className="truncate text-sm text-gray-500">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                {language === 'en'
                  ? 'Logout'
                  : 'Déconnexion'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar