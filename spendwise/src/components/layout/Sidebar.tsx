import { NavLink } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { setLanguage } from '../../app/languageSlice'

const navigation = [
  {
    name: {
      en: 'Dashboard',
      fr: 'Tableau de bord',
    },
    path: '/',
  },
  {
    name: {
      en: 'Transactions',
      fr: 'Transactions',
    },
    path: '/transactions',
  },
  {
    name: {
      en: 'Budgets',
      fr: 'Budgets',
    },
    path: '/budgets',
  },
  {
    name: {
      en: 'Reports',
      fr: 'Rapports',
    },
    path: '/reports',
  },
]

function Sidebar() {
  const language = useAppSelector(
    (state) => state.language.current,
  )

  const dispatch = useAppDispatch()

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-5">
        <h1 className="text-2xl font-bold text-blue-600">
          SpendWise
        </h1>

        <p className="text-sm text-gray-500">
          {language === 'en'
            ? 'Personal Finance'
            : 'Finances personnelles'}
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {item.name[language]}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <button
          onClick={() =>
            dispatch(
              setLanguage(
                language === 'en' ? 'fr' : 'en',
              ),
            )
          }
          className="w-full rounded-lg px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-50"
        >
          {language === 'en' ? 'Switch to French' : 'Passer à l’anglais'}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar