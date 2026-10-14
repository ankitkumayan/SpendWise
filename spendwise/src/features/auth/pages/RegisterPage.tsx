import { Link, useNavigate } from 'react-router-dom'

import { useRegisterMutation } from '../authApi'
import { setCredentials } from '../authSlice'

import {
  setLanguage,
} from '../../../app/languageSlice'

import {
  useAppDispatch,
  useAppSelector,
} from '../../../hooks/redux'


function RegisterPage() {
  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const language = useAppSelector(
    (state) => state.language.current,
  )

  const [register, { isLoading }] =
    useRegisterMutation()

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const formData =
      new FormData(event.currentTarget)

    const name =
      formData.get('name') as string

    const email =
      formData.get('email') as string

    const password =
      formData.get('password') as string

    const confirmPassword =
      formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      alert(
        language === 'en'
          ? 'Passwords do not match.'
          : 'Les mots de passe ne correspondent pas.',
      )

      return
    }

    if (password.length < 6) {
      alert(
        language === 'en'
          ? 'Password must be at least 6 characters.'
          : 'Le mot de passe doit contenir au moins 6 caractères.',
      )

      return
    }

    try {
      const result = await register({
        name,
        email,
        password,
      }).unwrap()

      dispatch(setCredentials(result))

      navigate('/')
    } catch (error: any) {
      const message =
        error?.data?.message ||
        (language === 'en'
          ? 'Unable to create your account. Please try again.'
          : 'Impossible de créer votre compte. Veuillez réessayer.')

      alert(message)
    }
  }

  const toggleLanguage = () => {
    dispatch(
      setLanguage(
        language === 'en'
          ? 'fr'
          : 'en',
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
          {language === 'en'
            ? 'FR'
            : 'EN'}
        </button>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">
            SpendWise
          </h1>

          <p className="mt-2 text-gray-500">
            {language === 'en'
              ? 'Create your account'
              : 'Créez votre compte'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {language === 'en'
                ? 'Name'
                : 'Nom'}
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={100}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder={
                language === 'en'
                  ? 'Your name'
                  : 'Votre nom'
              }
            />
          </div>

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
              minLength={6}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder={
                language === 'en'
                  ? 'At least 6 characters'
                  : 'Au moins 6 caractères'
              }
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {language === 'en'
                ? 'Confirm Password'
                : 'Confirmer le mot de passe'}
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder={
                language === 'en'
                  ? 'Confirm your password'
                  : 'Confirmez votre mot de passe'
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
                ? 'Creating account...'
                : 'Création du compte...'
              : language === 'en'
                ? 'Create Account'
                : 'Créer un compte'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {language === 'en'
            ? 'Already have an account?'
            : 'Vous avez déjà un compte ?'}{' '}

          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            {language === 'en'
              ? 'Sign in'
              : 'Se connecter'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage