import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'wouter'
import AdminDashboard from './pages/admin/AdminDashboard'

// Notification Context
const NotificationContext = React.createContext()

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const showNotification = (message, type = 'info') => {
    const id = Date.now()
    const notification = { id, message, type }
    setNotifications([...notifications, notification])
    
    setTimeout(() => {
      setNotifications(notifications.filter(n => n.id !== id))
    }, 5000)
  }

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ showNotification, removeNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              notification.type === 'warning' ? 'bg-yellow-500 text-white' :
              'bg-blue-500 text-white'
            } animate-slide-in`}
          >
            <div className="flex items-center justify-between">
              <span>{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-4 text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

// Navigation Component
function Navigation({ user, onLogout }) {
  const supportWhatsApp = '+17253348692'
  const supportEmail = 'promohive@globalpromonetwork.store'

  const navItems = [
    { href: '/', icon: '🏠', label: 'Home', loggedIn: false },
    { href: '/dashboard', icon: '📊', label: 'Dashboard', loggedIn: true },
    { href: '/tasks', icon: '📋', label: 'Tasks', loggedIn: true },
    { href: '/referrals', icon: '👥', label: 'Referrals', loggedIn: true },
    { href: '/withdrawals', icon: '💰', label: 'Withdrawals', loggedIn: true },
    { href: '/luck-wheel', icon: '🎰', label: 'Luck Wheel', loggedIn: true },
    { href: '/mining', icon: '⛏️', label: 'Mining', loggedIn: true },
    { href: '/profile', icon: '👤', label: 'Profile', loggedIn: true },
    { href: '/admin', icon: '🛠️', label: 'Admin', loggedIn: true, adminOnly: true },
  ]

  const NavIcon = ({ href, icon, label }) => (
    <a 
      href={href} 
      className="group relative flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
      title={label}
    >
      <span className="text-2xl group-hover:animate-bounce">{icon}</span>
      <span className="nav-link hidden sm:inline">{label}</span>
      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </a>
  )

  return (
    <nav className="glass-effect sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center animate-pulse">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <h1 className="text-2xl font-bold gradient-text">
                PromoHive
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {!user ? (
                <>
                  <NavIcon href="/login" icon="🔑" label="Login" />
                  <NavIcon href="/register" icon="📝" label="Register" />
                </>
              ) : (
                <>
                  {navItems
                    .filter(item => !item.loggedIn || (item.loggedIn && user))
                    .filter(item => !item.adminOnly || (item.adminOnly && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')))
                    .map(item => (
                      <NavIcon key={item.href} href={item.href} icon={item.icon} label={item.label} />
                    ))}
                  <button 
                    onClick={onLogout}
                    className="group flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all duration-300 transform hover:scale-110"
                    title="Logout"
                  >
                    <span className="text-2xl group-hover:animate-pulse">🚪</span>
                    <span className="text-gray-700 hover:text-red-500 transition-colors duration-200 font-medium hidden sm:inline">Logout</span>
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </button>
                </>
              )}
            </div>
            {/* Support Buttons */}
            <div className="flex space-x-3 border-l border-gray-300 pl-4">
              <a 
                href={`https://wa.me/${supportWhatsApp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 font-medium animate-pulse"
                title="Contact us on WhatsApp"
              >
                <span>📱</span>
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
              <a 
                href={`mailto:${supportEmail}`}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:scale-110 transition-all duration-300 font-medium"
                title="Contact us via Email"
              >
                <span>✉️</span>
                <span className="hidden sm:inline">Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Auth Context
const AuthContext = React.createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Home component
function Home() {
  return (
    <div className="min-h-screen">
      <Navigation user={null} onLogout={() => {}} />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-purple-600 to-pink-600 opacity-95"></div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="animate-float">
            {/* PromoHive Logo */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="PromoHive Logo" 
                  className="w-48 md:w-64 h-auto drop-shadow-2xl animate-bounce-slow border-4 border-white/30 rounded-2xl p-2 bg-white/10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/20 rounded-2xl blur-2xl"></div>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 text-shadow">
              PromoHive
            </h1>
            <p className="text-xl md:text-2xl text-white mb-2 max-w-3xl mx-auto opacity-90">
              GLOBAL PROMO NETWORK
            </p>
            <p className="text-lg md:text-xl text-white mb-8 max-w-3xl mx-auto opacity-75">
              Earn money by completing promotional tasks, referrals, and multi-level marketing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/register" 
                className="btn-primary text-lg px-8 py-4 transform hover:scale-110 transition-all duration-300 shadow-2xl"
              >
                Get Started Now ✨
              </a>
              <a 
                href="/login" 
                className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-purple-600 transform hover:scale-110 transition-all duration-300"
              >
                Login 🔑
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-12 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <div className="text-5xl font-bold text-white mb-2 animate-pulse">$127,845</div>
              <div className="text-white/80 text-sm font-medium">Total Earnings Paid</div>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <div className="text-5xl font-bold text-white mb-2 animate-pulse">12,847</div>
              <div className="text-white/80 text-sm font-medium">Active Users</div>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <div className="text-5xl font-bold text-white mb-2 animate-pulse">45,239</div>
              <div className="text-white/80 text-sm font-medium">Tasks Completed</div>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <div className="text-5xl font-bold text-white mb-2 animate-pulse">$8,521</div>
              <div className="text-white/80 text-sm font-medium">Pending Withdrawals</div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Bonus Banner */}
      <section className="py-12 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block bg-white/20 backdrop-blur-lg rounded-2xl px-8 py-6 border border-white/30 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg animate-pulse">
              🎁 Seize the Opportunity!
            </h2>
            <p className="text-xl md:text-2xl text-white mb-4 drop-shadow-md">
              Sign up for a new account and earn $5 instantly!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="/register" 
                className="btn-primary text-lg px-8 py-4 bg-white text-green-600 hover:bg-gray-100 transform hover:scale-110 transition-all duration-300 shadow-2xl font-bold"
              >
                Get Your $5 Bonus 🚀
              </a>
              <span className="text-white text-sm opacity-80">
                Available to all new users
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Why Choose PromoHive?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the most advanced promotional platform with cutting-edge features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="stats-card animate-float delay-100">
              <div className="stats-icon bg-blue-100 text-blue-600 mb-4">
                💰
              </div>
              <h3 className="text-xl font-semibold mb-3">Earn Money</h3>
              <p className="text-gray-600">Complete tasks and earn real money through our advanced platform</p>
            </div>
            
            <div className="stats-card animate-float delay-200">
              <div className="stats-icon bg-pink-100 text-pink-600 mb-4">
                👥
              </div>
              <h3 className="text-xl font-semibold mb-3">Referral System</h3>
              <p className="text-gray-600">Invite friends and earn bonuses from their activities</p>
            </div>
            
            <div className="stats-card animate-float delay-300">
              <div className="stats-icon bg-purple-100 text-purple-600 mb-4">
                🎰
              </div>
              <h3 className="text-xl font-semibold mb-3">Luck Wheel</h3>
              <p className="text-gray-600">Spin the wheel daily and win rewards</p>
            </div>
            
            <div className="stats-card animate-float delay-400">
              <div className="stats-icon bg-green-100 text-green-600 mb-4">
                ⛏️
              </div>
              <h3 className="text-xl font-semibold mb-3">Mining Contracts</h3>
              <p className="text-gray-600">Invest in mining contracts and earn passive income</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="stats-value gradient-text mb-2">10,000+</div>
              <div className="stats-label">Active Users</div>
            </div>
            <div className="text-center">
              <div className="stats-value gradient-text mb-2">$500K+</div>
              <div className="stats-label">Paid Out</div>
            </div>
            <div className="text-center">
              <div className="stats-value gradient-text mb-2">50+</div>
              <div className="stats-label">Countries</div>
            </div>
            <div className="text-center">
              <div className="stats-value gradient-text mb-2">99.9%</div>
              <div className="stats-label">Uptime</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Login component
function Login() {
  const { login } = React.useContext(AuthContext)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Store tokens
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken)
        }
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken)
        }
        
        // Login with user data
        login({
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          fullName: data.user.fullName,
          role: data.user.role,
          level: data.user.level || 0,
          isApproved: data.user.isApproved,
          balance: data.user.wallet?.balance || 0,
          dailySpins: 0,
          lastSpinDate: null
        })
        
        // Redirect based on role
        if (data.user.role === 'SUPER_ADMIN' || data.user.role === 'ADMIN') {
          window.location.href = '/admin'
        } else {
          window.location.href = '/dashboard'
        }
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Failed to connect to server')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center py-12">
      <Navigation user={null} onLogout={() => {}} />
      <div className="card max-w-md w-full mx-4 glass-effect">
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h2 className="text-3xl font-bold gradient-text">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>
          <button 
            type="submit"
            className="btn-primary w-full"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">Don't have an account? 
            <a href="/register" className="text-blue-500 hover:text-blue-600 font-semibold ml-1">
              Create one here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// Register component
