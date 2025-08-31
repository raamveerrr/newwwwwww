import React, { useState, useEffect, useRef } from 'react'
import { useCart } from './CartContext'
import { useAuth } from './AuthContext'
import { useToken } from './TokenContext'
import { Link } from 'react-router-dom'
import Checkout from './Checkout'
import OrderSuccess from './OrderSuccess'
import './Cart.css'

function Cart() {
  const {
    cartItems,
    isCartOpen,
    toggleCart,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
    clearCart
  } = useCart()

  const { currentUser } = useAuth()
  const { latestOrder } = useToken()
  const [showCheckout, setShowCheckout] = useState(false)
  const [showOrderSuccess, setShowOrderSuccess] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const [safeAreaInsets, setSafeAreaInsets] = useState({ top: 0, bottom: 0, left: 0, right: 0 })
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)
  const cartRef = useRef(null)

  // Safe area detection for devices without CSS env() support
  useEffect(() => {
    const updateSafeAreaInsets = () => {
      const testEl = document.createElement('div')
      testEl.style.cssText = `
        position: fixed;
        top: env(safe-area-inset-top);
        bottom: env(safe-area-inset-bottom);
        left: env(safe-area-inset-left);
        right: env(safe-area-inset-right);
        visibility: hidden;
        pointer-events: none;
      `
      document.body.appendChild(testEl)

      const computedStyle = getComputedStyle(testEl)
      const top = parseInt(computedStyle.top) || 0
      const bottom = parseInt(computedStyle.bottom) || 0
      const left = parseInt(computedStyle.left) || 0
      const right = parseInt(computedStyle.right) || 0

      document.body.removeChild(testEl)

      setSafeAreaInsets({ top, bottom, left, right })

      // Apply safe area styles dynamically
      if (cartRef.current) {
        cartRef.current.style.setProperty('--safe-area-top', `${top}px`)
        cartRef.current.style.setProperty('--safe-area-bottom', `${bottom}px`)
        cartRef.current.style.setProperty('--safe-area-left', `${left}px`)
        cartRef.current.style.setProperty('--safe-area-right', `${right}px`)
      }
    }

    updateSafeAreaInsets()

    // Update on orientation change
    const handleOrientationChange = () => {
      setTimeout(updateSafeAreaInsets, 100)
    }

    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', updateSafeAreaInsets)

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', updateSafeAreaInsets)
    }
  }, [])

  // Dynamic viewport height for mobile browsers
  useEffect(() => {
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      setViewportHeight(window.innerHeight)
    }

    updateViewportHeight()

    const handleResize = () => {
      setTimeout(updateViewportHeight, 100)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  // Touch event handling for better mobile interactions
  useEffect(() => {
    if (!cartRef.current) return

    let startY = 0
    let startX = 0

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY
      startX = e.touches[0].clientX
    }

    const handleTouchMove = (e) => {
      if (!startY || !startX) return

      const currentY = e.touches[0].clientY
      const currentX = e.touches[0].clientX
      const diffY = startY - currentY
      const diffX = startX - currentX

      // Prevent vertical scrolling when swiping horizontally
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        e.preventDefault()
      }
    }

    const cartElement = cartRef.current
    cartElement.addEventListener('touchstart', handleTouchStart, { passive: true })
    cartElement.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      cartElement.removeEventListener('touchstart', handleTouchStart)
      cartElement.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isCartOpen])

  if (!isCartOpen) return null

  const handleCheckout = () => {
    if (!currentUser) {
      alert('Please login to checkout')
      return
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }

    setShowCheckout(true)
  }

  const handleOrderSuccess = (orderData) => {
    setOrderData(orderData)
    setShowCheckout(false)
    setShowOrderSuccess(true)
    toggleCart() // Close cart
    clearCart() // Clear cart after successful order
  }

  return (
    <div className="cart-overlay" onClick={toggleCart}>
      <div 
        className="cart-container" 
        onClick={e => e.stopPropagation()}
      >
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-cart-btn" onClick={toggleCart}>
            ✕
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <span className="empty-cart-emoji">🛒</span>
              <h3>Your cart is empty</h3>
              <p>Add some delicious items from our shops!</p>
              <Link to="/" className="continue-shopping-btn" onClick={toggleCart}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => <CartItem key={item.id} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />)}
              </div>

              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="total-items">
                    Total Items: {getTotalItems()}
                  </div>
                  <div className="total-price">
                    Total: ₹{getTotalPrice()}
                  </div>
                </div>
                
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Checkout 
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onOrderSuccess={handleOrderSuccess}
      />
      
      <OrderSuccess 
        isOpen={showOrderSuccess}
        onClose={() => setShowOrderSuccess(false)}
        orderData={orderData}
      />
    </div>
  )
}

// Simple Cart Item Component
function CartItem({ item, updateQuantity, removeFromCart }) {
  return (
    <div className="cart-item">
      <div className="item-info">
        <span className="item-emoji">{item.image}</span>
        <div className="item-details">
          <h4 className="item-name">{item.name}</h4>
          <p className="item-shop">from {item.shopName}</p>
          <p className="item-price">₹{item.price}</p>
        </div>
      </div>
      
      <div className="quantity-controls">
        <button 
          className="quantity-btn"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
        >
          -
        </button>
        <span className="quantity">{item.quantity}</span>
        <button 
          className="quantity-btn"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          +
        </button>
      </div>
      
      <button 
        className="remove-item-btn"
        onClick={() => removeFromCart(item.id)}
      >
        🗑️
      </button>
    </div>
  )
}

export default Cart