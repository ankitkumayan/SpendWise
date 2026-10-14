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

import BudgetsPage from './BudgetsPage'

const mockAddBudget = vi.fn()
const mockUpdateBudget = vi.fn()
const mockDeleteBudget = vi.fn()

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
  '../api/budgetApi',
  () => ({
    useGetBudgetsQuery: () => ({
      data: [
        {
          id: 1,
          category: 'Food',
          monthlyLimit: 600,
        },
        {
          id: 2,
          category: 'Entertainment',
          monthlyLimit: 200,
        },
      ],
      isLoading: false,
      isError: false,
    }),

    useAddBudgetMutation: () => [
      mockAddBudget,
      { isLoading: false },
    ],

    useUpdateBudgetMutation: () => [
      mockUpdateBudget,
      { isLoading: false },
    ],

    useDeleteBudgetMutation: () => [
      mockDeleteBudget,
      { isLoading: false },
    ],
  }),
)

vi.mock(
  '../../transactions/api/transactionApi',
  () => ({
    useGetTransactionsQuery: () => ({
      data: [
        {
          id: 1,
          description: 'Groceries',
          category: 'Food',
          amount: 500,
          type: 'expense',
          date: '2026-10-02',
        },
        {
          id: 2,
          description: 'Netflix',
          category: 'Entertainment',
          amount: 50,
          type: 'expense',
          date: '2026-10-03',
        },
      ],
      isLoading: false,
      isError: false,
    }),
  }),
)

describe('BudgetsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockAddBudget.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          id: 3,
          category: 'Transportation',
          monthlyLimit: 300,
        }),
    })

    mockUpdateBudget.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          id: 1,
          category: 'Food',
          monthlyLimit: 700,
        }),
    })

    mockDeleteBudget.mockReturnValue({
      unwrap: () => Promise.resolve(),
    })

    vi.spyOn(window, 'confirm')
      .mockReturnValue(true)
  })

  it('displays budgets and spending information', () => {
    render(<BudgetsPage />)

    expect(
      screen.getByText('Budgets'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Food'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Entertainment'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('$500.00'),
    ).toBeInTheDocument()
  })

  it('calculates budget usage percentage', () => {
    render(<BudgetsPage />)

    const foodCard = screen
      .getByText('Food')
      .closest('div.rounded-xl')

    expect(foodCard).not.toBeNull()

    expect(
      foodCard,
    ).toHaveTextContent('83.3%')

    expect(
      foodCard,
    ).toHaveTextContent('$500.00')

    expect(
      foodCard,
    ).toHaveTextContent('$600.00')
  })

  it('shows remaining budget amount', () => {
    render(<BudgetsPage />)

    const foodCard = screen
      .getByText('Food')
      .closest('div.rounded-xl')

    expect(foodCard).not.toBeNull()

    expect(
      foodCard,
    ).toHaveTextContent('$100.00')

    expect(
      foodCard,
    ).toHaveTextContent('remaining')
  })

  it('displays the budget form', () => {
    render(<BudgetsPage />)

    expect(
      screen.getByText('Create Budget'),
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(
        'e.g. Food',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText('500'),
    ).toBeInTheDocument()
  })

  it('adds a budget successfully', async () => {
    render(<BudgetsPage />)

    const categoryInput =
      screen.getByPlaceholderText(
        'e.g. Food',
      )

    const limitInput =
      screen.getByPlaceholderText('500')

    fireEvent.change(categoryInput, {
      target: {
        value: 'Transportation',
      },
    })

    fireEvent.change(limitInput, {
      target: {
        value: '300',
      },
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Add Budget',
      }),
    )

    expect(
      mockAddBudget,
    ).toHaveBeenCalledWith({
      category: 'Transportation',
      monthlyLimit: 300,
    })

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(
      'Budget added successfully.',
    )
  })

  it('shows validation message for invalid budget', () => {
    render(<BudgetsPage />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Add Budget',
      }),
    )

    expect(
      screen.getByRole('alert'),
    ).toHaveTextContent(
      'Please enter a category and a valid monthly limit.',
    )

    expect(
      mockAddBudget,
    ).not.toHaveBeenCalled()
  })

  it('opens the edit form', () => {
    render(<BudgetsPage />)

    const foodCard = screen
      .getByText('Food')
      .closest('div.rounded-xl')

    expect(foodCard).not.toBeNull()

    const editButton =
      foodCard!.querySelector(
        'button:first-of-type',
      )

    expect(editButton).not.toBeNull()

    fireEvent.click(editButton!)

    expect(
      screen.getByText('Edit Budget'),
    ).toBeInTheDocument()

    expect(
      screen.getByDisplayValue('Food'),
    ).toBeInTheDocument()

    expect(
      screen.getByDisplayValue('600'),
    ).toBeInTheDocument()
  })

  it('updates a budget successfully', async () => {
    render(<BudgetsPage />)

    const foodCard = screen
      .getByText('Food')
      .closest('div.rounded-xl')

    expect(foodCard).not.toBeNull()

    const editButton =
      foodCard!.querySelector(
        'button:first-of-type',
      )

    expect(editButton).not.toBeNull()

    fireEvent.click(editButton!)

    const limitInput =
      screen.getByDisplayValue('600')

    fireEvent.change(limitInput, {
      target: {
        value: '700',
      },
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Update Budget',
      }),
    )

    expect(
      mockUpdateBudget,
    ).toHaveBeenCalledWith({
      id: 1,
      category: 'Food',
      monthlyLimit: 700,
    })

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(
      'Budget updated successfully.',
    )
  })

  it('deletes a budget after confirmation', async () => {
    render(<BudgetsPage />)

    const foodCard = screen
      .getByText('Food')
      .closest('div.rounded-xl')

    expect(foodCard).not.toBeNull()

    const buttons =
      foodCard!.querySelectorAll('button')

    const deleteButton = buttons[1]

    expect(deleteButton).toBeDefined()

    fireEvent.click(deleteButton)

    expect(
      window.confirm,
    ).toHaveBeenCalled()

    expect(
      mockDeleteBudget,
    ).toHaveBeenCalledWith(1)

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(
      'Budget deleted successfully.',
    )
  })

  it('does not delete a budget when confirmation is cancelled', () => {
    vi.mocked(window.confirm)
      .mockReturnValue(false)

    render(<BudgetsPage />)

    const foodCard = screen
      .getByText('Food')
      .closest('div.rounded-xl')

    expect(foodCard).not.toBeNull()

    const buttons =
      foodCard!.querySelectorAll('button')

    const deleteButton = buttons[1]

    expect(deleteButton).toBeDefined()

    fireEvent.click(deleteButton)

    expect(
      mockDeleteBudget,
    ).not.toHaveBeenCalled()
  })
})
