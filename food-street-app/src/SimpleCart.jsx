import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSimpleCart } from './SimpleCartContext'
import './SimpleCart.css'

const SimpleCart = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getTotalPrice 
  } = useSimpleCart()
  
  const navigate = useNavigate()

  const formatPrice = (price) => {
    return `₹${price}`
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleProceedToPayment = () => {
    if (items.length > 0) {
      navigate('/payment')
    }
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart()
    }
  }

  if (items.length === 0) {
    return (
      <div className="simple-cart empty-cart">
        <header className="cart-header">
          <Link to="/menu" className="back-btn">
            ← Back to Menu
          </Link>
          <h1 className="cart-title">Your Cart</h1>
          <div></div>
        </header>

        <div className="empty-cart-content">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious items from our menu!</p>
          <Link to="/menu" className="browse-menu-btn">
            Browse Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="simple-cart">
      {/* Header */}
      <header className="cart-header">
        <Link to="/menu" className="back-btn">
          ← Back to Menu
        </Link>
        <h1 className="cart-title">Your Cart</h1>
        <button className="clear-cart-btn" onClick={handleClearCart}>
          🗑️
        </button>
      </header>

      {/* Cart Items */}
      <main className="cart-content">
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <span className="food-emoji">{item.image}</span>
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">{formatPrice(item.price)} each</p>
              </div>

              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <div className="item-total">
                <span className="total-price">
                  {formatPrice(item.price * item.quantity)}
                </span>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal ({getTotalItems()} items)</span>
            <span>{formatPrice(getTotalPrice())}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span className="free">Free</span>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>{formatPrice(getTotalPrice())}</span>
          </div>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="cart-footer">
        <div className="footer-content">
          <div className="total-info">
            <span className="total-items">{getTotalItems()} items</span>
            <span className="total-amount">{formatPrice(getTotalPrice())}</span>
          </div>
          <button 
            className="proceed-btn"
            onClick={handleProceedToPayment}
          >
            Proceed to Payment
          </button>
        </div>
      </footer>
    </div>
  )
}

export default SimpleCart