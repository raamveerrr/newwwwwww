import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import { CartProvider } from './CartContext'
import Login from './Login'
import Signup from './Signup'
import LogoutDialog from './LogoutDialog'
import ZuzuMenu from './ZuzuMenu'
import OasisMenu from './OasisMenu'
import BitesMenu from './BitesMenu'
import ShakersMenu from './ShakersMenu'
import Orders from './Orders'
import Admin from './Admin'
import Cart from './Cart'
import './App.css'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth()
  
  if (!currentUser) {
    return <AuthFlow />
  }
  
  return children
}

// Authentication Flow Component
function AuthFlow() {
  const [showLogin, setShowLogin] = useState(true)
  const [showSignup, setShowSignup] = useState(false)

  return (
    <div className="auth-flow">
      <div className="auth-flow-background">
        <div className="auth-flow-content">
          <div className="auth-flow-header">
            <h1 className="auth-flow-title">
              <span className="logo-icon">🍕</span>
              College Food Street
            </h1>
            <p className="auth-flow-subtitle">
              Pre-order your favorite food and skip the queue!
            </p>
          </div>

          {showLogin && (
            <Login 
              onSwitchToSignup={() => {
                setShowLogin(false)
                setShowSignup(true)
              }}
              onClose={() => {}} // Can't close on auth flow
            />
          )}
          
          {showSignup && (
            <Signup 
              onSwitchToLogin={() => {
                setShowSignup(false)
                setShowLogin(true)
              }}
              onClose={() => {}} // Can't close on auth flow
            />
          )}
        </div>
      </div>
    </div>
  )
}

const shops = [
  {
    id: 1,
    name: 'ZUZU',
    description: 'Delicious street food & snacks',
    image: '🍕',
    color: 'zuzu',
    rating: 4.8,
    time: '15-20 min'
  },
  {
    id: 2,
    name: 'Oasis Kitchen',
    description: 'Fresh & healthy meals',
    image: '🥗',
    color: 'oasis',
    rating: 4.6,
    time: '10-15 min'
  },
  {
    id: 3,
    name: 'Bites and Bites',
    description: 'Quick bites & beverages',
    image: '🍔',
    color: 'bites',
    rating: 4.7,
    time: '5-10 min'
  },
  {
    id: 4,
    name: 'Shakers and Movers',
    description: 'Refreshing drinks & shakes',
    image: '🥤',
    color: 'shakers',
    rating: 4.9,
    time: '5-8 min'
  }
]

function LandingPage() {
  const { currentUser, userProfile, logout } = useAuth()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleOrderClick = (shopId) => {
    // Navigate to respective shop menu
    const routes = {
      1: '/menu/zuzu',
      2: '/menu/oasis', 
      3: '/menu/bites',
      4: '/menu/shakers'
    }
    window.location.href = routes[shopId]
  }

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  const handleLogoutConfirm = async () => {
    try {
      await logout()
      setShowLogoutDialog(false)
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false)
  }

  // Show admin dashboard for admin users
  if (userProfile?.userType === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-logo">
            <span className="logo-icon">🍕</span>
            <span className="logo-text">Food Street</span>
          </div>
          <div className="nav-actions">
            <div className="user-menu">
              <span className="welcome-text">
                Welcome, {userProfile?.name || currentUser?.displayName || 'Student'}!
              </span>
              {userProfile?.userType === 'student' && (
                <a href="/orders" className="orders-link">
                  📋 My Orders
                </a>
              )}
              <button className="logout-btn" onClick={handleLogoutClick}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            College Food Street
          </h1>
          <p className="hero-subtitle">
            Pre-order your favorite food and skip the queue!
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-icon">🛍️</span>
              <span>1000+ Orders</span>
            </div>
            <div className="stat">
              <span className="stat-icon">⏰</span>
              <span>Fast Delivery</span>
            </div>
            <div className="stat">
              <span className="stat-icon">⭐</span>
              <span>4.8 Rating</span>
            </div>
          </div>
        </div>
      </header>

      {/* Shops Section */}
      <main className="shops-section">
        <h2 className="section-title">
          Choose Your Favorite Shop
        </h2>
        
        <div className="shops-grid">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className={`shop-card ${shop.color}`}
            >
              <div className="shop-background">
                <div className="shop-emoji">{shop.image}</div>
              </div>
              
              <div className="shop-info">
                <h3 className="shop-name">{shop.name}</h3>
                <p className="shop-description">{shop.description}</p>
                
                <div className="shop-meta">
                  <div className="rating">
                    <span className="star-icon">⭐</span>
                    <span>{shop.rating}</span>
                  </div>
                  <div className="time">
                    <span className="clock-icon">⏰</span>
                    <span>{shop.time}</span>
                  </div>
                </div>
                
                <button className="order-button" onClick={() => handleOrderClick(shop.id)}>
                  View Menu
                  <span className="arrow-icon">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* Floating Animation Elements */}
      <div className="floating-elements">
        <div className="floating-element" style={{left: '10%', top: '20%'}}>🍕</div>
        <div className="floating-element" style={{left: '25%', top: '30%'}}>🍔</div>
        <div className="floating-element" style={{left: '40%', top: '40%'}}>🥗</div>
        <div className="floating-element" style={{left: '55%', top: '50%'}}>🥤</div>
        <div className="floating-element" style={{left: '70%', top: '60%'}}>🍟</div>
        <div className="floating-element" style={{left: '85%', top: '70%'}}>🌮</div>
      </div>

      {/* Logout Dialog */}
      <LogoutDialog 
        isOpen={showLogoutDialog}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>
            } />
            <Route path="/menu/zuzu" element={
              <ProtectedRoute>
                <ZuzuMenu />
              </ProtectedRoute>
            } />
            <Route path="/menu/oasis" element={
              <ProtectedRoute>
                <OasisMenu />
              </ProtectedRoute>
            } />
            <Route path="/menu/bites" element={
              <ProtectedRoute>
                <BitesMenu />
              </ProtectedRoute>
            } />
            <Route path="/menu/shakers" element={
              <ProtectedRoute>
                <ShakersMenu />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
          </Routes>
          <Cart />
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
