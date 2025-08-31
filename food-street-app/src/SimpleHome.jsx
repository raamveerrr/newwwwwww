import React from 'react'
import { Link } from 'react-router-dom'
import { useSimpleCart } from './SimpleCartContext'
import './SimpleHome.css'

const SimpleHome = () => {
  const { getTotalItems } = useSimpleCart()

  return (
    <div className="simple-home">
      {/* Header */}
      <header className="home-header">
        <div className="logo">
          <span className="logo-icon">🍕</span>
          <h1>College Food Hub</h1>
        </div>
        <div className="cart-icon">
          <Link to="/cart" className="cart-link">
            🛒
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="home-main">
        <div className="hero-section">
          <div className="hero-content">
            <h2 className="welcome-title">Welcome to College Food Hub</h2>
            <p className="welcome-subtitle">
              Pre-order your favorite food and skip the queue!
            </p>
            
            <div className="features">
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span>Quick Ordering</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🕒</span>
                <span>Skip the Wait</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📱</span>
                <span>Mobile Friendly</span>
              </div>
            </div>

            <Link to="/menu" className="order-now-btn">
              Order Now
            </Link>
          </div>
          
          <div className="hero-image">
            <span className="food-emoji">🍔🍕🥗🥤</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-section">
          <div className="stat-card">
            <span className="stat-number">500+</span>
            <span className="stat-label">Happy Students</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">50+</span>
            <span className="stat-label">Food Items</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">5★</span>
            <span className="stat-label">Average Rating</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; 2024 College Food Hub. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default SimpleHome