import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import TransactionsPage from './TransactionsPage'

const mockAddTransaction = vi.fn()
const mockUpdateTransaction = vi.fn()
const mockDeleteTransaction = vi.fn()

vi.mock(
  '../../../hooks/redux',
  () => ({
    useAppSelector: () => 'en',
  }),
)

vi.mock(
  '../../../components/feedback/Alert',
  () => ({
    default: ({
      message,
    }: {
      message: string
    }) => <div role="alert">{message}</div>,
  }),
)

vi.mock(
  '../components/TransactionForm',
  () => ({
    default: ({
      onSubmit,
      onCancel,
      submitLabel,
    }: {
      onSubmit: (data: {
        description: string
        category: string
        amount: number
        type: 'income' | 'expense'
        date: string
      }) => void
      onCancel: () => void
      submitLabel?: string
    }) => (
      <div>
        <button
          type="button"
          onClick={() =>
            onSubmit({
              description: 'Test Transaction',
              category: 'Food',
              amount: 100,
              type: 'expense',
              date: '2026-10-05',
            })
          }
        >
          {submitLabel ?? 'Submit'}
        </button>

        <button
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    ),
  }),
)

vi.mock(
  '../api/transactionApi',
  () => ({
    useGetTransactionsQuery: () => ({
      data: [
        {
          id: 1,
          description: 'Salary',
          category: 'Income',
          amount: 3000,
          type: 'income',
          date: '2026-10-01',
        },
        {
          id: 2,
          description: 'Groceries',
          category: 'Food',
          amount: 500,
          type: 'expense',
          date: '2026-10-02',
        },
        {
          id: 3,
          description: 'Rent',
          category: 'Bills',
          amount: 1200,
          type: 'expense',
          date: '2026-10-03',
        },
      ],
      isLoading: false,
      isError: false,
    }),

    useAddTransactionMutation: () => [
      mockAddTransaction,
      { isLoading: false },
    ],

    useUpdateTransactionMutation: () => [
      mockUpdateTransaction,
      { isLoading: false },
    ],

    useDeleteTransactionMutation: () => [
      mockDeleteTransaction,
      { isLoading: false },
    ],
  }),
)

