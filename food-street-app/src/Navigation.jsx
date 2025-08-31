import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useCart } from './CartContext'
import { useToken } from './TokenContext'
import Cart from './Cart'
import OrderHistory from './OrderHistory'
import './Navigation.css'

function Navigation() {
  const { currentUser, logout } = useAuth()
  const { toggleCart, getTotalItems } = useCart()
  const { hasActiveOrder } = useToken()
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleTokenClick = () => {
    setShowOrderHistory(true)
  }

  const closeOrderHistory = () => {
    setShowOrderHistory(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1) // Go back in history
    } else {
      navigate('/') // Fallback to home
    }
  }

  // Show back button on menu pages and admin
  const showBackButton = location.pathname.includes('/menu/') || 
                        location.pathname === '/admin' || 
                        location.pathname === '/orders'

  return (
    <>
      <nav className="menu-navbar">
        <div className="nav-content">
          <div className="nav-left">
            {showBackButton && (
              <button 
                className="back-btn"
                onClick={handleBackClick}
                title="Go back"
              >
                ← Back
              </button>
            )}
            <Link to="/" className="nav-logo">
              <span className="logo-icon">🍕</span>
              <span className="logo-text">Food Street</span>
            </Link>
          </div>
          
          <div className="nav-actions">
            <Link to="/orders" className="orders-link">
              📋 Orders
            </Link>
            
            {(hasActiveOrder || currentUser) && (
              <button 
                className="token-btn"
                onClick={handleTokenClick}
                title="View your order tokens"
              >
                🎫 My Tokens
                {hasActiveOrder && <span className="token-indicator">!</span>}
              </button>
            )}
            
            {currentUser && currentUser.email === 'admin@foodstreet.com' && (
              <Link to="/admin" className="admin-link">
                🔧 Admin
              </Link>
            )}
            
            <button 
              className="cart-btn"
              onClick={toggleCart}
            >
              🛒
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </button>
            
            {currentUser && (
              <div className="user-menu">
                <span className="welcome-text">
                  {currentUser.displayName || 'Student'}
                </span>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <Cart />
      
      {/* Order History Dialog */}
      <OrderHistory 
        isOpen={showOrderHistory}
        onClose={closeOrderHistory}
      />
    </>
  )
}

export default Navigation