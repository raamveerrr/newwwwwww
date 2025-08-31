import React, { useState } from 'react'
import './TokenDisplay.css'

function TokenListDisplay({ shop, tokens, onClose, onGenerateToken }) {
  const [showCopied, setShowCopied] = useState(false)
  const [selectedToken, setSelectedToken] = useState(null)

  const copyTokenToClipboard = (tokenNumber) => {
    navigator.clipboard.writeText(tokenNumber)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)

    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  const handleTokenClick = (token) => {
    setSelectedToken(token)
  }

  const closeTokenDetail = () => {
    setSelectedToken(null)
  }

  if (selectedToken) {
    return (
      <div className="token-overlay">
        <div className="token-container">
          {/* Success Header */}
          <div className="success-header">
            <div className="success-icon">🎫</div>
            <h2>Token Details</h2>
            <p>Your token information for {shop.name}</p>
          </div>

          {/* Token Display */}
          <div className="token-display">
            <div className="token-label">Your Token Number</div>
            <div className="token-number" onClick={() => copyTokenToClipboard(selectedToken.tokenNumber)}>
              {selectedToken.tokenNumber}
              {showCopied && <span className="copied-indicator">Copied!</span>}
            </div>
            <div className="token-hint">Tap to copy • Show this to shopkeepers</div>
          </div>

          {/* Order Summary */}
          <div className="order-summary-token">
            <h3>Token Information</h3>
            <div className="summary-row">
              <span>Shop:</span>
              <span>{selectedToken.shopName}</span>
            </div>
            <div className="summary-row">
              <span>Generated:</span>
              <span>{new Date(selectedToken.timestamp).toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Status:</span>
              <span className={`status-${selectedToken.orderStatus || 'confirmed'}`}>
                {getStatusIcon(selectedToken.orderStatus || 'confirmed')} {(selectedToken.orderStatus || 'confirmed').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="token-actions">
            <button className="copy-token-btn" onClick={() => copyTokenToClipboard(selectedToken.tokenNumber)}>
              📋 Copy Token
            </button>
            <button className="back-btn" onClick={closeTokenDetail}>
              ← Back to Tokens
            </button>
            <button className="done-btn" onClick={onClose}>
              ✅ Done
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="token-overlay">
      <div className="token-container">
        {/* Header */}
        <div className="success-header">
          <div className="success-icon">🎫</div>
          <h2>Tokens for {shop.name}</h2>
          <p>Your token history for this shop</p>
        </div>

        {/* Tokens List */}
        <div className="tokens-list">
          {tokens.length === 0 ? (
            <div className="no-tokens">
              <div className="no-tokens-icon">📝</div>
              <h3>No Orders Found</h3>
              <p>You haven't placed any orders at {shop.name} yet.</p>
              <button
                className="generate-token-btn"
                onClick={() => onGenerateToken(shop.id)}
              >
                🎫 Generate New Token
              </button>
            </div>
          ) : (
            <>
              <div className="tokens-header">
                <h3>Your Tokens ({tokens.length})</h3>
                <button
                  className="generate-token-btn small"
                  onClick={() => onGenerateToken(shop.id)}
                >
                  + New Token
                </button>
              </div>

              <div className="tokens-grid">
                {tokens.map((token, index) => (
                  <div
                    key={index}
                    className="token-card"
                    onClick={() => handleTokenClick(token)}
                  >
                    <div className="token-card-header">
                      <span className="token-number-small">{token.tokenNumber}</span>
                      <span className={`status-small status-${token.orderStatus || 'confirmed'}`}>
                        {getStatusIcon(token.orderStatus || 'confirmed')}
                      </span>
                    </div>
                    <div className="token-card-info">
                      <div className="token-date">
                        {new Date(token.timestamp).toLocaleDateString()}
                      </div>
                      <div className="token-time">
                        {new Date(token.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="token-actions">
          <button className="done-btn" onClick={onClose}>
            ✅ Close
          </button>
        </div>
      </div>
    </div>
  )
}

const getStatusIcon = (status) => {
  const icons = {
    'confirmed': '✅',
    'preparing': '👨‍🍳',
    'ready': '🔔',
    'completed': '🎉',
    'cancelled': '❌'
  }
  return icons[status] || '📋'
}

export default TokenListDisplay
