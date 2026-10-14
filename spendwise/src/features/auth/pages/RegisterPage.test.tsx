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

import RegisterPage from './RegisterPage'

const mockRegister = vi.fn()
const mockDispatch = vi.fn()
const mockNavigate = vi.fn()

let currentLanguage: 'en' | 'fr' = 'en'

vi.mock(
  'react-router-dom',
  () => ({
    Link: ({
      children,
    }: {
      children: React.ReactNode
    }) => <a href="/login">{children}</a>,

    useNavigate: () => mockNavigate,
  }),
)

vi.mock(
  '../../../hooks/redux',
  () => ({
    useAppDispatch: () => mockDispatch,

    useAppSelector: () => currentLanguage,
  }),
)

vi.mock(
  '../../../app/languageSlice',
  () => ({
    setLanguage: (language: 'en' | 'fr') => ({
      type: 'language/setLanguage',
      payload: language,
    }),
  }),
)

vi.mock(
  '../authApi',
  () => ({
    useRegisterMutation: () => [
      mockRegister,
      { isLoading: false },
    ],
  }),
)

vi.mock(
  '../authSlice',
  () => ({
    setCredentials: (credentials: unknown) => ({
      type: 'auth/setCredentials',
      payload: credentials,
    }),
  }),
)

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    currentLanguage = 'en'

    mockRegister.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          token: 'test-token',
          user: {
            id: 1,
            name: 'Jane Doe',
            email: 'jane@example.com',
          },
        }),
    })

    vi.spyOn(window, 'alert')
      .mockImplementation(() => {})
  })

  it('renders the registration form', () => {
    render(<RegisterPage />)

    expect(
      screen.getByText('SpendWise'),
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Name'),
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Email'),
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Password'),
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Confirm Password'),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'Create Account',
      }),
    ).toBeInTheDocument()
  })

  it('shows an error when passwords do not match', async () => {
    render(<RegisterPage />)

    fireEvent.change(
      screen.getByLabelText('Name'),
      {
        target: {
          value: 'Jane Doe',
        },
      },
    )

    fireEvent.change(
      screen.getByLabelText('Email'),
      {
        target: {
          value: 'jane@example.com',
        },
      },
    )

    fireEvent.change(
      screen.getByLabelText('Password'),
      {
        target: {
          value: 'password123',
        },
      },
    )

    fireEvent.change(
      screen.getByLabelText(
        'Confirm Password',
      ),
      {
        target: {
          value: 'different',
        },
      },
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Create Account',
      }),
    )

    expect(
      window.alert,
    ).toHaveBeenCalledWith(
      'Passwords do not match.',
    )

    expect(
      mockRegister,
    ).not.toHaveBeenCalled()
  })

  it('shows an error when password is too short', () => {
    render(<RegisterPage />)

    fireEvent.change(
      screen.getByLabelText('Name'),
      {
        target: {
          value: 'Jane Doe',
        },
      },
    )

    fireEvent.change(
      screen.getByLabelText('Email'),
      {
        target: {
          value: 'jane@example.com',
        },
      },
    )

    fireEvent.change(
      screen.getByLabelText('Password'),
      {
        target: {
          value: '123',
        },
      },
    )

    fireEvent.change(
      screen.getByLabelText(
        'Confirm Password',
      ),
      {
        target: {
          value: '123',
        },
      },
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Create Account',
      }),
    )

    expect(
      window.alert,
    ).toHaveBeenCalledWith(
      'Password must be at least 6 characters.',
    )

    expect(
      mockRegister,
    ).not.toHaveBeenCalled()
  })

  it('registers successfully', async () => {
    render(<RegisterPage />)

    fireEvent.change(
      screen.getByLabelText('Name'),
      {
        target: {
          value: 'Jane Doe',
        },
      },
    )

    fireEvent.change(
      screen.getByLabelText('Email'),
      {
        target: {
          value: 'jane@example.com',
        },
      },
    )

    fireEvent.change(
      screen.getByLabelText('Password'),
      {
        target: {
          value: 'password123',
        },
      },
    )

    fireEvent.change(
      screen.getByLabelText(
        'Confirm Password',
      ),
      {
        target: {
          value: 'password123',
        },
      },
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Create Account',
      }),
    )

    await vi.waitFor(() => {
      expect(
        mockRegister,
      ).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      })
    })

    expect(
      mockDispatch,
    ).toHaveBeenCalled()

    expect(
      mockNavigate,
    ).toHaveBeenCalledWith('/')
  })

  it('shows an API error when registration fails', async () => {
    mockRegister.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          data: {
            message:
              'An account with this email already exists.',
          },
        }),
    })

    render(<RegisterPage />)

    fireEvent.change(
      screen.getByLabelText('Name'),
      {
        target: {
          value: 'Jane Doe',
        },
      },
    )

    fireEvent.change(
      screen.getByLabelText('Email'),
      {
        target: {
          value: 'existing@example.com',
        },
      },
    )

    fireEvent.change(
      screen.getByLabelText('Password'),
      {
        target: {
          value: 'password123',
        },
      },
    )

    fireEvent.change(
      screen.getByLabelText(
        'Confirm Password',
      ),
      {
        target: {
          value: 'password123',
        },
      },
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Create Account',
      }),
    )

    await vi.waitFor(() => {
      expect(
        window.alert,
      ).toHaveBeenCalledWith(
        'An account with this email already exists.',
      )
    })
  })

  it('switches language to French', () => {
    render(<RegisterPage />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'FR',
      }),
    )

    expect(
      mockDispatch,
    ).toHaveBeenCalledWith({
      type: 'language/setLanguage',
      payload: 'fr',
    })
  })
})