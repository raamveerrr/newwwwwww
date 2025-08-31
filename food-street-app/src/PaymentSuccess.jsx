import React, { useEffect } from 'react'
import './PaymentSuccess.css'

function PaymentSuccess({ isOpen, onClose, orderData }) {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen || !orderData) return null

  return (
    <div className="payment-success-overlay" onClick={onClose}>
      <div className="payment-success-container" onClick={e => e.stopPropagation()}>
        <div className="success-animation">
          <div className="checkmark-circle">
            <div className="checkmark">✓</div>
          </div>
        </div>

        <div className="success-content">
          <h2>🎉 Payment Successful!</h2>
          <p className="success-message">
            Your order has been confirmed and receipts are being printed at the shops.
          </p>
          
          <div className="token-highlight">
            <div className="token-info">
              <span className="token-label">Your Token:</span>
              <span className="token-value">{orderData.tokenNumber}</span>
            </div>
          </div>

          <div className="next-steps">
            <h4>What's Next?</h4>
            <div className="steps">
              <div className="step">
                <span className="step-icon">🎫</span>
                <span>Click the <strong>Token button</strong> in navigation for full pickup details</span>
              </div>
              <div className="step">
                <span className="step-icon">🏃‍♂️</span>
                <span>Visit the shop(s) when your order is ready</span>
              </div>
              <div className="step">
                <span className="step-icon">🆔</span>
                <span>Show your token number to the shopkeeper</span>
              </div>
            </div>
          </div>

          <button className="got-it-btn" onClick={onClose}>
            Got it! 👍
          </button>
        </div>

        <button className="close-success-btn" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  )
}

export default PaymentSuccess