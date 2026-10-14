import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import { useAppSelector } from '../../../hooks/redux'

import {
  useGetTransactionsQuery,
} from '../../transactions/api/transactionApi'

import {
  useGetBudgetsQuery,
} from '../../budgets/api/budgetApi'

function DashboardPage() {
  const language = useAppSelector(
    (state) => state.language.current,
  )

  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    isError: transactionsError,
  } = useGetTransactionsQuery()

  const {
    data: budgets = [],
    isLoading: budgetsLoading,
    isError: budgetsError,
  } = useGetBudgetsQuery()

  const isLoading =
    transactionsLoading || budgetsLoading

  const hasError =
    transactionsError || budgetsError

  const income = transactions
    .filter(
      (transaction) =>
        transaction.type === 'income',
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0,
    )

  const expenses = transactions
    .filter(
      (transaction) =>
        transaction.type === 'expense',
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0,
    )

  const balance = income - expenses

  const savingsRate =
    income > 0
      ? Math.round(
          ((income - expenses) / income) * 100,
        )
      : 0

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

  const chartData = Object.entries(
    categoryTotals,
  ).map(([name, value]) => ({
    name,
    value,
  }))

  const recentTransactions =
    [...transactions]
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime(),
      )
      .slice(0, 5)

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

  const getCategoryLabel = (
    category: string,
  ) => {
    if (language === 'en') {
      return category
    }

    const translations: Record<string, string> = {
      Food: 'Alimentation',
      Transportation: 'Transport',
      Entertainment: 'Divertissement',
      Shopping: 'Achats',
      Bills: 'Factures',
      Income: 'Revenu',
    }

    return translations[category] ?? category
  }

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-gray-500">
          {language === 'en'
            ? 'Loading dashboard...'
            : 'Chargement du tableau de bord...'}
        </p>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {language === 'en'
          ? 'Unable to load dashboard data.'
          : 'Impossible de charger les données du tableau de bord.'}
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {language === 'en'
            ? 'Dashboard'
            : 'Tableau de bord'}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {language === 'en'
            ? 'Here is your financial overview.'
            : 'Voici votre aperçu financier.'}
        </p>
      </div>

      {/* Summary Cards */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Balance */}

        <div className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              {language === 'en'
                ? 'Balance'
                : 'Solde'}
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-lg">
              $
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            {formatCurrency(balance)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {language === 'en'
              ? 'Current net balance'
              : 'Solde net actuel'}
          </p>
        </div>

        {/* Income */}

        <div className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              {language === 'en'
                ? 'Income'
                : 'Revenus'}
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-lg text-green-700">
              ↑
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold tracking-tight text-green-700">
            {formatCurrency(income)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {language === 'en'
              ? 'Total recorded income'
              : 'Revenus totaux enregistrés'}
          </p>
        </div>

        {/* Expenses */}

        <div className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-red-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              {language === 'en'
                ? 'Expenses'
                : 'Dépenses'}
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-lg text-red-700">
              ↓
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold tracking-tight text-red-600">
            {formatCurrency(expenses)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {language === 'en'
              ? 'Total recorded expenses'
              : 'Dépenses totales enregistrées'}
          </p>
        </div>

        {/* Savings */}

        <div className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              {language === 'en'
                ? 'Savings Rate'
                : "Taux d'épargne"}
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-lg text-purple-700">
              %
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold tracking-tight text-purple-700">
            {savingsRate}%
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {language === 'en'
              ? 'Income retained'
              : 'Revenus conservés'}
          </p>
        </div>

      </div>

      {/* Charts + Budgets */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Spending Chart */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'en'
                ? 'Spending by Category'
                : 'Dépenses par catégorie'}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {language === 'en'
                ? 'Where your money is going'
                : 'Où va votre argent'}
            </p>
          </div>

          {chartData.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-sm text-gray-500">
                {language === 'en'
                  ? 'No expense data yet.'
                  : 'Aucune donnée de dépense.'}
              </p>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={55}
                    paddingAngle={3}
                    label
                  >
                    {chartData.map(
                      (_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(${index * 55}, 70%, 50%)`}
                        />
                      ),
                    )}
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(
                        Number(value),
                      )
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Budget Overview */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'en'
                ? 'Budget Overview'
                : 'Aperçu des budgets'}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {language === 'en'
                ? 'Track your monthly spending limits'
                : 'Suivez vos limites mensuelles'}
            </p>
          </div>

          {budgets.length === 0 ? (
            <div className="flex h-56 items-center justify-center">
              <p className="text-sm text-gray-500">
                {language === 'en'
                  ? 'No budgets created yet.'
                  : 'Aucun budget créé.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {budgets.map((budget) => {
                const spent =
                  categoryTotals[
                    budget.category
                  ] || 0

                const rawPercentage =
                  budget.monthlyLimit > 0
                    ? (spent /
                        budget.monthlyLimit) *
                      100
                    : 0

                const percentage =
                  Math.min(
                    rawPercentage,
                    100,
                  )

                const isOverBudget =
                  spent >
                  budget.monthlyLimit

                const isNearLimit =
                  rawPercentage >= 80 &&
                  !isOverBudget

                return (
                  <div key={budget.id}>

                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {getCategoryLabel(
                            budget.category,
                          )}
                        </p>

                        <p className="text-xs text-gray-500">
                          {formatCurrency(
                            spent,
                          )}{' '}
                          /{' '}
                          {formatCurrency(
                            budget.monthlyLimit,
                          )}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isOverBudget
                            ? 'bg-red-100 text-red-700'
                            : isNearLimit
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {isOverBudget
                          ? language === 'en'
                            ? 'Over budget'
                            : 'Budget dépassé'
                          : `${Math.round(rawPercentage)}%`}
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOverBudget
                            ? 'bg-red-500'
                            : isNearLimit
                              ? 'bg-amber-500'
                              : 'bg-blue-600'
                        }`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* Recent Transactions */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'en'
                ? 'Recent Transactions'
                : 'Transactions récentes'}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {language === 'en'
                ? 'Your latest financial activity'
                : 'Votre activité financière récente'}
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {recentTransactions.length}
          </span>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="rounded-xl bg-gray-50 py-10 text-center">
            <p className="text-sm text-gray-500">
              {language === 'en'
                ? 'No transactions yet.'
                : 'Aucune transaction.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
                  <th className="px-3 py-3 font-semibold">
                    {language === 'en'
                      ? 'Description'
                      : 'Description'}
                  </th>

                  <th className="px-3 py-3 font-semibold">
                    {language === 'en'
                      ? 'Category'
                      : 'Catégorie'}
                  </th>

                  <th className="px-3 py-3 font-semibold">
                    {language === 'en'
                      ? 'Date'
                      : 'Date'}
                  </th>

                  <th className="px-3 py-3 text-right font-semibold">
                    {language === 'en'
                      ? 'Amount'
                      : 'Montant'}
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentTransactions.map(
                  (transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-3 py-4">
                        <span className="font-medium text-gray-900">
                          {transaction.description}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          {getCategoryLabel(
                            transaction.category,
                          )}
                        </span>
                      </td>

                      <td className="px-3 py-4 text-gray-500">
                        {transaction.date}
                      </td>

                      <td
                        className={`px-3 py-4 text-right font-semibold ${
                          transaction.type ===
                          'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type ===
                        'income'
                          ? '+'
                          : '-'}
                        {formatCurrency(
                          transaction.amount,
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

export default DashboardPage