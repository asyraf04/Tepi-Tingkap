import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, Mail, Shield, Calendar } from 'lucide-react'

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-morphism rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Welcome to Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all duration-300"
            >
              <LogOut className="w-5 h-5 text-red-400" />
              <span className="text-red-300">Sign Out</span>
            </button>
          </div>

          <div className="grid gap-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <User className="w-6 h-6 text-purple-400" />
                <span>User Information</span>
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-white/50" />
                  <div>
                    <p className="text-white/50 text-sm">Email</p>
                    <p className="text-white">{user?.email || 'Not available'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-white/50" />
                  <div>
                    <p className="text-white/50 text-sm">User ID</p>
                    <p className="text-white font-mono text-sm">{user?.id || 'Not available'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-white/50" />
                  <div>
                    <p className="text-white/50 text-sm">Account Created</p>
                    <p className="text-white">
                      {user?.created_at 
                        ? new Date(user.created_at).toLocaleDateString() 
                        : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">Authentication Status</h3>
              <p className="text-green-400">✓ Successfully authenticated with Supabase</p>
              <p className="text-white/70 text-sm mt-2">
                Your session is active and secure. All your data is protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
