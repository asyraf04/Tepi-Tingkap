import React, { useState } from 'react'
import { User, Mail, Lock, AlertCircle, CheckCircle, Hash } from 'lucide-react'
import FormInput from './FormInput'
import { useAuth } from '../contexts/AuthContext'

interface RegisterFormProps {
  onRegisterSuccess: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const [fullName, setFullName] = useState('')
  const [nickname, setNickname] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const { error } = await signUp(email, password, {
        full_name: fullName,
        nickname: nickname,
        username: username
      })
      
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        // Show success message for 1.5 seconds then switch to login
        setTimeout(() => {
          onRegisterSuccess()
        }, 1500)
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

      {success && (
        <div className="flex items-center space-x-2 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-300">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Registration successful! Redirecting to login...</p>
        </div>
      )}

      <FormInput
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        icon={User}
        required
      />

      <FormInput
        type="text"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        icon={User}
        required
      />

      <FormInput
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        icon={Hash}
        required
      />

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
        placeholder="Password (min 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={Lock}
        required
        minLength={6}
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          required
          className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
        />
        <span className="text-white/70 text-sm">
          I agree to the Terms of Service and Privacy Policy
        </span>
      </div>

      <button
        type="submit"
        disabled={loading || success}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  )
}

export default RegisterForm
