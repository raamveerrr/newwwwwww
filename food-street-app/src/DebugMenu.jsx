import React from 'react'

function DebugMenu() {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f0f0',
      margin: '20px',
      borderRadius: '10px'
    }}>
      <h1>🐛 Debug Menu - Test Component</h1>
      <p><strong>✅ If you see this, React is working properly!</strong></p>
      
      <div style={{marginTop: '20px'}}>
        <h3>🍕 Sample Menu Items (Hard-coded for testing):</h3>
        <div style={{
          display: 'grid',
          gap: '10px',
          marginTop: '10px'
        }}>
          <div style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            backgroundColor: 'white'
          }}>
            🍕 Margherita Pizza - ₹199
          </div>
          <div style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            backgroundColor: 'white'
          }}>
            🍔 Classic Burger - ₹159
          </div>
          <div style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            backgroundColor: 'white'
          }}>
            🥤 Cold Coffee - ₹69
          </div>
        </div>
      </div>
      
      <div style={{marginTop: '20px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '5px'}}>
        <strong>Environment Info:</strong>
        <br />
        Mode: {import.meta.env.MODE}
        <br />
        Firebase: {import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Present' : '❌ Missing'}
      </div>
    </div>
  )
}

export default DebugMenu