import React, { useState } from 'react'
import { useAuth } from './AuthContext'

function LoginDebug() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle, currentUser } = useAuth()

  const handleTestLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      console.log('🔐 Testing Google Login...')
      console.log('🔥 Firebase Auth:', !!window.firebase)
      console.log('🌐 Current User:', currentUser)
      
      await signInWithGoogle({ userType: 'student' })
      console.log('✅ Login successful!')
    } catch (error) {
      console.error('❌ Login failed:', error)
      setError(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      padding: '15px',
      border: '2px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 10000,
      maxWidth: '300px'
    }}>
      <h4>🔧 Login Debug</h4>
      
      {currentUser ? (
        <div>
          <p style={{color: 'green'}}>✅ Logged in as: {currentUser.email}</p>
        </div>
      ) : (
        <div>
          <p style={{color: 'red'}}>❌ Not logged in</p>
          <button 
            onClick={handleTestLogin}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Testing...' : 'Test Google Login'}
          </button>
        </div>
      )}
      
      {error && (
        <div style={{
          color: 'red',
          fontSize: '12px',
          marginTop: '10px',
          padding: '8px',
          background: '#ffebee',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      
      <div style={{fontSize: '10px', marginTop: '10px', color: '#666'}}>
        <p>Environment: {import.meta.env.MODE}</p>
        <p>Host: {window.location.hostname}</p>
      </div>
    </div>
  )
}

export default LoginDebug