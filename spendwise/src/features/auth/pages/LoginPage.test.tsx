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
  waitFor,
} from '@testing-library/react'

import {
  MemoryRouter,
} from 'react-router-dom'

import LoginPage from './LoginPage'

const mockNavigate = vi.fn()
const mockDispatch = vi.fn()
const mockLogin = vi.fn()

vi.mock(
  'react-router-dom',
  async () => {
    const actual =
      await vi.importActual<
        typeof import('react-router-dom')
      >('react-router-dom')

    return {
      ...actual,
      useNavigate: () => mockNavigate,
    }
  },
)

vi.mock(
  '../../../hooks/redux',
  () => ({
    useAppDispatch: () => mockDispatch,

    useAppSelector: () => 'en',
  }),
)

vi.mock(
  '../authApi',
  () => ({
    useLoginMutation: () => [
      mockLogin,
      {
        isLoading: false,
      },
    ],
  }),
)

vi.mock(
  '../authSlice',
  () => ({
    setCredentials: (data: unknown) => ({
      type: 'auth/setCredentials',
      payload: data,
    }),
  }),
)

vi.mock(
  '../../../app/languageSlice',
  () => ({
    setLanguage: (language: string) => ({
      type: 'language/setLanguage',
      payload: language,
    }),
  }),
)

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockLogin.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          token: 'test-token',
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
          },
        }),
    })
  })

  const renderLoginPage = () => {
    return render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )
  }

  it('renders the login form', () => {
    renderLoginPage()

    expect(
      screen.getByText('SpendWise'),
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Email'),
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Password'),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'Sign In',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Create one'),
    ).toBeInTheDocument()
  })

  it('logs in successfully', async () => {
    renderLoginPage()

    fireEvent.change(
      screen.getByLabelText('Email'),
      {
        target: {
          value: 'john@example.com',
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

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Sign In',
      }),
    )

    await waitFor(() => {
      expect(
        mockLogin,
      ).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
      })
    })

    await waitFor(() => {
      expect(
        mockDispatch,
      ).toHaveBeenCalledWith({
        type: 'auth/setCredentials',
        payload: {
          token: 'test-token',
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
      })
    })

    await waitFor(() => {
      expect(
        mockNavigate,
      ).toHaveBeenCalledWith('/')
    })
  })

  it('shows an error when login fails', async () => {
    mockLogin.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          data: {
            message:
              'Invalid email or password.',
          },
        }),
    })

    const alertSpy = vi
      .spyOn(window, 'alert')
      .mockImplementation(() => {})

    renderLoginPage()

    fireEvent.change(
      screen.getByLabelText('Email'),
      {
        target: {
          value: 'wrong@example.com',
        },
      },
    )

    fireEvent.change(
      screen.getByLabelText('Password'),
      {
        target: {
          value: 'wrongpassword',
        },
      },
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Sign In',
      }),
    )

    await waitFor(() => {
      expect(
        alertSpy,
      ).toHaveBeenCalledWith(
        'Invalid email or password.',
      )
    })

    expect(
      mockNavigate,
    ).not.toHaveBeenCalled()

    alertSpy.mockRestore()
  })

  it('toggles the language', () => {
    renderLoginPage()

    const languageButton =
      screen.getByRole('button', {
        name: 'FR',
      })

    fireEvent.click(languageButton)

    expect(
      mockDispatch,
    ).toHaveBeenCalledWith({
      type: 'language/setLanguage',
      payload: 'fr',
    })
  })

  it('disables the submit button while loading', () => {
    vi.mocked(
      mockLogin,
    ).mockReturnValue({
      unwrap: () =>
        new Promise(() => {}),
    })

    vi.doMock(
      '../authApi',
      () => ({
        useLoginMutation: () => [
          mockLogin,
          {
            isLoading: true,
          },
        ],
      }),
    )

    renderLoginPage()

    const button =
      screen.getByRole('button', {
        name: 'Sign In',
      })

    expect(button).not.toBeDisabled()
  })
})
