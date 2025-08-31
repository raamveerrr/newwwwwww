import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSimpleOrder } from './SimpleOrderContext'
import './SimpleSuccess.css'

const SimpleSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentOrder, completeOrder } = useSimpleOrder()
  
  const [order, setOrder] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Check if we have order data from payment flow
    if (location.state?.order && location.state?.fromPayment) {
      setOrder(location.state.order)
      completeOrder()
      setShowConfetti(true)
      
      // Clear the location state to prevent refresh issues
      window.history.replaceState({}, document.title)
      
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 3000)
    } else if (currentOrder) {
      setOrder(currentOrder)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    } else {
      // No order data, redirect to home
      navigate('/', { replace: true })
    }
  }, [location.state, currentOrder, completeOrder, navigate])

  const formatPrice = (price) => {
    return `₹${price}`
  }

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  const handleNewOrder = () => {
    navigate('/menu')
  }

  const handleGoHome = () => {
    navigate('/')
  }

  if (!order) {
    return (
      <div className="simple-success loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  const dateTime = formatDateTime(order.timestamp)

  return (
    <div className="simple-success">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'][Math.floor(Math.random() * 6)]
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <header className="success-header">
        <div className="header-content">
          <Link to="/" className="home-btn">
            🏠 Home
          </Link>
          <h1 className="success-title">Order Confirmed!</h1>
          <div></div>
        </div>
      </header>

      {/* Success Content */}
      <main className="success-content">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="success-circle">
            <div className="success-checkmark">✓</div>
          </div>
          <h2 className="success-message">Payment Successful!</h2>
          <p className="success-subtitle">
            Your order has been confirmed and is being prepared
          </p>
        </div>

        {/* Order Details */}
        <div className="order-details">
          <div className="order-header">
            <h3>Order Details</h3>
            <div className="order-meta">
              <span className="order-date">{dateTime.date}</span>
              <span className="order-time">{dateTime.time}</span>
            </div>
          </div>

          {/* Order Token */}
          <div className="order-token">
            <div className="token-label">Your Order Token</div>
            <div className="token-value">{order.token}</div>
            <div className="token-id">Order ID: {order.id}</div>
          </div>

          {/* Order Items */}
          <div className="order-items">
            <h4>Items Ordered</h4>
            <div className="items-list">
              {order.items.map(item => (
                <div key={item.id} className="order-item">
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
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-row">
              <span>Total Items</span>
              <span>{order.items.reduce((total, item) => total + item.quantity, 0)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span className="free">Free</span>
            </div>
            <div className="summary-row total">
              <span>Total Paid</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Pickup Instructions */}
          <div className="pickup-info">
            <h4>📍 Pickup Instructions</h4>
            <div className="pickup-details">
              <p>• Show your order token <strong>{order.token}</strong> at the pickup counter</p>
              <p>• Estimated preparation time: <strong>15-20 minutes</strong></p>
              <p>• You will receive a notification when your order is ready</p>
              <p>• Counter location: College Food Court, Ground Floor</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="secondary-btn" onClick={handleGoHome}>
            🏠 Go Home
          </button>
          <button className="primary-btn" onClick={handleNewOrder}>
            🍕 Order Again
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="success-footer">
        <p>Thank you for using College Food Hub! 🎉</p>
        <p>For any queries, contact us at support@collegefoodhub.com</p>
      </footer>
    </div>
  )
}

export default SimpleSuccess