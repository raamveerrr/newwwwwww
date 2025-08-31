import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import './Auth.css'

function Login({ onSwitchToSignup, onClose }) {
  const [userType, setUserType] = useState('') // 'student' or 'admin'
  const [selectedShop, setSelectedShop] = useState('') // For admin users
  const [error, setError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signInWithGoogle } = useAuth()

  // Prevent background scrolling when modal is open
  useEffect(() => {
    // Prevent background scrolling
    document.body.style.overflow = 'hidden'
    
    return () => {
      // Restore original settings
      document.body.style.overflow = 'unset'
    }
  }, [])

  const shops = [
    { id: 'zuzu', name: 'ZUZU', emoji: '🍕' },
    { id: 'oasis', name: 'Oasis Kitchen', emoji: '🥗' },
    { id: 'bites', name: 'Bites and Bites', emoji: '🍔' },
    { id: 'shakers', name: 'Shakers and Movers', emoji: '🥤' }
  ]

  async function handleGoogleLogin() {
    if (!userType) {
      return setError('Please select user type (Student or Admin) before continuing')
    }

    if (userType === 'admin' && !selectedShop) {
      return setError('Please select your shop before continuing')
    }

    try {
      setError('')
      setGoogleLoading(true)
      
      const userData = {
        userType,
        shopId: userType === 'admin' ? selectedShop : null
      }
      
      console.log('🔐 Starting Google authentication...')
      await signInWithGoogle(userData)
      
      // Only close if we get here (popup succeeded)
      onClose()
    } catch (error) {
      console.error('❌ Authentication failed:', error)
      
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled. Please try again or use a different browser if popups are blocked.')
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups for this site or try a different browser.')
      } else if (error.code === 'auth/cancelled-popup-request') {
        setError('Multiple sign-in attempts detected. Please wait a moment and try again.')
      } else {
        setError('Authentication failed: ' + (error.message || 'Unknown error occurred'))
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div 
        className="auth-modal"
        onClick={e => e.stopPropagation()}
      >
        <div className="auth-header">
          <h2>Welcome to Food Street!</h2>
          <p>Sign in with your Google account to continue</p>
          <button className="auth-close" onClick={onClose}>×</button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-form">
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
          
          <button 
            type="button" 
            className="google-auth-button primary" 
            onClick={handleGoogleLogin}
            disabled={googleLoading || !userType || (userType === 'admin' && !selectedShop)}
          >
            <span className="google-icon">🔍</span>
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>
          
          <div className="auth-note">
            <p>🔒 Secure authentication powered by Google</p>
            <p>We only use Google accounts for enhanced security</p>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            New to Food Street?{' '}
            <button className="auth-link" onClick={onSwitchToSignup}>
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login