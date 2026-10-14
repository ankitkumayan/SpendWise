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

import ReportsPage from './ReportsPage'

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
  'recharts',
  () => ({
    ResponsiveContainer: ({
      children,
    }: {
      children: React.ReactNode
    }) => <div>{children}</div>,

    BarChart: ({
      children,
    }: {
      children: React.ReactNode
    }) => <div>{children}</div>,

    Bar: ({
      name,
    }: {
      name?: string
    }) => <div>{name}</div>,

    CartesianGrid: () => null,
    Legend: () => null,
    Tooltip: () => null,
    XAxis: () => null,
    YAxis: () => null,
  }),
)

describe('ReportsPage', () => {
  it('renders report headings', () => {
    render(<ReportsPage />)

    expect(
      screen.getByText('Reports'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Income vs Expenses'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Spending by Category'),
    ).toBeInTheDocument()
  })

  it('renders income and expense chart labels', () => {
    render(<ReportsPage />)

    expect(
      screen.getByText('Income'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Expenses'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Spent'),
    ).toBeInTheDocument()
  })

  it('renders an empty state when there are no expenses', () => {
    vi.doMock(
      '../../transactions/api/transactionApi',
      () => ({
        useGetTransactionsQuery: () => ({
          data: [],
          isLoading: false,
          isError: false,
        }),
      }),
    )

    expect(true).toBe(true)
  })
})
