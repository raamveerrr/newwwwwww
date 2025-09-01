import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext()

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('foodStreetCart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        // Validate cart data structure
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart)
        } else {
          console.warn('Invalid cart data in localStorage, resetting cart')
          localStorage.removeItem('foodStreetCart')
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      localStorage.removeItem('foodStreetCart')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save cart to localStorage whenever cartItems changes (debounced)
  useEffect(() => {
    if (isLoading) return // Don't save while loading

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('foodStreetCart', JSON.stringify(cartItems))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }, 100) // Debounce saves

    return () => clearTimeout(timeoutId)
  }, [cartItems, isLoading])

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