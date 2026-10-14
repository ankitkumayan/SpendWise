import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { useAppSelector } from '../../../hooks/redux'

import {
  useGetTransactionsQuery,
} from '../../transactions/api/transactionApi'

function ReportsPage() {
  const language = useAppSelector(
    (state) => state.language.current,
  )

  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useGetTransactionsQuery()

  const formatCurrency = (
    amount: number,
  ) =>
    new Intl.NumberFormat(
      language === 'fr' ? 'fr-CA' : 'en-CA',
      {
        style: 'currency',
        currency: 'CAD',
      },
    ).format(amount)

  const monthlyData = Array.from(
    { length: 6 },
    (_, index) => {
      const date = new Date()

      date.setMonth(
        date.getMonth() - (5 - index),
      )

      const year = date.getFullYear()
      const month = date.getMonth()

      const monthTransactions =
        transactions.filter((transaction) => {
          const transactionDate =
            new Date(transaction.date)

          return (
            transactionDate.getFullYear() ===
              year &&
            transactionDate.getMonth() ===
              month
          )
        })

      const income =
        monthTransactions
          .filter(
            (transaction) =>
              transaction.type === 'income',
          )
          .reduce(
            (total, transaction) =>
              total + transaction.amount,
            0,
          )

      const expenses =
        monthTransactions
          .filter(
            (transaction) =>
              transaction.type === 'expense',
          )
          .reduce(
            (total, transaction) =>
              total + transaction.amount,
            0,
          )

      return {
        month: date.toLocaleDateString(
          language === 'fr'
            ? 'fr-CA'
            : 'en-CA',
          {
            month: 'short',
          },
        ),
        income,
        expenses,
      }
    },
  )

  const categoryTotals =
    transactions
      .filter(
        (transaction) =>
          transaction.type === 'expense',
      )
      .reduce<Record<string, number>>(
        (totals, transaction) => {
          totals[transaction.category] =
            (totals[transaction.category] || 0) +
            transaction.amount

          return totals
        },
        {},
      )

  const categoryData = Object.entries(
    categoryTotals,
  )
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort(
      (a, b) =>
        b.amount - a.amount,
    )

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-gray-500">
          {language === 'en'
            ? 'Loading reports...'
            : 'Chargement des rapports...'}
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {language === 'en'
          ? 'Unable to load reports.'
          : 'Impossible de charger les rapports.'}
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'en'
            ? 'Reports'
            : 'Rapports'}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {language === 'en'
            ? 'Understand your spending and income trends.'
            : 'Comprenez vos tendances de dépenses et de revenus.'}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          {language === 'en'
            ? 'Income vs Expenses'
            : 'Revenus vs dépenses'}
        </h2>

        <div className="h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip
                formatter={(value) =>
                  formatCurrency(
                    Number(value),
                  )
                }
              />

              <Legend />

              <Bar
                dataKey="income"
                name={
                  language === 'en'
                    ? 'Income'
                    : 'Revenus'
                }
                fill="#16a34a"
              />

              <Bar
                dataKey="expenses"
                name={
                  language === 'en'
                    ? 'Expenses'
                    : 'Dépenses'
                }
                fill="#dc2626"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          {language === 'en'
            ? 'Spending by Category'
            : 'Dépenses par catégorie'}
        </h2>

        {categoryData.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">
            {language === 'en'
              ? 'No expense data available.'
              : 'Aucune donnée de dépense disponible.'}
          </p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{
                  left: 20,
                  right: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis type="number" />

                <YAxis
                  type="category"
                  dataKey="category"
                  width={120}
                />

                <Tooltip
                  formatter={(value) =>
                    formatCurrency(
                      Number(value),
                    )
                  }
                />

                <Bar
                  dataKey="amount"
                  name={
                    language === 'en'
                      ? 'Spent'
                      : 'Dépensé'
                  }
                  fill="#2563eb"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  )
}

export default ReportsPage
