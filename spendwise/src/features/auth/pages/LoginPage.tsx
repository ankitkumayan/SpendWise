import { Link, useNavigate } from 'react-router-dom'

import { useLoginMutation } from '../authApi'
import { setCredentials } from '../authSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { setLanguage } from '../../../app/languageSlice'

function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const language = useAppSelector(
    (state) => state.language.current,
  )

  const [login, { isLoading }] =
    useLoginMutation()

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const email =
      formData.get('email') as string

    const password =
      formData.get('password') as string

    try {
      const result = await login({
        email,
        password,
      }).unwrap()

      dispatch(setCredentials(result))

      navigate('/')
    } catch (error: any) {
      const message =
        error?.data?.message ||
        (language === 'en'
          ? 'Unable to log in. Please check your email and password.'
          : 'Impossible de se connecter. Vérifiez votre courriel et votre mot de passe.')

      alert(message)
    }
  }

  const toggleLanguage = () => {
    dispatch(
      setLanguage(
        language === 'en' ? 'fr' : 'en',
      ),
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

        <button
          type="button"
          onClick={toggleLanguage}
          className="absolute right-6 top-6 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          {language === 'en' ? 'FR' : 'EN'}
        </button>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">
            SpendWise
          </h1>

          <p className="mt-2 text-gray-500">
            {language === 'en'
              ? 'Sign in to manage your finances'
              : 'Connectez-vous pour gérer vos finances'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {language === 'en'
                ? 'Email'
                : 'Courriel'}
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder={
                language === 'en'
                  ? 'you@example.com'
                  : 'vous@exemple.com'
              }
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {language === 'en'
                ? 'Password'
                : 'Mot de passe'}
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder={
                language === 'en'
                  ? 'Enter your password'
                  : 'Entrez votre mot de passe'
              }
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? language === 'en'
                ? 'Signing in...'
                : 'Connexion...'
              : language === 'en'
                ? 'Sign In'
                : 'Se connecter'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {language === 'en'
            ? "Don't have an account?"
            : "Vous n'avez pas de compte ?"}{' '}

          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            {language === 'en'
              ? 'Create one'
              : 'Créer un compte'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage