import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  render,
  screen,
} from '@testing-library/react'

import DashboardPage from './DashboardPage'

vi.mock(
  '../../../hooks/redux',
  () => ({
    useAppSelector: () => 'en',
  }),
)

vi.mock(
  '../../transactions/api/transactionApi',
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
  }),
)

vi.mock(
  '../../budgets/api/budgetApi',
  () => ({
    useGetBudgetsQuery: () => ({
      data: [
        {
          id: 1,
          category: 'Food',
          monthlyLimit: 600,
        },
      ],
      isLoading: false,
      isError: false,
    }),
  }),
)

describe('DashboardPage', () => {
  it('displays calculated financial totals', () => {
    render(<DashboardPage />)

    expect(
      screen.getByText('$1,300.00'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('$3,000.00'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('$1,700.00'),
    ).toBeInTheDocument()

    const savingsRateLabel =
      screen.getByText('Savings Rate')

    const savingsRateCard =
      savingsRateLabel.parentElement
        ?.parentElement

    expect(
      savingsRateCard,
    ).toHaveTextContent('43%')
  })

  it('displays recent transactions', () => {
    render(<DashboardPage />)

    expect(
      screen.getByText('Salary'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Groceries'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Rent'),
    ).toBeInTheDocument()
  })

  it('displays budget information', () => {
    render(<DashboardPage />)

    expect(
      screen.getAllByText('Food'),
    ).toHaveLength(2)

    expect(
      screen.getByText('Budget Overview'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('83%'),
    ).toBeInTheDocument()

    const budgetTitle =
      screen.getByText('Budget Overview')

    const budgetSection =
      budgetTitle.parentElement
        ?.parentElement

    expect(
      budgetSection,
    ).toHaveTextContent('$500.00')

    expect(
      budgetSection,
    ).toHaveTextContent('$600.00')
  })
})
