import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSimpleCart } from './SimpleCartContext'
import { useSimpleOrder } from './SimpleOrderContext'
import './SimplePayment.css'

const SimplePayment = () => {
  const { items, getTotalItems, getTotalPrice, clearCart } = useSimpleCart()
  const { createOrder } = useSimpleOrder()
  const navigate = useNavigate()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')

  const formatPrice = (price) => {
    return `₹${price}`
  }

  const handleSimulatePayment = async () => {
    if (items.length === 0) {
      alert('Your cart is empty!')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing delay (2-3 seconds)
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Create order
      const order = createOrder(items, getTotalPrice())
      
      // Clear cart after successful payment
      clearCart()
      
      // Navigate to success page
      navigate('/success', { 
        state: { 
          order,
          fromPayment: true 
        } 
      })
    } catch (error) {
      console.error('Payment simulation failed:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="simple-payment empty-payment">
        <header className="payment-header">
          <Link to="/cart" className="back-btn">
            ← Back to Cart
          </Link>
          <h1 className="payment-title">Payment</h1>
          <div></div>
        </header>

        <div className="empty-payment-content">
          <div className="empty-icon">💳</div>
          <h2>No items to pay for</h2>
          <p>Your cart is empty. Add some items first!</p>
          <Link to="/menu" className="browse-menu-btn">
            Browse Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="simple-payment">
      {/* Header */}
      <header className="payment-header">
        <Link to="/cart" className="back-btn">
          ← Back to Cart
        </Link>
        <h1 className="payment-title">Payment</h1>
        <div></div>
      </header>

      {/* Payment Content */}
      <main className="payment-content">
        {/* Order Summary */}
        <div className="order-summary">
          <h2 className="section-title">Order Summary</h2>
          <div className="summary-items">
            {items.map(item => (
              <div key={item.id} className="summary-item">
                <div className="item-info">
                  <span className="item-emoji">{item.image}</span>
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="item-total">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="summary-totals">
            <div className="total-row">
              <span>Subtotal ({getTotalItems()} items)</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="total-row">
              <span>Delivery Fee</span>
              <span className="free">Free</span>
            </div>
            <div className="total-row taxes">
              <span>Taxes & Fees</span>
              <span>₹0</span>
            </div>
            <div className="total-row grand-total">
              <span>Total Amount</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-methods">
          <h2 className="section-title">Payment Method</h2>
          <div className="method-options">
            <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="option-content">
                <span className="option-icon">💳</span>
                <span className="option-text">Credit/Debit Card</span>
              </div>
            </label>

            <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="option-content">
                <span className="option-icon">📱</span>
                <span className="option-text">UPI Payment</span>
              </div>
            </label>

            <label className={`payment-option ${paymentMethod === 'wallet' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="wallet"
                checked={paymentMethod === 'wallet'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="option-content">
                <span className="option-icon">👛</span>
                <span className="option-text">Digital Wallet</span>
              </div>
            </label>

            <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="option-content">
                <span className="option-icon">💵</span>
                <span className="option-text">Cash on Pickup</span>
              </div>
            </label>
          </div>
        </div>

        {/* Mock Payment Info */}
        <div className="payment-info">
          <div className="info-card">
            <h3>🚀 Demo Payment</h3>
            <p>
              This is a simulated payment process. No real money will be charged.
              Click "Simulate Payment Success" to proceed.
            </p>
          </div>
        </div>
      </main>

      {/* Payment Footer */}
      <footer className="payment-footer">
        <div className="footer-content">
          <div className="total-display">
            <span className="total-label">Total: {formatPrice(getTotalPrice())}</span>
          </div>
          <button
            className={`payment-btn ${isProcessing ? 'processing' : ''}`}
            onClick={handleSimulatePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              'Simulate Payment Success'
            )}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default SimplePayment