import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useCart } from './CartContext'
import { useToken } from './TokenContext'
import TokenDisplay from './TokenDisplay'
import './MobileNavigation.css'

function MobileNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()
  const { getTotalItems, toggleCart } = useCart()
  const { hasActiveOrder, latestOrder, showTokenDialog, openTokenDialog, closeTokenDialog } = useToken()

  // Don't show on auth pages
  if (!currentUser || location.pathname.includes('/admin')) {
    return null
  }

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  // Show back button on menu pages
  const showBackButton = location.pathname.includes('/menu/') || 
                        location.pathname === '/orders'

  const navItems = [
    {
      path: '/',
      icon: '🏠',
      label: 'Home',
      active: location.pathname === '/'
    },
    {
      path: '/orders',
      icon: '📋',
      label: 'Orders',
      active: location.pathname === '/orders'
    },


    {
      path: '#cart',
      icon: '🛒',
      label: 'Cart',
      active: false,
      onClick: (e) => {
        e.preventDefault()
        toggleCart()
        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(25)
        }
      },
      badge: getTotalItems()
    }
  ]

  // Add admin option for admin users
  if (userProfile?.userType === 'admin') {
    navItems.splice(2, 0, {
      path: '/admin',
      icon: '⚙️',
      label: 'Admin',
      active: location.pathname === '/admin'
    })
  }

  // Add back button if needed
  if (showBackButton) {
    navItems.unshift({
      icon: '←',
      label: 'Back',
      onClick: (e) => {
        e.preventDefault()
        handleBackClick()
        if (navigator.vibrate) {
          navigator.vibrate(15)
        }
      }
    })
  }

  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-container">
        {navItems.filter(item => !item.hidden).map((item, index) => {
          if (item.onClick) {
            return (
              <button
                key={index}
                className={`mobile-nav-item ${item.active ? 'active' : ''} ${item.label === 'Token' ? 'token-nav-item' : ''}`}
                onClick={item.onClick}
              >
                <div className="nav-icon-container">
                  <span className="nav-icon">{item.icon}</span>
                  {item.badge > 0 && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                  {item.label === 'Token' && (
                    <span className="token-nav-indicator">!</span>
                  )}
                </div>
                <span className="nav-label">{item.label}</span>
              </button>
            )
          }

          return (
            <Link
              key={index}
              to={item.path}
              className={`mobile-nav-item ${item.active ? 'active' : ''}`}
              onClick={() => {
                // Haptic feedback
                if (navigator.vibrate) {
                  navigator.vibrate(15)
                }
              }}
            >
              <div className="nav-icon-container">
                <span className="nav-icon">{item.icon}</span>
                {item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </div>
              <span className="nav-label">{item.label}</span>
            </Link>
          )
        })}
      </div>
      
      {/* Token Dialog */}
      {showTokenDialog && latestOrder && (
        <TokenDisplay 
          orderData={latestOrder} 
          onClose={closeTokenDialog} 
        />
      )}
    </nav>
  )
}

export default MobileNavigation