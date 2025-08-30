import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useCart } from './CartContext'
import Cart from './Cart'
import './Navigation.css'

function Navigation() {
  const { currentUser, logout } = useAuth()
  const { toggleCart, getTotalItems } = useCart()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <>
      <nav className="menu-navbar">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">🍕</span>
            <span className="logo-text">Food Street</span>
          </Link>
          
          <div className="nav-actions">
            <Link to="/orders" className="orders-link">
              📋 Orders
            </Link>
            
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
    </>
  )
}

export default Navigation