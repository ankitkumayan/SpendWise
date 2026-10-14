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

import ProtectedRoute from './ProtectedRoute'

let token: string | null = null

vi.mock(
  '../../../hooks/redux',
  () => ({
    useAppSelector: () => token,
  }),
)

vi.mock(
  'react-router-dom',
  () => ({
    Navigate: ({
      to,
    }: {
      to: string
    }) => (
      <div>
        Redirected to {to}
      </div>
    ),

    Outlet: () => (
      <div>
        Protected Content
      </div>
    ),
  }),
)

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    token = null

    render(<ProtectedRoute />)

    expect(
      screen.getByText(
        'Redirected to /login',
      ),
    ).toBeInTheDocument()
  })

  it('renders protected content for authenticated users', () => {
    token = 'test-token'

    render(<ProtectedRoute />)

    expect(
      screen.getByText('Protected Content'),
    ).toBeInTheDocument()
  })
})