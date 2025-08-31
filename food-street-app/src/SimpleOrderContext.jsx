import React, { createContext, useContext, useState } from 'react'

const OrderContext = createContext()

export const SimpleOrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null)
  const [orderHistory, setOrderHistory] = useState([])

  const createOrder = (items, totalAmount) => {
    const order = {
      id: generateOrderId(),
      token: generateOrderToken(),
      items,
      totalAmount,
      timestamp: new Date().toISOString(),
      status: 'pending'
    }
    
    setCurrentOrder(order)
    setOrderHistory(prev => [order, ...prev])
    return order
  }

  const completeOrder = () => {
    if (currentOrder) {
      const completedOrder = { ...currentOrder, status: 'completed' }
      setCurrentOrder(completedOrder)
      setOrderHistory(prev => 
        prev.map(order => 
          order.id === completedOrder.id ? completedOrder : order
        )
      )
      return completedOrder
    }
    return null
  }

  const clearCurrentOrder = () => {
    setCurrentOrder(null)
  }

  const generateOrderId = () => {
    return 'ORD-' + Date.now().toString().slice(-6)
  }

  const generateOrderToken = () => {
    const prefix = 'TKN-'
    const suffix = Math.random().toString(36).substr(2, 6).toUpperCase()
    return prefix + suffix
  }

  const value = {
    currentOrder,
    orderHistory,
    createOrder,
    completeOrder,
    clearCurrentOrder
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}

export const useSimpleOrder = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useSimpleOrder must be used within a SimpleOrderProvider')
  }
  return context
}