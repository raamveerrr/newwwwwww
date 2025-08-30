import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import './Auth.css'

function Signup({ onSwitchToLogin, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [userType, setUserType] = useState('') // 'student' or 'admin'
  const [selectedShop, setSelectedShop] = useState('') // For admin users
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signup, signupWithGoogle, validateEmail } = useAuth()

  const [emailValidation, setEmailValidation] = useState({
    isValid: true,
    message: ''
  })

  const [passwordValidation, setPasswordValidation] = useState({
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

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    
    // Real-time email validation
    if (e.target.name === 'email') {
      const email = e.target.value
      if (email) {
        if (validateEmail(email)) {
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
    }
    
    // Real-time password validation
    if (e.target.name === 'password') {
      const password = e.target.value
      if (password) {
        if (password.length >= 6) {
          setPasswordValidation({ isValid: true, message: '' })
        } else {
          setPasswordValidation({ 
            isValid: false, 
            message: 'Password must be at least 6 characters'
          })
        }
      } else {
        setPasswordValidation({ isValid: true, message: '' })
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!userType) {
      return setError('Please select user type (Student or Admin)')
    }

    if (userType === 'admin' && !selectedShop) {
      return setError('Please select your shop')
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      return setError('Please enter a valid email address')
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match')
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    try {
      setError('')
      setLoading(true)
      
      const userData = {
        userType,
        shopId: userType === 'admin' ? selectedShop : null
      }
      
      await signup(formData.email, formData.password, formData.name, userData)
      onClose()
    } catch (error) {
      setError('Failed to create an account: ' + error.message)
    }

    setLoading(false)
  }

  async function handleGoogleSignup() {
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
      setError('Google signup failed: ' + error.message)
    }

    setGoogleLoading(false)
  }

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <div className="auth-header">
          <h2>Join Food Street!</h2>
          <p>Create your account to start ordering</p>
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
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{userType === 'admin' ? 'Admin Email' : 'College Email'}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={userType === 'admin' ? 'admin@yourshop.com' : 'your.name@college.edu'}
              className={`form-input ${formData.email && !emailValidation.isValid ? 'invalid' : ''} ${formData.email && emailValidation.isValid ? 'valid' : ''}`}
            />
            {formData.email && !emailValidation.isValid && (
              <span className="validation-message error">{emailValidation.message}</span>
            )}
            {formData.email && emailValidation.isValid && (
              <span className="validation-message success">✓ Valid email address</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a secure password"
              className={`form-input ${formData.password && !passwordValidation.isValid ? 'invalid' : ''} ${formData.password && passwordValidation.isValid && formData.password.length >= 6 ? 'valid' : ''}`}
            />
            {formData.password && !passwordValidation.isValid && (
              <span className="validation-message error">{passwordValidation.message}</span>
            )}
            {formData.password && passwordValidation.isValid && formData.password.length >= 6 && (
              <span className="validation-message success">✓ Password strength: Good</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className="form-input"
            />
          </div>

          <button disabled={loading} type="submit" className="auth-button">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <div className="auth-divider">
            <span>or</span>
          </div>
          
          <button 
            type="button" 
            className="google-auth-button" 
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
          >
            <span className="google-icon">🔍</span>
            {googleLoading ? 'Signing up with Google...' : 'Sign up with Google'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button className="auth-link" onClick={onSwitchToLogin}>
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup