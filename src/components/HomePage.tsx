import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  Home, 
  Users, 
  UserX, 
  MessageCircle, 
  LogOut, 
  Send,
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Hash
} from 'lucide-react'

interface Post {
  id: string
  content: string
  user_id: string
  user_nickname: string
  user_username: string
  created_at: string
  likes: number
  comments: number
  shares: number
}

const HomePage: React.FC = () => {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('home')
  const [postContent, setPostContent] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [userMetadata, setUserMetadata] = useState<any>(null)
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    // Get user metadata
    const getUserMetadata = async () => {
      if (user) {
        // First try to get from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profileData && !profileError) {
          setUserMetadata(profileData)
        } else {
          // If no profile exists, create one from user metadata
          const metadata = user.user_metadata
          if (metadata && (metadata.nickname || metadata.full_name)) {
            // Try to create profile
            const { data: newProfile } = await supabase
              .from('profiles')
              .insert([{
                id: user.id,
                full_name: metadata.full_name || '',
                nickname: metadata.nickname || metadata.full_name || 'User',
                username: metadata.username || user.email?.split('@')[0] || 'user'
              }])
              .select()
              .single()
            
            if (newProfile) {
              setUserMetadata(newProfile)
            } else {
              // Fallback to auth metadata
              setUserMetadata({
                nickname: metadata.nickname || metadata.full_name || 'User',
                username: metadata.username || user.email?.split('@')[0] || 'user',
                full_name: metadata.full_name || ''
              })
            }
          } else {
            // Use email as fallback
            setUserMetadata({
              nickname: user.email?.split('@')[0] || 'User',
              username: user.email?.split('@')[0] || 'user',
              full_name: ''
            })
          }
        }
      }
    }
    
    getUserMetadata()
    fetchPosts()

    // Set up real-time subscription for new posts
    const channel = supabase
      .channel('posts-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          setPosts(current => [payload.new as Post, ...current])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      
      if (error) {
        console.error('Error fetching posts:', error)
      } else if (data) {
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePost = async () => {
    if (!postContent.trim() || !user || posting) return

    setPosting(true)
    try {
      // Ensure we have user metadata
      if (!userMetadata) {
        alert('Please wait for your profile to load')
        setPosting(false)
        return
      }

      const newPost = {
        content: postContent.trim(),
        user_id: user.id,
        user_nickname: userMetadata.nickname || 'Anonymous',
        user_username: userMetadata.username || 'user',
        likes: 0,
        comments: 0,
        shares: 0
      }

      console.log('Creating post:', newPost)

      const { data, error } = await supabase
        .from('posts')
        .insert([newPost])
        .select()
        .single()

      if (error) {
        console.error('Error creating post:', error)
        alert(`Failed to create post: ${error.message}`)
      } else if (data) {
        console.log('Post created successfully:', data)
        setPostContent('')
        // Post will be added via real-time subscription
      }
    } catch (error: any) {
      console.error('Error creating post:', error)
      alert(`Failed to create post: ${error.message || 'Unknown error'}`)
    } finally {
      setPosting(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'anonymous', label: 'Anonymous', icon: UserX },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex">
      {/* Sidebar */}
      <div className="w-80 glass-morphism border-r border-white/10 p-6 flex flex-col">
        {/* User Info */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {(userMetadata?.nickname || userMetadata?.full_name || user?.email || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white font-semibold">
                {userMetadata?.nickname || userMetadata?.full_name || 'User'}
              </p>
              <p className="text-white/60 text-sm">
                #{userMetadata?.username || user?.email?.split('@')[0] || 'username'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === item.id
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="glass-morphism border-b border-white/10 p-6">
          <h1 className="text-2xl font-bold text-white">
            {navItems.find(item => item.id === activeTab)?.label || 'Home'}
          </h1>
        </div>

        {/* Post Creator */}
        <div className="glass-morphism border-b border-white/10 p-6">
          <div className="flex space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">
                {(userMetadata?.nickname || userMetadata?.full_name || user?.email || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/30 resize-none"
                rows={3}
                disabled={posting}
              />
              <div className="flex justify-between items-center mt-3">
                <div className="text-white/50 text-sm">
                  {postContent.length}/280 characters
                </div>
                <button
                  onClick={handlePost}
                  disabled={!postContent.trim() || postContent.length > 280 || posting}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{posting ? 'Posting...' : 'Post'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : posts.length > 0 ? (
            <div className="divide-y divide-white/10">
              {posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-white/5 transition-colors duration-200">
                  <div className="flex space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">
                        {(post.user_nickname || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-semibold">{post.user_nickname || 'Anonymous'}</span>
                          <span className="text-white/50 text-sm">
                            #{post.user_username || 'user'}
                          </span>
                          <span className="text-white/40 text-sm">·</span>
                          <span className="text-white/40 text-sm">{formatTimeAgo(post.created_at)}</span>
                        </div>
                        <button className="text-white/50 hover:text-white transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-white/90 mb-3">{post.content}</p>
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-white/50 hover:text-pink-400 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-white/50 hover:text-blue-400 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-white/50 hover:text-green-400 transition-colors">
                          <Share2 className="w-4 h-4" />
                          <span className="text-sm">{post.shares}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/50">No posts yet. Be the first to share something!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