describe('TransactionsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockAddTransaction.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          id: 4,
          description: 'Test Transaction',
          category: 'Food',
          amount: 100,
          type: 'expense',
          date: '2026-10-05',
        }),
    })

    mockUpdateTransaction.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          id: 2,
          description: 'Updated Transaction',
          category: 'Food',
          amount: 600,
          type: 'expense',
          date: '2026-10-05',
        }),
    })

    mockDeleteTransaction.mockReturnValue({
      unwrap: () => Promise.resolve(),
    })

    vi.spyOn(window, 'confirm')
      .mockReturnValue(true)
  })

  it('displays transactions and filter controls', () => {
    render(<TransactionsPage />)

    expect(
      screen.getByText('Salary'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Groceries'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Rent'),
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(
        'Description or category...',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByDisplayValue(
        'All Categories',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByDisplayValue(
        'All Types',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByDisplayValue(
        'Newest First',
      ),
    ).toBeInTheDocument()
  })

  it('filters transactions by search text', () => {
    render(<TransactionsPage />)

    const searchInput =
      screen.getByPlaceholderText(
        'Description or category...',
      )

    fireEvent.change(searchInput, {
      target: {
        value: 'grocer',
      },
    })

    expect(
      screen.getByText('Groceries'),
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Salary'),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('Rent'),
    ).not.toBeInTheDocument()
  })

  it('filters transactions by type', () => {
    render(<TransactionsPage />)

    const typeSelect =
      screen.getByDisplayValue(
        'All Types',
      )

    fireEvent.change(typeSelect, {
      target: {
        value: 'income',
      },
    })

    expect(
      screen.getByText('Salary'),
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Groceries'),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('Rent'),
    ).not.toBeInTheDocument()
  })

  it('filters transactions by category', () => {
    render(<TransactionsPage />)

    const categorySelect =
      screen.getByDisplayValue(
        'All Categories',
      )

    fireEvent.change(categorySelect, {
      target: {
        value: 'Food',
      },
    })

    expect(
      screen.getByText('Groceries'),
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Salary'),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('Rent'),
    ).not.toBeInTheDocument()
  })

  it('sorts transactions by highest amount', () => {
    render(<TransactionsPage />)

    const sortSelect =
      screen.getByDisplayValue(
        'Newest First',
      )

    fireEvent.change(sortSelect, {
      target: {
        value: 'highest',
      },
    })

    const rows =
      screen.getAllByRole('row')

    expect(
      rows[1],
    ).toHaveTextContent('Salary')

    expect(
      rows[2],
    ).toHaveTextContent('Rent')

    expect(
      rows[3],
    ).toHaveTextContent('Groceries')
  })

  it('resets active filters', () => {
    render(<TransactionsPage />)

    const searchInput =
      screen.getByPlaceholderText(
        'Description or category...',
      )

    fireEvent.change(searchInput, {
      target: {
        value: 'grocer',
      },
    })

    expect(
      screen.getByText('Reset Filters'),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByText('Reset Filters'),
    )

    expect(
      searchInput,
    ).toHaveValue('')

    expect(
      screen.getByText('Salary'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Rent'),
    ).toBeInTheDocument()
  })

  it('opens the add transaction form', () => {
    render(<TransactionsPage />)

    fireEvent.click(
      screen.getByRole('button', {
        name: '+ Add Transaction',
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: 'Add Transaction',
      }),
    ).toBeInTheDocument()
  })

  it('adds a transaction successfully', async () => {
    render(<TransactionsPage />)

    fireEvent.click(
      screen.getByRole('button', {
        name: '+ Add Transaction',
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Add Transaction',
      }),
    )

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(
      'Transaction added successfully.',
    )

    expect(
      mockAddTransaction,
    ).toHaveBeenCalledWith({
      description: 'Test Transaction',
      category: 'Food',
      amount: 100,
      type: 'expense',
      date: '2026-10-05',
    })
  })

  it('opens the edit form for a transaction', () => {
    render(<TransactionsPage />)

    const editButtons =
      screen.getAllByRole('button', {
        name: 'Edit',
      })

    fireEvent.click(editButtons[0])

    expect(
      screen.getByText('Edit Transaction'),
    ).toBeInTheDocument()
  })

  it('updates a transaction successfully', async () => {
    render(<TransactionsPage />)

    const editButtons =
      screen.getAllByRole('button', {
        name: 'Edit',
      })

    fireEvent.click(editButtons[1])

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Update Transaction',
      }),
    )

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(
      'Transaction updated successfully.',
    )

    expect(
      mockUpdateTransaction,
    ).toHaveBeenCalledWith({
      id: 2,
      description: 'Test Transaction',
      category: 'Food',
      amount: 100,
      type: 'expense',
      date: '2026-10-05',
    })
  })

  it('deletes a transaction after confirmation', async () => {
    render(<TransactionsPage />)

    const rentRow = screen
      .getByText('Rent')
      .closest('tr')

    expect(rentRow).not.toBeNull()

    const deleteButton =
      rentRow!.querySelector(
        'button:last-child',
      )

    expect(deleteButton).not.toBeNull()

    fireEvent.click(deleteButton!)

    expect(
      window.confirm,
    ).toHaveBeenCalled()

    expect(
      mockDeleteTransaction,
    ).toHaveBeenCalledWith(3)

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(
      'Transaction deleted successfully.',
    )
  })

  it('does not delete when confirmation is cancelled', () => {
    vi.mocked(window.confirm)
      .mockReturnValue(false)

    render(<TransactionsPage />)

    const rentRow = screen
      .getByText('Rent')
      .closest('tr')

    expect(rentRow).not.toBeNull()

    const deleteButton =
      rentRow!.querySelector(
        'button:last-child',
      )

    expect(deleteButton).not.toBeNull()

    fireEvent.click(deleteButton!)

    expect(
      mockDeleteTransaction,
    ).not.toHaveBeenCalled()
  })
})