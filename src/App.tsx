import React, { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import HomePage from './components/HomePage'
import BackgroundAnimation from './components/BackgroundAnimation'
import { Sparkles } from 'lucide-react'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function AppContent() {
  const [isLogin, setIsLogin] = useState(true)
  const { user, loading } = useAuth()

  const handleRegisterSuccess = () => {
    // Switch to login view after successful registration
    setIsLogin(true)
  }

  const handleLoginSuccess = () => {
    // User is logged in, the auth context will handle the state update
    console.log('Login successful')
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, show homepage
  if (user) {
    return <HomePage />
  }

  // Otherwise show login/register forms
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <BackgroundAnimation />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/70">
              {isLogin ? 'Sign in to continue to your account' : 'Create your account to get started'}
            </p>
          </div>

          {/* Form Container */}
          <div className="glass-morphism rounded-3xl p-8">
            {/* Toggle Tabs */}
            <div className="flex rounded-2xl bg-white/5 p-1 mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  isLogin
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  !isLogin
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Forms */}
            <div className="relative">
              <div
                className={`transition-all duration-500 ${
                  isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute inset-0'
                }`}
              >
                {isLogin && <LoginForm onLoginSuccess={handleLoginSuccess} />}
              </div>
              <div
                className={`transition-all duration-500 ${
                  !isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'
                }`}
              >
                {!isLogin && <RegisterForm onRegisterSuccess={handleRegisterSuccess} />}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white/50 text-sm">
              By continuing, you agree to our{' '}
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
