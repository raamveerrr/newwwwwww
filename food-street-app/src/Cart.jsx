import React, { useState } from 'react'
import { useCart } from './CartContext'
import { useAuth } from './AuthContext'
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
    getTotalItems 
  } = useCart()
  
  const { currentUser } = useAuth()
  const [showCheckout, setShowCheckout] = useState(false)
  const [showOrderSuccess, setShowOrderSuccess] = useState(false)
  const [orderData, setOrderData] = useState(null)

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