import React from 'react'

function DebugEnv() {
  const envVars = {
    VITE_RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>🔍 Environment Debug</h4>
      <pre>{JSON.stringify(envVars, null, 2)}</pre>
      <p><strong>Host:</strong> {window.location.hostname}</p>
      <p><strong>Protocol:</strong> {window.location.protocol}</p>
    </div>
  )
}

export default DebugEnv