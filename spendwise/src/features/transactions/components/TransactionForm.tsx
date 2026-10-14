import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useAppSelector } from '../../../hooks/redux'

const transactionSchema = z.object({
  description: z
    .string()
    .min(2, 'Description must be at least 2 characters'),

  category: z
    .string()
    .min(1, 'Please select a category'),

  amount: z
    .number()
    .positive('Amount must be greater than 0'),

  type: z.enum(['income', 'expense']),

  date: z
    .string()
    .min(1, 'Date is required'),
})

export type TransactionFormData = z.infer<
  typeof transactionSchema
>

type TransactionFormProps = {
  initialData?: TransactionFormData
  submitLabel?: string
  onSubmit: (data: TransactionFormData) => void
  onCancel: () => void
}

function TransactionForm({
  initialData,
  submitLabel,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const language = useAppSelector(
    (state) => state.language.current,
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),

    defaultValues: initialData ?? {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const labels = {
    description:
      language === 'en'
        ? 'Description'
        : 'Description',

    descriptionPlaceholder:
      language === 'en'
        ? 'e.g. Grocery Store'
        : 'ex. Épicerie',

    category:
      language === 'en'
        ? 'Category'
        : 'Catégorie',

    selectCategory:
      language === 'en'
        ? 'Select category'
        : 'Sélectionner une catégorie',

    amount:
      language === 'en'
        ? 'Amount'
        : 'Montant',

    type:
      language === 'en'
        ? 'Type'
        : 'Type',

    expense:
      language === 'en'
        ? 'Expense'
        : 'Dépense',

    income:
      language === 'en'
        ? 'Income'
        : 'Revenu',

    date:
      language === 'en'
        ? 'Date'
        : 'Date',

    cancel:
      language === 'en'
        ? 'Cancel'
        : 'Annuler',

    addTransaction:
      language === 'en'
        ? 'Add Transaction'
        : 'Ajouter une transaction',

    updateTransaction:
      language === 'en'
        ? 'Update Transaction'
        : 'Modifier la transaction',
  }

  const categoryLabels = {
    Food:
      language === 'en'
        ? 'Food'
        : 'Alimentation',

    Transportation:
      language === 'en'
        ? 'Transportation'
        : 'Transport',

    Entertainment:
      language === 'en'
        ? 'Entertainment'
        : 'Divertissement',

    Shopping:
      language === 'en'
        ? 'Shopping'
        : 'Achats',

    Bills:
      language === 'en'
        ? 'Bills'
        : 'Factures',

    Income:
      language === 'en'
        ? 'Income'
        : 'Revenu',
  }

  const validationMessages = {
    description:
      language === 'en'
        ? 'Description must be at least 2 characters'
        : 'La description doit contenir au moins 2 caractères',

    category:
      language === 'en'
        ? 'Please select a category'
        : 'Veuillez sélectionner une catégorie',

    amount:
      language === 'en'
        ? 'Amount must be greater than 0'
        : 'Le montant doit être supérieur à 0',

    date:
      language === 'en'
        ? 'Date is required'
        : 'La date est requise',
  }

  const getSubmitLabel = () => {
    if (submitLabel) {
      return submitLabel
    }

    return initialData
      ? labels.updateTransaction
      : labels.addTransaction
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {labels.description}
        </label>

        <input
          {...register('description')}
          placeholder={labels.descriptionPlaceholder}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {validationMessages.description}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {labels.category}
        </label>

        <select
          {...register('category')}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">
            {labels.selectCategory}
          </option>

          <option value="Food">
            {categoryLabels.Food}
          </option>

          <option value="Transportation">
            {categoryLabels.Transportation}
          </option>

          <option value="Entertainment">
            {categoryLabels.Entertainment}
          </option>

          <option value="Shopping">
            {categoryLabels.Shopping}
          </option>

          <option value="Bills">
            {categoryLabels.Bills}
          </option>

          <option value="Income">
            {categoryLabels.Income}
          </option>
        </select>

        {errors.category && (
          <p className="mt-1 text-sm text-red-600">
            {validationMessages.category}
          </p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {labels.amount}
        </label>

        <input
          type="number"
          step="0.01"
          {...register('amount', {
            valueAsNumber: true,
          })}
          placeholder="0.00"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">
            {validationMessages.amount}
          </p>
        )}
      </div>

      {/* Type */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {labels.type}
        </label>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="expense"
              {...register('type')}
            />

            <span>{labels.expense}</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="income"
              {...register('type')}
            />

            <span>{labels.income}</span>
          </label>
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {labels.date}
        </label>

        <input
          type="date"
          {...register('date')}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {errors.date && (
          <p className="mt-1 text-sm text-red-600">
            {validationMessages.date}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {labels.cancel}
        </button>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {getSubmitLabel()}
        </button>
      </div>
    </form>
  )
}

export default TransactionForm