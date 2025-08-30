import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { db } from './firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import Navigation from './Navigation'
import './Orders.css'

function Orders() {
  const { currentUser } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (currentUser) {
      fetchOrders()
    }
  }, [currentUser])

  const fetchOrders = async () => {
    try {
      setLoading(true)
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
          ...doc.data()
        })
      })
      
      setOrders(ordersList)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
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

  if (!currentUser) {
    return (
      <>
        <Navigation />
        <div className="orders-container">
          <div className="no-auth">
            <h2>Please login to view your orders</h2>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track your food orders and order history</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <h3>Error loading orders</h3>
            <p>{error}</p>
            <button onClick={fetchOrders} className="retry-btn">
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <span className="empty-icon">🍽️</span>
            <h3>No orders yet</h3>
            <p>Start ordering from your favorite food shops!</p>
            <a href="/" className="start-ordering-btn">
              Start Ordering
            </a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber || order.id.substring(0, 8)}</h3>
                    <p className="order-date">
                      {order.createdAt?.toDate ? 
                        order.createdAt.toDate().toLocaleDateString() + ' ' + 
                        order.createdAt.toDate().toLocaleTimeString() :
                        'Date not available'
                      }
                    </p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                    >
                      {getStatusIcon(order.orderStatus)} {order.orderStatus || 'confirmed'}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items?.map(item => (
                    <div key={item.id} className="order-item">
                      <span className="item-emoji">{item.image}</span>
                      <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        <span className="item-shop">from {item.shopName}</span>
                      </div>
                      <span className="item-quantity">×{item.quantity}</span>
                      <span className="item-price">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ₹{order.totalAmount}</strong>
                  </div>
                  <div className="order-actions">
                    {order.paymentId && (
                      <span className="payment-id">
                        Payment ID: {order.paymentId.substring(0, 15)}...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Orders