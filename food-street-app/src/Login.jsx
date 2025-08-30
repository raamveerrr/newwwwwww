import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import './Auth.css'

function Login({ onSwitchToSignup, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('') // 'student' or 'admin'
  const [selectedShop, setSelectedShop] = useState('') // For admin users
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { login, signupWithGoogle, validateEmail } = useAuth()

  const [emailValidation, setEmailValidation] = useState({
    isValid: true,
    message: ''
  })

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const shops = [
    { id: 'zuzu', name: 'ZUZU', emoji: '🍕' },
    { id: 'oasis', name: 'Oasis Kitchen', emoji: '🥗' },
    { id: 'bites', name: 'Bites and Bites', emoji: '🍔' },
    { id: 'shakers', name: 'Shakers and Movers', emoji: '🥤' }
  ]

  async function handleSubmit(e) {
    e.preventDefault()

    if (!userType) {
      setError('Please select user type (Student or Admin)')
      return
    }

    if (userType === 'admin' && !selectedShop) {
      setError('Please select your shop')
      return
    }

    // Validate email format
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setError('')
      setLoading(true)
      
      // Add user type and shop info to login
      const userData = {
        email,
        password,
        userType,
        shopId: userType === 'admin' ? selectedShop : null
      }
      
      await login(email, password, userData)
      onClose()
    } catch (error) {
      setError('Failed to log in: ' + error.message)
    }

    setLoading(false)
  }

  async function handleGoogleLogin() {
    if (!userType) {
      return setError('Please select user type (Student or Admin) before continuing with Google')
    }

    if (userType === 'admin' && !selectedShop) {
      return setError('Please select your shop before continuing with Google')
    }

    try {
      setError('')
      setGoogleLoading(true)
      
      const userData = {
        userType,
        shopId: userType === 'admin' ? selectedShop : null
      }
      
      await signupWithGoogle(userData)
      onClose()
    } catch (error) {
      setError('Google login failed: ' + error.message)
    }

    setGoogleLoading(false)
  }

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <div className="auth-header">
          <h2>Welcome Back!</h2>
          <p>Sign in to your account</p>
          <button className="auth-close" onClick={onClose}>×</button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>I am a:</label>
            <div className="user-type-selection">
              <button
                type="button"
                className={`user-type-btn ${userType === 'student' ? 'active' : ''}`}
                onClick={() => setUserType('student')}
              >
                <span className="user-type-emoji">🎓</span>
                <span>Student</span>
              </button>
              <button
                type="button"
                className={`user-type-btn ${userType === 'admin' ? 'active' : ''}`}
                onClick={() => setUserType('admin')}
              >
                <span className="user-type-emoji">👨‍💼</span>
                <span>Shop Admin</span>
              </button>
            </div>
          </div>

          {userType === 'admin' && (
            <div className="form-group">
              <label>Select Your Shop:</label>
              <div className="shop-selection">
                {shops.map(shop => (
                  <button
                    key={shop.id}
                    type="button"
                    className={`shop-btn ${selectedShop === shop.id ? 'active' : ''}`}
                    onClick={() => setSelectedShop(shop.id)}
                  >
                    <span className="shop-emoji">{shop.emoji}</span>
                    <span>{shop.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                // Real-time email validation
                if (e.target.value) {
                  if (validateEmail(e.target.value)) {
                    setEmailValidation({ isValid: true, message: '' })
                  } else {
                    setEmailValidation({ 
                      isValid: false, 
                      message: 'Please enter a valid email address'
                    })
                  }
                } else {
                  setEmailValidation({ isValid: true, message: '' })
                }
              }}
              required
              placeholder={userType === 'admin' ? 'Enter your admin email' : 'Enter your college email'}
              className={`form-input ${email && !emailValidation.isValid ? 'invalid' : ''} ${email && emailValidation.isValid ? 'valid' : ''}`}
            />
            {email && !emailValidation.isValid && (
              <span className="validation-message error">{emailValidation.message}</span>
            )}
            {email && emailValidation.isValid && (
              <span className="validation-message success">✓ Valid email address</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="form-input"
            />
          </div>

          <button disabled={loading} type="submit" className="auth-button">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div className="auth-divider">
            <span>or</span>
          </div>
          
          <button 
            type="button" 
            className="google-auth-button" 
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
          >
            <span className="google-icon">🔍</span>
            {googleLoading ? 'Signing in with Google...' : 'Sign in with Google'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button className="auth-link" onClick={onSwitchToSignup}>
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login