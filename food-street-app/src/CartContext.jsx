import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('foodStreetCart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('foodStreetCart', JSON.stringify(cartItems))
  }, [cartItems])

  // Add item to cart
  function addToCart(item, shopInfo) {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id)
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        // Add new item to cart
        return [...prevItems, {
          ...item,
          quantity: 1,
          shopId: shopInfo.id,
          shopName: shopInfo.name
        }]
      }
    })
  }

  // Remove item from cart
  function removeFromCart(itemId) {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }

  // Update item quantity
  function updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  // Clear entire cart
  function clearCart() {
    console.log('🗑️ Clearing cart...')
    setCartItems([])
    // Also clear from localStorage immediately
    localStorage.removeItem('foodStreetCart')
  }

  // Calculate total price
  function getTotalPrice() {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // Calculate total items count
  function getTotalItems() {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  // Toggle cart visibility
  function toggleCart() {
    setIsCartOpen(prev => !prev)
  }

  const value = {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    toggleCart,
    setIsCartOpen
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}