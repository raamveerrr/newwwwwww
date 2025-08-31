import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import './Auth.css'

function Login({ onSwitchToSignup, onClose }) {
  const [userType, setUserType] = useState('') // 'student' or 'admin'
  const [selectedShop, setSelectedShop] = useState('') // For admin users
  const [error, setError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)
  const [phoneLoading, setPhoneLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState(null)
  const { signInWithGoogle, signInWithPhoneNumber, verifyOtp } = useAuth()

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

  async function handlePhoneLogin() {
    if (!userType) {
      return setError('Please select user type (Student or Admin) before continuing')
    }

    if (userType === 'admin' && !selectedShop) {
      return setError('Please select your shop before continuing')
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      return setError('Please enter a valid 10-digit mobile number')
    }

    try {
      setError('')
      setPhoneLoading(true)
      
      const fullPhoneNumber = `+91${phoneNumber}`
      console.log('📱 Starting phone authentication...')
      
      const result = await signInWithPhoneNumber(fullPhoneNumber)
      setConfirmationResult(result)
      setShowOtpInput(true)
      setPhoneLoading(false)
    } catch (error) {
      console.error('❌ Phone authentication failed:', error)
      setError('Failed to send OTP: ' + (error.message || 'Unknown error occurred'))
      setPhoneLoading(false)
    }
  }

  async function handleOtpVerification() {
    if (!otp || otp.length !== 6) {
      return setError('Please enter a valid 6-digit OTP')
    }

    try {
      setError('')
      setPhoneLoading(true)
      
      const userData = {
        userType,
        shopId: userType === 'admin' ? selectedShop : null
      }
      
      await verifyOtp(confirmationResult, otp, userData)
      onClose()
    } catch (error) {
      console.error('❌ OTP verification failed:', error)
      setError('Invalid OTP. Please try again.')
    } finally {
      setPhoneLoading(false)
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
          
          <div className="auth-divider">
            <span>OR</span>
          </div>
          
          {!showOtpInput ? (
            <>
              <div className="form-group">
                <label>Mobile Number:</label>
                <div className="phone-input-group">
                  <span className="country-code">+91</span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setPhoneNumber(value)
                    }}
                    className="phone-input"
                    maxLength="10"
                  />
                </div>
              </div>
              
              <button 
                type="button" 
                className="phone-auth-button secondary" 
                onClick={handlePhoneLogin}
                disabled={phoneLoading || !userType || !phoneNumber || phoneNumber.length < 10 || (userType === 'admin' && !selectedShop)}
              >
                <span className="phone-icon">📱</span>
                {phoneLoading ? 'Sending OTP...' : 'Continue with Mobile'}
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Enter OTP sent to +91{phoneNumber}:</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setOtp(value)
                  }}
                  className="otp-input"
                  maxLength="6"
                />
              </div>
              
              <button 
                type="button" 
                className="phone-auth-button primary" 
                onClick={handleOtpVerification}
                disabled={phoneLoading || !otp || otp.length !== 6}
              >
                <span className="verify-icon">✓</span>
                {phoneLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
              
              <button 
                type="button" 
                className="back-button"
                onClick={() => {
                  setShowOtpInput(false)
                  setOtp('')
                  setPhoneNumber('')
                  setConfirmationResult(null)
                }}
              >
                ← Back to phone number
              </button>
            </>
          )}
          
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
        
        {/* reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  )
}

export default Login