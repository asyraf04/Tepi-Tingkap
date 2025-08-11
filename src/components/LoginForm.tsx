import React, { useState } from 'react'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import FormInput from './FormInput'
import { useAuth } from '../contexts/AuthContext'

interface LoginFormProps {
  onLoginSuccess: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        setError(error.message)
      } else {
        onLoginSuccess()
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <FormInput
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={Mail}
        required
      />

      <FormInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={Lock}
        required
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
          />
          <span className="text-white/70 text-sm">Remember me</span>
        </label>
        <a href="#" className="text-sm text-purple-300 hover:text-purple-200 transition-colors">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}

export default LoginForm
