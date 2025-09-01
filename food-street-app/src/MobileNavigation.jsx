import React, { useMemo } from 'react'
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
  const { getTotalItems, toggleCart, isCartOpen } = useCart()
  const { hasActiveOrder, latestOrder, showTokenDialog, openTokenDialog, closeTokenDialog } = useToken()

  // Don't show on auth pages or admin pages
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

  // Show back button on menu pages and orders page
  const showBackButton = location.pathname.includes('/menu/') ||
                        location.pathname === '/orders'

  // Memoize navigation items to prevent unnecessary re-renders
  const navItems = useMemo(() => {
    const items = [
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
        active: isCartOpen, // Use cart open state for active indication
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
      items.splice(2, 0, {
        path: '/admin',
        icon: '⚙️',
        label: 'Admin',
        active: location.pathname === '/admin'
      })
    }

    // Add back button if needed
    if (showBackButton) {
      items.unshift({
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

    return items
  }, [location.pathname, userProfile?.userType, showBackButton, getTotalItems, isCartOpen, toggleCart])

  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-container">
        {navItems.map((item, index) => {
          if (item.onClick) {
            return (
              <button
                key={`${item.label}-${index}`}
                className={`mobile-nav-item ${item.active ? 'active' : ''}`}
                onClick={item.onClick}
                aria-label={`${item.label}${item.badge > 0 ? ` (${item.badge} items)` : ''}`}
              >
                <div className="nav-icon-container">
                  <span className="nav-icon">{item.icon}</span>
                  {item.badge > 0 && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </div>
                <span className="nav-label">{item.label}</span>
              </button>
            )
          }

          return (
            <Link
              key={`${item.label}-${index}`}
              to={item.path}
              className={`mobile-nav-item ${item.active ? 'active' : ''}`}
              onClick={() => {
                // Haptic feedback
                if (navigator.vibrate) {
                  navigator.vibrate(15)
                }
              }}
              aria-label={`${item.label}${item.badge > 0 ? ` (${item.badge} items)` : ''}`}
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
