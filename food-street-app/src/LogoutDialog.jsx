import React from 'react'
import './LogoutDialog.css'

function LogoutDialog({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="logout-dialog-overlay" onClick={onCancel}>
      <div className="logout-dialog-container" onClick={e => e.stopPropagation()}>
        <div className="logout-dialog-header">
          <h3>Confirm Logout</h3>
        </div>
        
        <div className="logout-dialog-content">
          <div className="logout-icon">🚪</div>
          <p>Are you sure you want to logout?</p>
          <p className="logout-warning">You'll need to login again to access the app.</p>
        </div>
        
        <div className="logout-dialog-actions">
          <button className="cancel-btn" onClick={onCancel}>
            No, Stay Logged In
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutDialog