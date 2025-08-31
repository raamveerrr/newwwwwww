import React, { createContext, useContext, useState, useEffect } from 'react'

const TokenContext = createContext()

export function useToken() {
  const context = useContext(TokenContext)
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider')
  }
  return context
}

export function TokenProvider({ children }) {
  const [latestOrder, setLatestOrder] = useState(null)
  const [shopTokens, setShopTokens] = useState({})
  const [showTokenDialog, setShowTokenDialog] = useState(false)

  // Load latest order from localStorage on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem('foodstreet_latest_order')
    if (savedOrder) {
      try {
        const orderData = JSON.parse(savedOrder)
        // Only keep recent orders (within last 24 hours)
        const orderTime = new Date(orderData.timestamp)
        const now = new Date()
        const hoursDiff = (now - orderTime) / (1000 * 60 * 60)
        
        if (hoursDiff < 24) {
          setLatestOrder(orderData)
        } else {
          localStorage.removeItem('foodstreet_latest_order')
        }
      } catch (error) {
        console.error('Error loading saved order:', error)
        localStorage.removeItem('foodstreet_latest_order')
      }
    }
  }, [])

  const setNewOrder = (orderData) => {
    const orderWithTimestamp = {
      ...orderData,
      timestamp: new Date().toISOString()
    }
    setLatestOrder(orderWithTimestamp)
    localStorage.setItem('foodstreet_latest_order', JSON.stringify(orderWithTimestamp))
  }

  const clearOrder = () => {
    setLatestOrder(null)
    localStorage.removeItem('foodstreet_latest_order')
  }

  const openTokenDialog = () => {
    setShowTokenDialog(true)
  }

  const closeTokenDialog = () => {
    setShowTokenDialog(false)
  }

  const hasActiveOrder = latestOrder !== null

  // Shop-specific token functions
  const getShopToken = (shopId) => {
    return shopTokens[shopId] || null
  }

  const setShopToken = (shopId, tokenData) => {
    const tokenWithTimestamp = {
      ...tokenData,
      timestamp: new Date().toISOString(),
      shopId
    }
    setShopTokens(prev => ({
      ...prev,
      [shopId]: tokenWithTimestamp
    }))
    // Save to localStorage
    const allTokens = { ...shopTokens, [shopId]: tokenWithTimestamp }
    localStorage.setItem('foodstreet_shop_tokens', JSON.stringify(allTokens))
  }

  const clearShopToken = (shopId) => {
    setShopTokens(prev => {
      const newTokens = { ...prev }
      delete newTokens[shopId]
      localStorage.setItem('foodstreet_shop_tokens', JSON.stringify(newTokens))
      return newTokens
    })
  }

  const hasShopToken = (shopId) => {
    return shopTokens[shopId] !== undefined
  }

  const value = {
    latestOrder,
    setNewOrder,
    clearOrder,
    showTokenDialog,
    openTokenDialog,
    closeTokenDialog,
    hasActiveOrder,
    shopTokens,
    getShopToken,
    setShopToken,
    clearShopToken,
    hasShopToken
  }

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  )
}