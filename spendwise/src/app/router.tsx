import { createBrowserRouter } from 'react-router-dom'

import AppLayout from '../components/layout/AppLayout'
import ProtectedRoute from '../features/auth/components/ProtectedRoute'

import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import TransactionsPage from '../features/transactions/pages/TransactionsPage'
import BudgetsPage from '../features/budgets/pages/BudgetsPage'
import ReportsPage from '../features/reports/pages/ReportsPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },

  {
    path: '/register',
    element: <RegisterPage />,
  },

  {
    element: <ProtectedRoute />,

    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: 'transactions',
            element: <TransactionsPage />,
          },
          {
            path: 'budgets',
            element: <BudgetsPage />,
          },
          {
            path: 'reports',
            element: <ReportsPage />,
          },
        ],
      },
    ],
  },
])