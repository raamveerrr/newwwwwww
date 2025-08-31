import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { db } from './firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import TokenDisplay from './TokenDisplay'
import './OrderHistory.css'

function OrderHistory({ isOpen, onClose }) {
  const { currentUser } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showTokenDialog, setShowTokenDialog] = useState(false)

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchOrders()
    }
  }, [isOpen, currentUser])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const ordersRef = collection(db, 'orders')
      const q = query(
        ordersRef, 
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const ordersList = []
      
      querySnapshot.forEach((doc) => {
        ordersList.push({
          id: doc.id,
          firestoreOrderId: doc.id,
          ...doc.data()
        })
      })
      
      setOrders(ordersList)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to load orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOrderClick = (order) => {
    setSelectedOrder(order)
    setShowTokenDialog(true)
  }

  const closeTokenDialog = () => {
    setShowTokenDialog(false)
    setSelectedOrder(null)
  }

  const getStatusIcon = (status) => {
    const icons = {
      'confirmed': '✅',
      'preparing': '👨‍🍳',
      'ready': '🔔',
      'completed': '🎉',
      'cancelled': '❌'
    }
    return icons[status] || '📋'
  }

  const getStatusColor = (status) => {
    const colors = {
      'confirmed': '#48bb78',
      'preparing': '#ed8936',
      'ready': '#667eea',
      'completed': '#38a169',
      'cancelled': '#e53e3e'
    }
    return colors[status] || '#4a5568'
  }

  const formatOrderDate = (timestamp) => {
    if (!timestamp) return 'Date not available'
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      const now = new Date()
      const diffTime = now - date
      const diffHours = diffTime / (1000 * 60 * 60)
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      
      if (diffHours < 1) {
        const minutes = Math.floor(diffTime / (1000 * 60))
        return `${minutes} minutes ago`
      } else if (diffHours < 24) {
        return `${Math.floor(diffHours)} hours ago`
      } else if (diffDays < 7) {
        return `${Math.floor(diffDays)} days ago`
      } else {
        return date.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      }
    } catch (error) {
      return 'Date not available'
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="order-history-overlay" onClick={onClose}>
        <div className="order-history-container" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="order-history-header">
            <h2>🎫 Your Order Tokens</h2>
            <button className="close-history-btn" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="order-history-content">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading your orders...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <span className="error-icon">⚠️</span>
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button onClick={fetchOrders} className="retry-btn">
                  Try Again
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="empty-orders">
                <span className="empty-icon">🍽️</span>
                <h3>No orders yet</h3>
                <p>Your order tokens will appear here after you make purchases!</p>
                <button onClick={onClose} className="start-ordering-btn">
                  Start Ordering
                </button>
              </div>
            ) : (
              <>
                <div className="orders-instruction">
                  <p>📱 Tap any order to view its token and pickup details</p>
                </div>
                
                <div className="orders-list">
                  {orders.map(order => (
                    <div 
                      key={order.id} 
                      className="order-history-card"
                      onClick={() => handleOrderClick(order)}
                    >
                      <div className="order-card-header">
                        <div className="order-basic-info">
                          <div className="order-token-number">
                            🎫 {order.tokenNumber}
                          </div>
                          <div className="order-time">
                            {formatOrderDate(order.createdAt)}
                          </div>
                        </div>
                        <div className="order-status-badge">
                          <span 
                            className="status-indicator"
                            style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                          >
                            {getStatusIcon(order.orderStatus)}
                          </span>
                        </div>
                      </div>

                      <div className="order-card-body">
                        <div className="order-items-preview">
                          {order.items?.slice(0, 3).map((item, index) => (
                            <span key={index} className="item-emoji-preview">
                              {item.image}
                            </span>
                          ))}
                          {order.items?.length > 3 && (
                            <span className="more-items">+{order.items.length - 3}</span>
                          )}
                        </div>
                        
                        <div className="order-shops-preview">
                          {Array.from(new Set(order.items?.map(item => item.shopName) || [])).map((shopName, index) => (
                            <span key={index} className="shop-tag">
                              {shopName}
                            </span>
                          ))}
                        </div>

                        <div className="order-total-amount">
                          ₹{order.totalAmount}
                        </div>
                      </div>

                      <div className="order-card-footer">
                        <span className="tap-hint">👆 Tap to view token details</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Help Text */}
          <div className="order-history-help">
            <p>💡 <strong>Tip:</strong> Show your token number to shopkeepers for order pickup</p>
          </div>
        </div>
      </div>

      {/* Token Dialog */}
      {showTokenDialog && selectedOrder && (
        <TokenDisplay 
          orderData={selectedOrder} 
          onClose={closeTokenDialog} 
        />
      )}
    </>
  )
}

export default OrderHistory