function Register() {
  const { login } = React.useContext(AuthContext)
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthdate: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    
    setSuccess('Registration successful! Your account is pending admin approval.')
    
    setTimeout(() => {
      login({
        id: 'user-' + Date.now(),
        email: formData.email,
        username: formData.username,
        fullName: formData.fullName,
        role: 'USER',
        level: 0,
        isApproved: false,
        balance: 0.00,
        dailySpins: 0,
        lastSpinDate: null
      })
      window.location.href = '/dashboard'
    }, 2000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center py-12">
      <Navigation user={null} onLogout={() => {}} />
      <div className="card max-w-md w-full mx-4 glass-effect">
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h2 className="text-3xl font-bold gradient-text">Join PromoHive</h2>
          <p className="text-gray-600 mt-2">Create your account and start earning</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Choose a username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select 
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
            <input 
              type="date" 
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Create a password"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button 
            type="submit"
            className="btn-secondary w-full"
          >
            Create Account
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">Already have an account? 
            <a href="/login" className="text-blue-500 hover:text-blue-600 font-semibold ml-1">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// Profile component
function Profile() {
  const { user, logout, loading, login } = React.useContext(AuthContext)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <a href="/login" className="btn-primary">Go to Login</a>
        </div>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match!')
      return
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long')
      return
    }

    // Update user data
    const updatedUser = {
      ...user,
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email
    }

    login(updatedUser)
    setSuccess('Profile updated successfully!')
    setFormData({
      ...formData,
      password: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      <Navigation user={user} onLogout={logout} />
      
      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">👤 My Profile</h1>
          <p className="text-white opacity-90">Manage your account settings and personal information</p>
        </div>

        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👤</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{user.fullName}</h3>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-4">
                <span className={`badge ${user.role === 'SUPER_ADMIN' ? 'badge-purple' : user.role === 'ADMIN' ? 'badge-primary' : 'badge-success'}`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="text-2xl font-semibold mb-6 gradient-text">Edit Profile</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password (Optional)</label>
                  <input 
                    type="password" 
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Leave empty to keep current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Confirm new password"
                  />
                </div>
                <button 
                  type="submit"
                  className="btn-primary w-full"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard component
function Dashboard() {
  const { user, logout, loading } = React.useContext(AuthContext)
  const [stats, setStats] = useState({
    balance: user?.role === 'SUPER_ADMIN' ? 1000.00 : 5.00,
    tasksCompleted: 0,
    referrals: 0,
    level: user?.level || 0,
    dailyEarnings: 0.00,
    totalEarnings: 0.00
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <a 
            href="/login" 
            className="btn-primary"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      <Navigation user={user} onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Welcome back, {user.fullName}!
          </h1>
          <p className="text-white opacity-90">Here's your account overview</p>
        </div>
        
        {!user.isApproved && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg mb-8">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <strong>Account Pending:</strong> Your account is waiting for admin approval. You'll receive an email once approved.
              </div>
            </div>
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stats-card">
            <div className="flex items-center">
              <div className="stats-icon bg-green-100 text-green-600">
                💰
              </div>
              <div className="ml-4">
                <div className="stats-label">Balance</div>
                <div className="stats-value text-green-600">${stats.balance}</div>
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-center">
              <div className="stats-icon bg-blue-100 text-blue-600">
                ✅
              </div>
              <div className="ml-4">
                <div className="stats-label">Tasks Completed</div>
                <div className="stats-value text-blue-600">{stats.tasksCompleted}</div>
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-center">
              <div className="stats-icon bg-pink-100 text-pink-600">
                👥
              </div>
              <div className="ml-4">
                <div className="stats-label">Referrals</div>
                <div className="stats-value text-pink-600">{stats.referrals}</div>
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-center">
              <div className="stats-icon bg-purple-100 text-purple-600">
                ⭐
              </div>
              <div className="ml-4">
                <div className="stats-label">Level</div>
                <div className="stats-value text-purple-600">L{stats.level}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Available Tasks</h3>
              <p className="text-gray-600 mb-4">Complete tasks to earn money</p>
              <a href="/tasks" className="btn-primary w-full">
                View Tasks
              </a>
            </div>
          </div>
          
          <div className="card">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Referral Program</h3>
              <p className="text-gray-600 mb-4">Invite friends and earn bonuses</p>
              <a href="/referrals" className="btn-secondary w-full">
                Invite Friends
              </a>
            </div>
          </div>
          
          <div className="card">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎰</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Luck Wheel</h3>
              <p className="text-gray-600 mb-4">Spin daily and win rewards</p>
              <a href="/luck-wheel" className="btn-success w-full">
                Spin Now
              </a>
            </div>
          </div>
          
          <div className="card">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⛏️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Mining Contracts</h3>
              <p className="text-gray-600 mb-4">Invest and earn passive income</p>
              <a href="/mining" className="btn-danger w-full">
                View Contracts
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Luck Wheel component
function LuckWheel() {
  const { user, logout, loading } = React.useContext(AuthContext)
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [spinsLeft, setSpinsLeft] = useState(3)
  const [lastSpinDate, setLastSpinDate] = useState(null)
  const [rotation, setRotation] = useState(0)

  // Probability-based prizes: lower prizes have more slots
  const prizes = [
    { value: 0.02, color: '#FF6B6B', label: '$0.02', weight: 20 }, // Very common
    { value: 0.03, color: '#FF9999', label: '$0.03', weight: 20 },
    { value: 0.05, color: '#00E5FF', label: '$0.05', weight: 15 }, // Cyan
    { value: 0.08, color: '#9333EA', label: '$0.08', weight: 10 }, // Purple
    { value: 0.10, color: '#96CEB4', label: '$0.10', weight: 8 },
    { value: 0.15, color: '#EC4899', label: '$0.15', weight: 5 }, // Pink
    { value: 0.20, color: '#DDA0DD', label: '$0.20', weight: 2 },
    { value: 0.30, color: '#FFD700', label: '$0.30', weight: 1 } // Very rare
  ]

  // Calculate weighted random prize
  const getRandomPrize = () => {
    const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0)
    let random = Math.random() * totalWeight
    
    for (const prize of prizes) {
      random -= prize.weight
      if (random <= 0) return prize
    }
    return prizes[0]
  }

  const handleSpinClick = () => {
    if (spinsLeft <= 0) {
      alert('No spins left for today! Come back tomorrow.')
      return
    }

    setIsSpinning(true)
    setResult(null)
    setRotation(0)

    // Random rotation (multiple full spins + prize angle)
    const selectedPrize = getRandomPrize()
    const prizeIndex = prizes.findIndex(p => p.value === selectedPrize.value && p.label === selectedPrize.label)
    const prizeAngle = prizeIndex * 45
    
    // 5-8 full rotations + prize angle
    const fullRotations = 5 + Math.floor(Math.random() * 3)
    const totalRotation = fullRotations * 360 + prizeAngle
    const duration = 3000

    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth deceleration
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
      const easedProgress = easeOutCubic(progress)
      
      setRotation(totalRotation * easedProgress)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsSpinning(false)
        setResult(selectedPrize)
        setSpinsLeft(spinsLeft - 1)
      }
    }
    
    animate()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <a href="/login" className="btn-primary">Go to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600">
      <Navigation user={user} onLogout={logout} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 animate-pulse">🎰 Luck Wheel</h1>
          <p className="text-xl text-white opacity-90">Spin daily and win rewards!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Wheel */}
          <div className="glass-effect rounded-2xl p-6 border border-white/30 shadow-2xl backdrop-blur-xl">
            <div className="text-center">
              <div className="relative w-80 h-80 mx-auto mb-6">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-20">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-t-16 border-l-transparent border-r-transparent border-t-red-500 animate-bounce"></div>
                </div>
                
                {/* Wheel Container */}
                <div className="w-80 h-80 relative">
                  {/* Wheel Sectors */}
                  <svg
                    width="320"
                    height="320"
                    viewBox="0 0 320 320"
                    className="absolute transform transition-transform duration-100"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {prizes.map((prize, index) => {
                      const startAngle = (index - 1) * (360 / 8)
                      const endAngle = index * (360 / 8)
                      const startAngleRad = (startAngle - 90) * (Math.PI / 180)
                      const endAngleRad = (endAngle - 90) * (Math.PI / 180)
                      const x1 = 160 + 140 * Math.cos(startAngleRad)
                      const y1 = 160 + 140 * Math.sin(startAngleRad)
                      const x2 = 160 + 140 * Math.cos(endAngleRad)
                      const y2 = 160 + 140 * Math.sin(endAngleRad)
                      
                      return (
                        <path
                          key={index}
                          d={`M 160,160 L ${x1},${y1} A 140,140 0 0,1 ${x2},${y2} Z`}
                          fill={prize.color}
                          filter="url(#glow)"
                          style={{ transition: 'all 0.3s ease' }}
                        >
                          <title>{prize.label}</title>
                        </path>
                      )
                    })}
                    
                    {/* Center Circle */}
                    <circle cx="160" cy="160" r="40" fill="white" stroke="#9333EA" strokeWidth="4"/>
                    <text x="160" y="170" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#9333EA">SPIN</text>
                  </svg>
                  
                  {/* Prize Labels inside wheel sectors */}
                  {prizes.map((prize, index) => {
                    const angle = (index * 45 - 22.5) * (Math.PI / 180)
                    const x = 160 + 85 * Math.cos(angle)
                    const y = 160 + 85 * Math.sin(angle)
                    
                    return (
                      <div
                        key={index}
                        className="absolute"
                        style={{
                          left: `${x}px`,
                          top: `${y}px`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <div className="text-white font-black text-sm drop-shadow-lg" style={{ fontSize: '14px' }}>
                          ${prize.value.toFixed(2)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <button
                onClick={handleSpinClick}
                disabled={isSpinning || spinsLeft <= 0}
                className={`btn-primary text-xl px-8 py-4 ${(isSpinning || spinsLeft <= 0) ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'}`}
              >
                {isSpinning ? 'Spinning...' : spinsLeft > 0 ? `🎯 Spin Now (${spinsLeft} left)` : 'No Spins Left'}
              </button>
            </div>
          </div>

          {/* Result Announcement */}
          {result && (
            <div className="mt-8 p-8 glass-effect rounded-2xl border border-white/30 shadow-2xl text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Congratulations!</h3>
              <p className="text-4xl font-black text-white drop-shadow-lg">You won {result.label}!</p>
              <p className="text-white/80 mt-4 text-lg">Your prize has been added to your balance</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Mining Contracts component
function MiningContracts() {
  const { user, logout, loading } = React.useContext(AuthContext)
  const [contracts] = useState([
    {
      id: 1,
      name: 'Basic Mining',
      price: 10.00,
      dailyReturn: 0.50,
      duration: 30,
      totalReturn: 15.00,
      profit: 5.00,
      status: 'active'
    },
    {
      id: 2,
      name: 'Advanced Mining',
      price: 50.00,
      dailyReturn: 3.00,
      duration: 30,
      totalReturn: 90.00,
      profit: 40.00,
      status: 'active'
    },
    {
      id: 3,
      name: 'Premium Mining',
      price: 100.00,
      dailyReturn: 7.00,
      duration: 30,
      totalReturn: 210.00,
      profit: 110.00,
      status: 'active'
    }
  ])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <a href="/login" className="btn-primary">Go to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">⛏️ Mining Contracts</h1>
          <p className="text-xl text-gray-600">Invest in mining contracts and earn passive income</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contracts.map(contract => (
            <div key={contract.id} className="card hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⛏️</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{contract.name}</h3>
                <div className="badge badge-success">Active</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Investment:</span>
                  <span className="font-bold">${contract.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Return:</span>
                  <span className="font-bold text-green-600">${contract.dailyReturn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-bold">{contract.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Return:</span>
                  <span className="font-bold text-blue-600">${contract.totalReturn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profit:</span>
                  <span className="font-bold text-purple-600">${contract.profit}</span>
                </div>
              </div>

              <div className="progress-bar mb-4">
                <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>

              <button className="btn-primary w-full">
                Invest Now
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 card">
          <h3 className="text-2xl font-bold mb-6 gradient-text">How Mining Contracts Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h4 className="font-semibold mb-2">Choose Contract</h4>
              <p className="text-gray-600">Select a mining contract that fits your budget</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h4 className="font-semibold mb-2">Invest</h4>
              <p className="text-gray-600">Make your investment and start earning</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h4 className="font-semibold mb-2">Earn Daily</h4>
              <p className="text-gray-600">Receive daily returns for the contract duration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Admin Dashboard component
function AdminDashboard() {
  const { user, logout, loading } = React.useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'USER', isApproved: false, balance: 0, level: 0 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'USER', isApproved: true, balance: 15.50, level: 1 },
    { id: 3, name: 'Admin User', email: 'admin@promohive.com', role: 'SUPER_ADMIN', isApproved: true, balance: 1000, level: 3 }
  ])
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'new_user', message: 'John Doe registered', time: '2 minutes ago', read: false },
    { id: 2, type: 'withdrawal', message: 'Withdrawal request: $50', time: '15 minutes ago', read: false },
    { id: 3, type: 'upgrade', message: 'User requested level upgrade', time: '1 hour ago', read: false }
  ])
  const [usdtAddresses, setUsdtAddresses] = useState([
    { id: 1, address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE', network: 'TRC20', isActive: true },
    { id: 2, address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', network: 'ERC20', isActive: true }
  ])
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Follow Instagram Account', description: 'Follow our Instagram account and like 5 recent posts', reward: 2.50, type: 'MANUAL', status: 'ACTIVE' },
    { id: 2, title: 'Join Telegram Group', description: 'Join our Telegram group and stay active for 7 days', reward: 5.00, type: 'MANUAL', status: 'ACTIVE' },
    { id: 3, title: 'Download Mobile App', description: 'Download and install our mobile app', reward: 3.00, type: 'MANUAL', status: 'ACTIVE' },
    { id: 4, title: 'Subscribe YouTube Channel', description: 'Subscribe to our YouTube channel and watch 3 videos', reward: 1.50, type: 'MANUAL', status: 'ACTIVE' },
    { id: 5, title: 'Follow Twitter Account', description: 'Follow our Twitter account and retweet 2 posts', reward: 2.00, type: 'MANUAL', status: 'ACTIVE' },
    { id: 6, title: 'Join Discord Server', description: 'Join our Discord server and stay active for 5 days', reward: 4.00, type: 'MANUAL', status: 'ACTIVE' }
  ])
  const [editingAddress, setEditingAddress] = useState(null)
  const [levelModal, setLevelModal] = useState({ show: false, userId: null, currentLevel: 0 })
  const [taskModal, setTaskModal] = useState({ show: false, task: null })
  const [userModal, setUserModal] = useState({ show: false, user: null })
  const [supportSettings, setSupportSettings] = useState({
    whatsapp: '+17253348692',
    email: 'promohive@globalpromonetwork.store'
  })
  const [freeUserLimit, setFreeUserLimit] = useState(9.90)
  const [showNotifications, setShowNotifications] = useState(false)
  const [homeBannerSettings, setHomeBannerSettings] = useState({
    title: '🎁 Seize the Opportunity!',
    subtitle: 'Sign up for a new account and earn $5 instantly!',
    buttonText: 'Get Your $5 Bonus 🚀',
    bonusAmount: '$5'
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <a href="/login" className="btn-primary">Go to Login</a>
        </div>
      </div>
    )
  }

  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin panel.</p>
          <a href="/dashboard" className="btn-primary">Go to Dashboard</a>
        </div>
      </div>
    )
  }

  const approveUser = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isApproved: true } : u))
    // Mark notification as read
    const userToApprove = users.find(u => u.id === userId)
    if (userToApprove) {
      const notificationId = Date.now()
      setNotifications(prev => prev.map(n => 
        n.message.includes(userToApprove.name) ? { ...n, read: true } : n
      ).concat({
        id: notificationId,
        type: 'approval',
        message: `${userToApprove.name} approved successfully!`,
        time: 'Just now',
        read: false
      }))
      alert('User approved successfully!')
    }
  }
  
  const markNotificationAsRead = (notifId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notifId ? { ...n, read: true } : n
    ))
  }

  const addUSDTAddress = () => {
    const address = prompt('Enter USDT Address:')
    const network = prompt('Enter Network (TRC20/ERC20):')
    if (address && network) {
      const newAddress = {
        id: usdtAddresses.length + 1,
        address: address,
        network: network,
        isActive: true
      }
      setUsdtAddresses([...usdtAddresses, newAddress])
    }
  }

  const editUSDTAddress = (addressId) => {
    const address = usdtAddresses.find(a => a.id === addressId)
    const newAddress = prompt('Enter new USDT Address:', address.address)
    const newNetwork = prompt('Enter Network (TRC20/ERC20):', address.network)
    if (newAddress && newNetwork) {
      setUsdtAddresses(usdtAddresses.map(a => 
        a.id === addressId ? { ...a, address: newAddress, network: newNetwork } : a
      ))
    }
  }

  const deleteUSDTAddress = (addressId) => {
    if (confirm('Are you sure you want to delete this USDT address?')) {
      setUsdtAddresses(usdtAddresses.filter(a => a.id !== addressId))
    }
  }

  const toggleAddressStatus = (addressId) => {
    setUsdtAddresses(usdtAddresses.map(a => 
      a.id === addressId ? { ...a, isActive: !a.isActive } : a
    ))
  }

  const updateUserLevel = (userId, newLevel) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, level: newLevel } : u
    ))
    setLevelModal({ show: false, userId: null, currentLevel: 0 })
    alert(`User level updated to L${newLevel}`)
  }

  const addNewUser = () => {
    const name = prompt('Enter Full Name:')
    const email = prompt('Enter Email:')
    const role = prompt('Enter Role (USER/ADMIN/SUPER_ADMIN):')
    
    if (name && email && role) {
      const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        role: role.toUpperCase(),
        isApproved: true,
        balance: 0,
        level: 0
      }
      setUsers([...users, newUser])
      alert('User added successfully!')
    }
  }

  const editUser = (userId) => {
    const user = users.find(u => u.id === userId)
    const name = prompt('Enter Full Name:', user.name)
    const email = prompt('Enter Email:', user.email)
    const role = prompt('Enter Role (USER/ADMIN/SUPER_ADMIN):', user.role)
    const balance = prompt('Enter Balance:', user.balance.toString())
    
    if (name && email && role && balance) {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, name, email, role: role.toUpperCase(), balance: parseFloat(balance) } : u
      ))
      alert('User updated successfully!')
    }
  }

  const addTask = () => {
    const title = prompt('Enter Task Title:')
    const description = prompt('Enter Task Description:')
    const rewardStr = prompt('Enter Reward Amount:')
    
    if (title && description && rewardStr) {
      const newTask = {
        id: tasks.length + 1,
        title: title,
        description: description,
        reward: parseFloat(rewardStr),
        type: 'MANUAL',
        status: 'ACTIVE'
      }
      setTasks([...tasks, newTask])
      alert('Task added successfully!')
    }
  }

  const editTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    const title = prompt('Enter Task Title:', task.title)
    const description = prompt('Enter Task Description:', task.description)
    const rewardStr = prompt('Enter Reward Amount:', task.reward.toString())
    
    if (title && description && rewardStr) {
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, title, description, reward: parseFloat(rewardStr) } : t
      ))
      alert('Task updated successfully!')
    }
  }

  const deleteTask = (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== taskId))
      alert('Task deleted successfully!')
    }
  }

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: t.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : t
    ))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <Navigation user={user} onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">🛠️ Admin Dashboard</h1>
            <p className="text-white opacity-90">Manage your platform</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            >
              <span className="text-2xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl z-50 border-2 border-gray-200">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notif.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">
                            {notif.type === 'new_user' && '👤'}
                            {notif.type === 'withdrawal' && '💰'}
                            {notif.type === 'upgrade' && '⭐'}
                            {notif.type === 'approval' && '✅'}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{notif.message}</p>
                            <p className="text-sm text-gray-500">{notif.time}</p>
                          </div>
                          {!notif.read && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Admin Tabs */}
        <div className="glass-effect rounded-xl p-6 mb-8 shadow-2xl backdrop-blur-xl border border-white/10">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'users', name: 'Users', icon: '👥' },
              { id: 'tasks', name: 'Tasks', icon: '📋' },
              { id: 'usdt', name: 'USDT Addresses', icon: '💎' },
              { id: 'withdrawals', name: 'Withdrawals', icon: '💰' },
              { id: 'settings', name: 'Settings', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center space-x-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-110 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-2xl scale-105'
                    : 'glass-effect text-white hover:bg-white/20 shadow-lg border border-white/20'
                }`}
              >
                <span className={`text-xl ${activeTab === tab.id ? 'animate-pulse' : 'group-hover:scale-125 transition-transform'}`}>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stats-card group cursor-pointer hover:shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="stats-icon bg-gradient-to-r from-blue-500 to-cyan-500 text-white animate-pulse">
                    👥
                  </div>
                  <div className="text-3xl opacity-20 group-hover:opacity-40 transition-opacity">👥</div>
                </div>
                <div className="stats-label">Total Users</div>
                <div className="stats-value text-blue-600 group-hover:scale-110 transition-transform">1,234</div>
              </div>
              <div className="stats-card group cursor-pointer hover:shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="stats-icon bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse">
                    ✅
                  </div>
                  <div className="text-3xl opacity-20 group-hover:opacity-40 transition-opacity">✅</div>
                </div>
                <div className="stats-label">Active Tasks</div>
                <div className="stats-value text-green-600 group-hover:scale-110 transition-transform">45</div>
              </div>
              <div className="stats-card group cursor-pointer hover:shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="stats-icon bg-gradient-to-r from-yellow-500 to-orange-500 text-white animate-pulse">
                    ⏳
                  </div>
                  <div className="text-3xl opacity-20 group-hover:opacity-40 transition-opacity">⏳</div>
                </div>
                <div className="stats-label">Pending Withdrawals</div>
                <div className="stats-value text-yellow-600 group-hover:scale-110 transition-transform">12</div>
              </div>
              <div className="stats-card group cursor-pointer hover:shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="stats-icon bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
                    💰
                  </div>
                  <div className="text-3xl opacity-20 group-hover:opacity-40 transition-opacity">💰</div>
                </div>
                <div className="stats-label">Total Revenue</div>
                <div className="stats-value text-purple-600 group-hover:scale-110 transition-transform">$12,345</div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="glass-effect rounded-xl p-6 shadow-2xl backdrop-blur-xl border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-white drop-shadow-lg">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="glass-effect text-white hover:bg-white/30 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 border border-white/20 shadow-lg">
                  <div className="text-3xl mb-2">✨</div>
                  <div className="font-semibold">Approve Users</div>
                  <div className="text-sm opacity-75">Review pending accounts</div>
                </button>
                <button className="glass-effect text-white hover:bg-white/30 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 border border-white/20 shadow-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="font-semibold">View Analytics</div>
                  <div className="text-sm opacity-75">Check platform stats</div>
                </button>
                <button className="glass-effect text-white hover:bg-white/30 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 border border-white/20 shadow-lg">
                  <div className="text-3xl mb-2">⚙️</div>
                  <div className="font-semibold">Manage Settings</div>
                  <div className="text-sm opacity-75">Configure platform</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card glass-effect border border-white/20">
            <div className="px-6 py-4 border-b border-white/20 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">User Management</h3>
              <button onClick={addNewUser} className="btn-primary">
                + Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="table-row">
                      <td className="table-cell font-medium text-gray-900">{user.name}</td>
                      <td className="table-cell text-gray-500">{user.email}</td>
                      <td className="table-cell">
                        <span className={`badge ${
                          user.role === 'SUPER_ADMIN' ? 'badge-purple' :
                          user.role === 'ADMIN' ? 'badge-primary' :
                          'badge-success'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${
                          user.isApproved ? 'badge-success' : 'badge-warning'
                        }`}>
                          {user.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="table-cell text-gray-500">${user.balance}</td>
                      <td className="table-cell text-gray-500">L{user.level}</td>
                      <td className="table-cell font-medium">
                        <div className="flex space-x-2">
                          {!user.isApproved && (
                            <button 
                              onClick={() => approveUser(user.id)}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              Approve
                            </button>
                          )}
                          <button 
                            onClick={() => setLevelModal({ show: true, userId: user.id, currentLevel: user.level })}
                            className="text-purple-600 hover:text-purple-900 font-medium"
                          >
                            Set Level
                          </button>
                          <button 
                            onClick={() => editUser(user.id)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="card glass-effect border border-white/20">
            <div className="px-6 py-4 border-b border-white/20 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Task Management</h3>
              <button onClick={addTask} className="btn-primary">
                Add New Task
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map(task => (
                  <div key={task.id} className="card border-2 border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold mb-2">{task.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="badge badge-primary">{task.type}</span>
                          <span className={`badge ${task.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                            {task.status}
                          </span>
                          <span className="text-2xl font-bold text-green-600">${task.reward}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => editTask(task.id)}
                        className="btn-primary flex-1 px-3 py-2"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => toggleTaskStatus(task.id)}
                        className="px-3 py-2 rounded text-sm bg-yellow-500 text-white hover:bg-yellow-600 flex-1"
                      >
                        {task.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="btn-danger flex-1 px-3 py-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'usdt' && (
          <div className="card glass-effect border border-white/20">
            <div className="px-6 py-4 border-b border-white/20 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">USDT Addresses</h3>
              <button onClick={addUSDTAddress} className="btn-primary">
                Add USDT Address
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {usdtAddresses.map(address => (
                  <div key={address.id} className="flex items-center justify-between p-4 glass-effect rounded-xl border border-white/20">
                    <div className="flex-1">
                      <p className="font-mono text-sm font-semibold text-white mb-2">{address.address}</p>
                      <div className="flex gap-2">
                        <span className="badge badge-primary">{address.network}</span>
                        <span className={`badge ${address.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {address.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => toggleAddressStatus(address.id)}
                        className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-110 ${
                          address.isActive ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {address.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => editUSDTAddress(address.id)}
                        className="btn-primary px-4 py-2"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteUSDTAddress(address.id)}
                        className="btn-danger px-4 py-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="card glass-effect border border-white/20">
            <div className="px-6 py-4 border-b border-white/20">
              <h3 className="text-lg font-medium text-white">Withdrawal Requests</h3>
            </div>
            <div className="p-6">
              <div className="text-center text-gray-500 py-8">
                <p>No pending withdrawal requests</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Platform Settings */}
            <div className="card glass-effect border border-white/20">
              <div className="px-6 py-4 border-b border-white/20">
                <h3 className="text-lg font-medium text-white">Platform Settings</h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Platform Name</label>
                    <input type="text" defaultValue="PromoHive" className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Welcome Bonus</label>
                    <input type="number" defaultValue="5.00" className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Minimum Withdrawal</label>
                    <input type="number" defaultValue="10.00" className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Max Daily Spins</label>
                    <input type="number" defaultValue="3" className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Max Spin Prize</label>
                    <input type="number" defaultValue="0.30" className="form-input" />
                  </div>
                  <button className="btn-success w-full">
                    Save Platform Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Free User Limit */}
            <div className="card glass-effect border border-white/20">
              <div className="px-6 py-4 border-b border-white/20">
                <h3 className="text-lg font-medium text-white">Free User Limit (Hidden from users)</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Free User Maximum Earnings</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={freeUserLimit}
                        onChange={(e) => setFreeUserLimit(parseFloat(e.target.value))}
                        className="form-input flex-1"
                      />
                      <span className="text-gray-600 font-medium">USD</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">⚠️ Hidden from users. System will automatically block earnings after this limit.</p>
                  </div>
                  <button 
                    onClick={() => alert(`Free user limit updated to $${freeUserLimit}`)}
                    className="btn-success w-full"
                  >
                    Save Free User Limit
                  </button>
                </div>
              </div>
            </div>

            {/* Home Banner Settings */}
            <div className="card glass-effect border border-white/20">
              <div className="px-6 py-4 border-b border-white/20">
                <h3 className="text-lg font-medium text-white">Home Page Banner Settings</h3>
                <p className="text-sm text-white/70 mt-1">Customize the welcome bonus banner on the home page</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Banner Title</label>
                    <input 
                      type="text" 
                      value={homeBannerSettings.title}
                      onChange={(e) => setHomeBannerSettings({...homeBannerSettings, title: e.target.value})}
                      className="form-input"
                      placeholder="🎁 Seize the Opportunity!"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Banner Subtitle</label>
                    <input 
                      type="text" 
                      value={homeBannerSettings.subtitle}
                      onChange={(e) => setHomeBannerSettings({...homeBannerSettings, subtitle: e.target.value})}
                      className="form-input"
                      placeholder="Sign up for a new account and earn $5 instantly!"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Button Text</label>
                    <input 
                      type="text" 
                      value={homeBannerSettings.buttonText}
                      onChange={(e) => setHomeBannerSettings({...homeBannerSettings, buttonText: e.target.value})}
                      className="form-input"
                      placeholder="Get Your $5 Bonus 🚀"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Bonus Amount</label>
                    <input 
                      type="text" 
                      value={homeBannerSettings.bonusAmount}
                      onChange={(e) => setHomeBannerSettings({...homeBannerSettings, bonusAmount: e.target.value})}
                      className="form-input"
                      placeholder="$5"
                    />
                  </div>
                  <button 
                    onClick={() => alert('Home banner settings saved!')}
                    className="btn-success w-full"
                  >
                    Save Banner Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Support Settings */}
            <div className="card glass-effect border border-white/20">
              <div className="px-6 py-4 border-b border-white/20">
                <h3 className="text-lg font-medium text-white">Support Contact Settings</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">WhatsApp Number</label>
                    <input 
                      type="text" 
                      value={supportSettings.whatsapp}
                      onChange={(e) => setSupportSettings({...supportSettings, whatsapp: e.target.value})}
                      className="form-input"
                      placeholder="+1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Support Email</label>
                    <input 
                      type="email" 
                      value={supportSettings.email}
                      onChange={(e) => setSupportSettings({...supportSettings, email: e.target.value})}
                      className="form-input"
                      placeholder="support@example.com"
                    />
                  </div>
                  <button 
                    onClick={() => alert('Support settings saved!')}
                    className="btn-success w-full"
                  >
                    Save Support Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Level Modal */}
      {levelModal.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-2xl font-bold gradient-text mb-4">Set User Level</h3>
            <p className="text-gray-600 mb-6">Current Level: L{levelModal.currentLevel}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Level (0-3)</label>
                <input 
                  type="number" 
                  id="newLevel"
                  min="0" 
                  max="3" 
                  defaultValue={levelModal.currentLevel}
                  className="form-input"
                />
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    const newLevel = parseInt(document.getElementById('newLevel').value)
                    updateUserLevel(levelModal.userId, newLevel)
                  }}
                  className="btn-primary flex-1"
                >
                  Update Level
                </button>
                <button 
                  onClick={() => setLevelModal({ show: false, userId: null, currentLevel: 0 })}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// NotFound component
function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
      <Navigation user={null} onLogout={() => {}} />
      <div className="text-center">
        <h1 className="text-8xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-white mb-8 opacity-90">Page not found</p>
        <a 
          href="/" 
          className="btn-primary text-lg px-8 py-4"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}

// Tasks component
function Tasks() {
  const { user, logout, loading } = React.useContext(AuthContext)
  const [tasks] = useState([
    {
      id: 1,
      title: 'Follow Instagram Account',
      description: 'Follow our Instagram account and like 5 recent posts',
      reward: 2.50,
      type: 'MANUAL',
      status: 'ACTIVE'
    },
    {
      id: 2,
      title: 'Join Telegram Group',
      description: 'Join our Telegram group and stay active for 7 days',
      reward: 5.00,
      type: 'MANUAL',
      status: 'ACTIVE'
    },
    {
      id: 3,
      title: 'Download Mobile App',
      description: 'Download and install our mobile app',
      reward: 3.00,
      type: 'MANUAL',
      status: 'ACTIVE'
    },
    {
      id: 4,
      title: 'Subscribe YouTube Channel',
      description: 'Subscribe to our YouTube channel and watch 3 videos',
      reward: 1.50,
      type: 'MANUAL',
      status: 'ACTIVE'
    },
    {
      id: 5,
      title: 'Follow Twitter Account',
      description: 'Follow our Twitter account and retweet 2 posts',
      reward: 2.00,
      type: 'MANUAL',
      status: 'ACTIVE'
    },
    {
      id: 6,
      title: 'Join Discord Server',
      description: 'Join our Discord server and stay active for 5 days',
      reward: 4.00,
      type: 'MANUAL',
      status: 'ACTIVE'
    }
  ])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <a href="/login" className="btn-primary">Go to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      <Navigation user={user} onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">📋 Available Tasks</h1>
          <p className="text-xl text-white opacity-90">Complete tasks and earn money</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div key={task.id} className="card hover:shadow-2xl transition-all duration-300 border-2 border-gray-100">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{task.description}</p>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <span className="badge badge-primary">{task.type}</span>
                  <span className={`badge ${task.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                    {task.status}
                  </span>
                </div>
                <span className="text-2xl font-bold text-green-600">${task.reward}</span>
              </div>
              
              <button className="btn-primary w-full">
                {task.status === 'ACTIVE' ? 'Start Task' : 'Task Unavailable'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Referrals component
function Referrals() {
  const { user, logout, loading } = React.useContext(AuthContext)
  const [referralCode] = useState('PHJXGSWVLH')
  // Updated referral system with new rewards structure
  const referralRewards = {
    L0: { invite: 5, earn: 3.00, upgradeCost: 50 },      // Free: Invite 5 → Earn $3, Upgrade to L1 costs $50
    L1: { invite: 5, earn: 80.00, upgradeCost: 100 },    // L1: Invite 5 → Earn $80, Upgrade to L2 costs $100  
    L2: { invite: 5, earn: 160.00, upgradeCost: 200 },   // L2: Invite 5 → Earn $160, Upgrade to L3 costs $200
    L3: { invite: 5, earn: 320.00, upgradeCost: 400 },    // L3: Invite 5 → Earn $320, Upgrade to L4 costs $400
    L4: { invite: 5, earn: 640.00 }                       // Max Level: Invite 5 → Earn $640
  }
  
  const [referrals] = useState([
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', level: 0, status: 'active', joined: '2024-01-15', earnings: 0.00, pendingEarnings: 3.00 },
    { id: 2, name: 'Michael Chen', email: 'michael.c@email.com', level: 1, status: 'active', joined: '2024-01-20', earnings: 80.00, pendingEarnings: 0.00 },
    { id: 3, name: 'Emily Rodriguez', email: 'emily.r@email.com', level: 0, status: 'pending', joined: '2024-01-22', earnings: 0.00, pendingEarnings: 3.00 },
    { id: 4, name: 'David Kumar', email: 'david.k@email.com', level: 2, status: 'active', joined: '2024-01-18', earnings: 160.00, pendingEarnings: 0.00 },
    { id: 5, name: 'Lisa Park', email: 'lisa.p@email.com', level: 0, status: 'active', joined: '2024-01-25', earnings: 0.00, pendingEarnings: 0.00 }
  ])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <a href="/login" className="btn-primary">Go to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      <Navigation user={user} onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">👥 Referral Program</h1>
          <p className="text-xl text-white opacity-90">Invite friends and earn bonuses</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h3 className="text-2xl font-semibold mb-6 gradient-text">Your Referral Code</h3>
            <div className="bg-gray-100 p-6 rounded-lg mb-6">
              <code className="text-3xl font-mono font-bold text-blue-600">{referralCode}</code>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(referralCode)
                alert('Referral code copied to clipboard!')
              }}
              className="btn-primary w-full"
            >
              Copy Code
            </button>
          </div>
          
          <div className="card">
            <h3 className="text-2xl font-semibold mb-6 gradient-text">Referral System</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div>
                  <span className="font-semibold text-green-700">Level 0 (Free)</span>
                  <p className="text-xs text-green-600">Invite 5 friends → Earn $3</p>
                </div>
                <span className="text-2xl font-bold text-green-600">$3.00</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <div>
                  <span className="font-semibold text-blue-700">Level 1 ($50)</span>
                  <p className="text-xs text-blue-600">Invite 5 friends → Earn $80</p>
                </div>
                <span className="text-2xl font-bold text-blue-600">$80.00</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div>
                  <span className="font-semibold text-purple-700">Level 2 ($100)</span>
                  <p className="text-xs text-purple-600">Invite 5 friends → Earn $160</p>
                </div>
                <span className="text-2xl font-bold text-purple-600">$160.00</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div>
                  <span className="font-semibold text-orange-700">Level 3 ($200)</span>
                  <p className="text-xs text-orange-600">Invite 5 friends → Earn $320</p>
                </div>
                <span className="text-2xl font-bold text-orange-600">$320.00</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-lg border border-indigo-200">
                <div>
                  <span className="font-semibold text-indigo-700">Level 4 ($400)</span>
                  <p className="text-xs text-indigo-600">Invite 5 friends → Earn $640</p>
                </div>
                <span className="text-2xl font-bold text-indigo-600">$640.00</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
              <p className="text-xs text-yellow-800 text-center">
                <strong>Note:</strong> Friends must be at your level or higher to count as referrals
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-2xl font-semibold mb-6 gradient-text">Your Referrals</h3>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earned</th>
                  <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                  <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referrals.map(referral => (
                  <tr key={referral.id} className="table-row hover:bg-gray-50 transition-colors">
                    <td className="table-cell font-medium text-gray-900">{referral.name}</td>
                    <td className="table-cell text-gray-500">{referral.email}</td>
                    <td className="table-cell">
                      <span className={`badge ${
                        referral.level === 0 ? 'badge-success' :
                        referral.level === 1 ? 'badge-primary' :
                        referral.level === 2 ? 'badge-secondary' :
                        'badge-warning'
                      }`}>
                        L{referral.level}
                      </span>
                    </td>
                    <td className="table-cell text-green-600 font-semibold">${referral.earnings.toFixed(2)}</td>
                    <td className="table-cell text-yellow-600 font-semibold">${referral.pendingEarnings.toFixed(2)}</td>
                    <td className="table-cell text-gray-500">{referral.joined}</td>
                    <td className="table-cell">
                      <span className={`badge ${referral.status === 'active' ? 'badge-success' : referral.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                        {referral.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// Withdrawals component
function Withdrawals() {
  const { user, logout, loading } = React.useContext(AuthContext)
  const [formData, setFormData] = useState({
    amount: '',
    walletAddress: '',
    network: 'USDT'
  })
  const [balance] = useState(user?.role === 'SUPER_ADMIN' ? 1000.00 : 5.00)
  const [withdrawals] = useState([
    { id: 1, amount: 25.00, address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE', network: 'TRC20', status: 'completed', date: '2024-01-15' },
    { id: 2, amount: 50.00, address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', network: 'ERC20', status: 'pending', date: '2024-01-20' }
  ])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <a href="/login" className="btn-primary">Go to Login</a>
        </div>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (parseFloat(formData.amount) < 10) {
      alert('Minimum withdrawal amount is $10')
      return
    }
    if (parseFloat(formData.amount) > balance) {
      alert('Insufficient balance')
      return
    }
    alert('Withdrawal request submitted! It will be processed within 24 hours.')
    setFormData({ amount: '', walletAddress: '', network: 'USDT' })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">💰 Withdraw Earnings</h1>
          <p className="text-xl text-gray-600">Withdraw your earnings to your USDT wallet</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-2xl font-semibold mb-6 gradient-text">Withdrawal Request</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
                <input 
                  type="number" 
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter amount"
                  min="10"
                  step="0.01"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available balance: ${balance} | <span className="font-bold text-orange-600">Minimum: $10</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">USDT Wallet Address</label>
                <input 
                  type="text" 
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your USDT wallet address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Network</label>
                <select 
                  name="network"
                  value={formData.network}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="USDT">USDT (TRC20)</option>
                  <option value="USDT_ERC20">USDT (ERC20)</option>
                </select>
              </div>
              <button 
                type="submit"
                className="btn-success w-full"
              >
                Submit Withdrawal Request
              </button>
            </form>
          </div>
          
          <div className="card">
            <h3 className="text-2xl font-semibold mb-6 gradient-text">Withdrawal History</h3>
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network</th>
                    <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {withdrawals.map(withdrawal => (
                    <tr key={withdrawal.id} className="table-row">
                      <td className="table-cell font-medium text-gray-900">${withdrawal.amount}</td>
                      <td className="table-cell">
                        <span className="badge badge-primary">{withdrawal.network}</span>
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${
                          withdrawal.status === 'completed' ? 'badge-success' :
                          withdrawal.status === 'pending' ? 'badge-warning' :
                          'badge-danger'
                        }`}>
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="table-cell text-gray-500">{withdrawal.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/profile" component={Profile} />
          <Route path="/tasks" component={Tasks} />
          <Route path="/referrals" component={Referrals} />
          <Route path="/withdrawals" component={Withdrawals} />
          <Route path="/luck-wheel" component={LuckWheel} />
          <Route path="/mining" component={MiningContracts} />
          <Route path="/admin" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </AuthProvider>
    </NotificationProvider>
  )
}

export default App