import { useMemo, useState } from 'react'

import Alert from '../../../components/feedback/Alert'

import { useAppSelector } from '../../../hooks/redux'

import {
  useAddBudgetMutation,
  useDeleteBudgetMutation,
  useGetBudgetsQuery,
  useUpdateBudgetMutation,
} from '../api/budgetApi'

import { useGetTransactionsQuery } from '../../transactions/api/transactionApi'

import type { Budget } from '../types'

function BudgetsPage() {
  const language = useAppSelector(
    (state) => state.language.current,
  )

  const [category, setCategory] = useState('')
  const [monthlyLimit, setMonthlyLimit] = useState('')
  const [editingBudget, setEditingBudget] =
    useState<Budget | null>(null)

  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const {
    data: budgets = [],
    isLoading: budgetsLoading,
    isError: budgetsError,
  } = useGetBudgetsQuery()

  const {
    data: transactions = [],
    isLoading: transactionsLoading,
  } = useGetTransactionsQuery()

  const [
    addBudget,
    { isLoading: isAdding },
  ] = useAddBudgetMutation()

  const [
    updateBudget,
    { isLoading: isUpdating },
  ] = useUpdateBudgetMutation()

  const [
    deleteBudget,
    { isLoading: isDeleting },
  ] = useDeleteBudgetMutation()

  const currentMonth = new Date()
    .toISOString()
    .slice(0, 7)

  const categorySpending = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === 'expense' &&
          transaction.date.startsWith(
            currentMonth,
          ),
      )
      .reduce<Record<string, number>>(
        (totals, transaction) => {
          totals[transaction.category] =
            (totals[transaction.category] ?? 0) +
            transaction.amount

          return totals
        },
        {},
      )
  }, [transactions, currentMonth])

  const resetForm = () => {
    setCategory('')
    setMonthlyLimit('')
    setEditingBudget(null)
  }

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault()

    const limit = Number(monthlyLimit)

    if (!category || limit <= 0) {
      setMessage({
        type: 'error',
        text:
          language === 'en'
            ? 'Please enter a category and a valid monthly limit.'
            : 'Veuillez saisir une catégorie et une limite mensuelle valide.',
      })

      return
    }

    setMessage(null)

    try {
      if (editingBudget) {
        await updateBudget({
          id: editingBudget.id,
          category,
          monthlyLimit: limit,
        }).unwrap()

        setMessage({
          type: 'success',
          text:
            language === 'en'
              ? 'Budget updated successfully.'
              : 'Budget mis à jour avec succès.',
        })
      } else {
        await addBudget({
          category,
          monthlyLimit: limit,
        }).unwrap()

        setMessage({
          type: 'success',
          text:
            language === 'en'
              ? 'Budget added successfully.'
              : 'Budget ajouté avec succès.',
        })
      }

      resetForm()
    } catch {
      setMessage({
        type: 'error',
        text:
          language === 'en'
            ? 'Unable to save budget. Please try again.'
            : 'Impossible d’enregistrer le budget. Veuillez réessayer.',
      })
    }
  }

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setCategory(budget.category)
    setMonthlyLimit(
      budget.monthlyLimit.toString(),
    )
    setMessage(null)
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      language === 'en'
        ? 'Are you sure you want to delete this budget?'
        : 'Voulez-vous vraiment supprimer ce budget?',
    )

    if (!confirmed) {
      return
    }

    setMessage(null)

    try {
      await deleteBudget(id).unwrap()

      setMessage({
        type: 'success',
        text:
          language === 'en'
            ? 'Budget deleted successfully.'
            : 'Budget supprimé avec succès.',
      })
    } catch {
      setMessage({
        type: 'error',
        text:
          language === 'en'
            ? 'Unable to delete budget.'
            : 'Impossible de supprimer le budget.',
      })
    }
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(
      language === 'en' ? 'en-CA' : 'fr-CA',
      {
        style: 'currency',
        currency: 'CAD',
      },
    ).format(amount)

  if (budgetsLoading || transactionsLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">
          {language === 'en'
            ? 'Loading budgets...'
            : 'Chargement des budgets...'}
        </p>
      </div>
    )
  }

  if (budgetsError) {
    return (
      <Alert
        type="error"
        message={
          language === 'en'
            ? 'Unable to load budgets.'
            : 'Impossible de charger les budgets.'
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'en'
            ? 'Budgets'
            : 'Budgets'}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {language === 'en'
            ? 'Track your monthly spending against your budget limits.'
            : 'Suivez vos dépenses mensuelles par rapport à vos limites budgétaires.'}
        </p>
      </div>

      {message && (
        <Alert
          type={message.type}
          message={message.text}
        />
      )}

      {/* Budget Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          {editingBudget
            ? language === 'en'
              ? 'Edit Budget'
              : 'Modifier le budget'
            : language === 'en'
              ? 'Create Budget'
              : 'Créer un budget'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-5 grid gap-4 md:grid-cols-3"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {language === 'en'
                ? 'Category'
                : 'Catégorie'}
            </label>

            <input
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              placeholder={
                language === 'en'
                  ? 'e.g. Food'
                  : 'ex. Alimentation'
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {language === 'en'
                ? 'Monthly Limit'
                : 'Limite mensuelle'}
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={monthlyLimit}
              onChange={(event) =>
                setMonthlyLimit(
                  event.target.value,
                )
              }
              placeholder="500"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-end gap-3">
            <button
              type="submit"
              disabled={isAdding || isUpdating}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editingBudget
                ? language === 'en'
                  ? 'Update Budget'
                  : 'Modifier le budget'
                : language === 'en'
                  ? 'Add Budget'
                  : 'Ajouter un budget'}
            </button>

            {editingBudget && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {language === 'en'
                  ? 'Cancel'
                  : 'Annuler'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Budget Cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {budgets.map((budget) => {
          const spent =
            categorySpending[budget.category] ?? 0

          const percentage =
            budget.monthlyLimit > 0
              ? (spent / budget.monthlyLimit) * 100
              : 0

          const progressWidth = Math.min(
            percentage,
            100,
          )

          const isOverBudget =
            spent > budget.monthlyLimit

          const remaining =
            budget.monthlyLimit - spent

          return (
            <div
              key={budget.id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {budget.category}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {language === 'en'
                      ? 'Current month'
                      : 'Mois en cours'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(budget)
                    }
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {language === 'en'
                      ? 'Edit'
                      : 'Modifier'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(budget.id)
                    }
                    disabled={isDeleting}
                    className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    {language === 'en'
                      ? 'Delete'
                      : 'Supprimer'}
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {language === 'en'
                      ? 'Spent'
                      : 'Dépensé'}
                  </span>

                  <span
                    className={`font-semibold ${
                      isOverBudget
                        ? 'text-red-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {formatCurrency(spent)}
                  </span>
                </div>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${
                      isOverBudget
                        ? 'bg-red-500'
                        : 'bg-blue-600'
                    }`}
                    style={{
                      width: `${progressWidth}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {language === 'en'
                      ? 'Budget'
                      : 'Budget'}
                    : {formatCurrency(
                      budget.monthlyLimit,
                    )}
                  </span>

                  <span
                    className={
                      isOverBudget
                        ? 'font-medium text-red-600'
                        : 'font-medium text-green-600'
                    }
                  >
                    {isOverBudget
                      ? `${formatCurrency(
                          Math.abs(remaining),
                        )} ${
                          language === 'en'
                            ? 'over'
                            : 'dépassé'
                        }`
                      : `${formatCurrency(
                          remaining,
                        )} ${
                          language === 'en'
                            ? 'remaining'
                            : 'restant'
                        }`}
                  </span>
                </div>

                <p
                  className={`mt-2 text-xs ${
                    isOverBudget
                      ? 'text-red-500'
                      : 'text-gray-400'
                  }`}
                >
                  {percentage.toFixed(1)}%
                  {language === 'en'
                    ? ' used'
                    : ' utilisé'}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {budgets.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="font-medium text-gray-700">
            {language === 'en'
              ? 'No budgets yet.'
              : 'Aucun budget pour le moment.'}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {language === 'en'
              ? 'Create your first monthly budget above.'
              : 'Créez votre premier budget mensuel ci-dessus.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default BudgetsPage