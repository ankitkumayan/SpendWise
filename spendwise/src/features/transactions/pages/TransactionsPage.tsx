import { useMemo, useState } from 'react'

import Alert from '../../../components/feedback/Alert'

import { useAppSelector } from '../../../hooks/redux'

import TransactionForm, {
  type TransactionFormData,
} from '../components/TransactionForm'

import {
  useAddTransactionMutation,
  useDeleteTransactionMutation,
  useGetTransactionsQuery,
  useUpdateTransactionMutation,
} from '../api/transactionApi'

import type { Transaction } from '../types'

function TransactionsPage() {
  const language = useAppSelector(
    (state) => state.language.current,
  )

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)

  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useGetTransactionsQuery()

  const [
    addTransaction,
    { isLoading: isAdding },
  ] = useAddTransactionMutation()

  const [
    updateTransaction,
    { isLoading: isUpdating },
  ] = useUpdateTransactionMutation()

  const [
    deleteTransaction,
    { isLoading: isDeleting },
  ] = useDeleteTransactionMutation()

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        transactions.map(
          (transaction) => transaction.category,
        ),
      ),
    ).sort()
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    const searchTerm = search.toLowerCase()

    const filtered = transactions.filter(
      (transaction) => {
        const matchesSearch =
          transaction.description
            .toLowerCase()
            .includes(searchTerm) ||
          transaction.category
            .toLowerCase()
            .includes(searchTerm)

        const matchesCategory =
          categoryFilter === 'all' ||
          transaction.category === categoryFilter

        const matchesType =
          typeFilter === 'all' ||
          transaction.type === typeFilter

        return (
          matchesSearch &&
          matchesCategory &&
          matchesType
        )
      },
    )

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return (
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
          )

        case 'highest':
          return b.amount - a.amount

        case 'lowest':
          return a.amount - b.amount

        case 'newest':
        default:
          return (
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
          )
      }
    })
  }, [
    transactions,
    search,
    categoryFilter,
    typeFilter,
    sortBy,
  ])

  const hasActiveFilters =
    search !== '' ||
    categoryFilter !== 'all' ||
    typeFilter !== 'all' ||
    sortBy !== 'newest'

  const handleResetFilters = () => {
    setSearch('')
    setCategoryFilter('all')
    setTypeFilter('all')
    setSortBy('newest')
  }

  const handleAddTransaction = async (
    data: TransactionFormData,
  ) => {
    setMessage(null)

    try {
      await addTransaction(data).unwrap()

      setShowForm(false)

      setMessage({
        type: 'success',
        text:
          language === 'en'
            ? 'Transaction added successfully.'
            : 'Transaction ajoutée avec succès.',
      })
    } catch {
      setMessage({
        type: 'error',
        text:
          language === 'en'
            ? 'Failed to add transaction. Please try again.'
            : 'Échec de l’ajout de la transaction. Veuillez réessayer.',
      })
    }
  }

  const handleUpdateTransaction = async (
    data: TransactionFormData,
  ) => {
    if (!editingTransaction) {
      return
    }

    setMessage(null)

    try {
      await updateTransaction({
        id: editingTransaction.id,
        ...data,
      }).unwrap()

      setEditingTransaction(null)
      setShowForm(false)

      setMessage({
        type: 'success',
        text:
          language === 'en'
            ? 'Transaction updated successfully.'
            : 'Transaction mise à jour avec succès.',
      })
    } catch {
      setMessage({
        type: 'error',
        text:
          language === 'en'
            ? 'Failed to update transaction. Please try again.'
            : 'Échec de la mise à jour de la transaction. Veuillez réessayer.',
      })
    }
  }

  const handleEdit = (transaction: Transaction) => {
    setMessage(null)
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingTransaction(null)
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      language === 'en'
        ? 'Are you sure you want to delete this transaction?'
        : 'Êtes-vous sûr de vouloir supprimer cette transaction?',
    )

    if (!confirmed) {
      return
    }

    setMessage(null)

    try {
      await deleteTransaction(id).unwrap()

      setMessage({
        type: 'success',
        text:
          language === 'en'
            ? 'Transaction deleted successfully.'
            : 'Transaction supprimée avec succès.',
      })
    } catch {
      setMessage({
        type: 'error',
        text:
          language === 'en'
            ? 'Failed to delete transaction. Please try again.'
            : 'Échec de la suppression de la transaction. Veuillez réessayer.',
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

  const getCategoryLabel = (category: string) => {
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
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">
          {language === 'en'
            ? 'Loading transactions...'
            : 'Chargement des transactions...'}
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message={
          language === 'en'
            ? 'Unable to load transactions.'
            : 'Impossible de charger les transactions.'
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'en'
              ? 'Transactions'
              : 'Transactions'}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {language === 'en'
              ? 'Manage your income and expenses.'
              : 'Gérez vos revenus et vos dépenses.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMessage(null)
            setEditingTransaction(null)
            setShowForm(true)
          }}
          disabled={
            isAdding ||
            isUpdating ||
            isDeleting
          }
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {language === 'en'
            ? '+ Add Transaction'
            : '+ Ajouter une transaction'}
        </button>
      </div>

      {/* Feedback */}
      {message && (
        <Alert
          type={message.type}
          message={message.text}
        />
      )}

      {/* Transaction Form */}
      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingTransaction
                ? language === 'en'
                  ? 'Edit Transaction'
                  : 'Modifier la transaction'
                : language === 'en'
                  ? 'Add Transaction'
                  : 'Ajouter une transaction'}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {editingTransaction
                ? language === 'en'
                  ? 'Update the transaction details below.'
                  : 'Mettez à jour les détails de la transaction ci-dessous.'
                : language === 'en'
                  ? 'Add a new income or expense.'
                  : 'Ajoutez un nouveau revenu ou une nouvelle dépense.'}
            </p>
          </div>

          <TransactionForm
            initialData={
              editingTransaction
                ? {
                    description:
                      editingTransaction.description,
                    category:
                      editingTransaction.category,
                    amount:
                      editingTransaction.amount,
                    type:
                      editingTransaction.type,
                    date:
                      editingTransaction.date,
                  }
                : undefined
            }
            submitLabel={
              editingTransaction
                ? language === 'en'
                  ? 'Update Transaction'
                  : 'Modifier la transaction'
                : language === 'en'
                  ? 'Add Transaction'
                  : 'Ajouter une transaction'
            }
            onSubmit={
              editingTransaction
                ? handleUpdateTransaction
                : handleAddTransaction
            }
            onCancel={handleCancelForm}
          />

          {isAdding && (
            <p className="mt-3 text-sm text-gray-500">
              {language === 'en'
                ? 'Adding transaction...'
                : 'Ajout de la transaction...'}
            </p>
          )}

          {isUpdating && (
            <p className="mt-3 text-sm text-gray-500">
              {language === 'en'
                ? 'Updating transaction...'
                : 'Mise à jour de la transaction...'}
            </p>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {language === 'en'
                ? 'Search'
                : 'Rechercher'}
            </label>

            <input
              type="text"
              placeholder={
                language === 'en'
                  ? 'Description or category...'
                  : 'Description ou catégorie...'
              }
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {language === 'en'
                ? 'Category'
                : 'Catégorie'}
            </label>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                {language === 'en'
                  ? 'All Categories'
                  : 'Toutes les catégories'}
              </option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {language === 'en'
                ? 'Type'
                : 'Type'}
            </label>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                {language === 'en'
                  ? 'All Types'
                  : 'Tous les types'}
              </option>

              <option value="income">
                {language === 'en'
                  ? 'Income'
                  : 'Revenu'}
              </option>

              <option value="expense">
                {language === 'en'
                  ? 'Expense'
                  : 'Dépense'}
              </option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {language === 'en'
                ? 'Sort By'
                : 'Trier par'}
            </label>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="newest">
                {language === 'en'
                  ? 'Newest First'
                  : 'Plus récent'}
              </option>

              <option value="oldest">
                {language === 'en'
                  ? 'Oldest First'
                  : 'Plus ancien'}
              </option>

              <option value="highest">
                {language === 'en'
                  ? 'Highest Amount'
                  : 'Montant le plus élevé'}
              </option>

              <option value="lowest">
                {language === 'en'
                  ? 'Lowest Amount'
                  : 'Montant le plus faible'}
              </option>
            </select>
          </div>
        </div>

        {/* Filter summary */}
        <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            {language === 'en'
              ? 'Showing'
              : 'Affichage de'}{' '}
            <span className="font-medium text-gray-700">
              {filteredTransactions.length}
            </span>{' '}
            {language === 'en'
              ? 'of'
              : 'sur'}{' '}
            <span className="font-medium text-gray-700">
              {transactions.length}
            </span>{' '}
            {language === 'en'
              ? 'transactions'
              : 'transactions'}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {language === 'en'
                ? 'Reset Filters'
                : 'Réinitialiser les filtres'}
            </button>
          )}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">
                  {language === 'en'
                    ? 'Description'
                    : 'Description'}
                </th>

                <th className="px-6 py-4 font-semibold text-gray-600">
                  {language === 'en'
                    ? 'Category'
                    : 'Catégorie'}
                </th>

                <th className="px-6 py-4 font-semibold text-gray-600">
                  {language === 'en'
                    ? 'Date'
                    : 'Date'}
                </th>

                <th className="px-6 py-4 text-right font-semibold text-gray-600">
                  {language === 'en'
                    ? 'Amount'
                    : 'Montant'}
                </th>

                <th className="px-6 py-4 text-right font-semibold text-gray-600">
                  {language === 'en'
                    ? 'Action'
                    : 'Action'}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map(
                (transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {transaction.description}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {getCategoryLabel(
                        transaction.category,
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {transaction.date}
                    </td>

                    <td
                      className={`px-6 py-4 text-right font-semibold ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {transaction.type === 'income'
                        ? '+'
                        : '-'}
                      {formatCurrency(
                        transaction.amount,
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(transaction)
                          }
                          disabled={
                            isAdding ||
                            isUpdating ||
                            isDeleting
                          }
                          className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {language === 'en'
                            ? 'Edit'
                            : 'Modifier'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(transaction.id)
                          }
                          disabled={
                            isAdding ||
                            isUpdating ||
                            isDeleting
                          }
                          className="text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isDeleting
                            ? language === 'en'
                              ? 'Deleting...'
                              : 'Suppression...'
                            : language === 'en'
                              ? 'Delete'
                              : 'Supprimer'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-gray-700">
              {language === 'en'
                ? 'No transactions found.'
                : 'Aucune transaction trouvée.'}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {language === 'en'
                ? 'Try changing your filters or add a new transaction.'
                : 'Essayez de modifier vos filtres ou ajoutez une nouvelle transaction.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionsPage