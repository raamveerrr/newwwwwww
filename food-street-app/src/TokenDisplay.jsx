import React, { useState, useEffect } from 'react'
import './TokenDisplay.css'

function TokenDisplay({ orderData, onClose }) {
  const [showCopied, setShowCopied] = useState(false)
  const [estimatedTimes, setEstimatedTimes] = useState({})

  useEffect(() => {
    // Calculate estimated pickup times for each shop
    if (orderData?.items) {
      const shopTimes = {}
      const shopItems = {}
      
      // Group items by shop
      orderData.items.forEach(item => {
        if (!shopItems[item.shopId]) {
          shopItems[item.shopId] = {
            shopName: item.shopName,
            items: [],
            totalItems: 0
          }
        }
        shopItems[item.shopId].items.push(item)
        shopItems[item.shopId].totalItems += item.quantity
      })
      
      // Calculate preparation time for each shop
      Object.entries(shopItems).forEach(([shopId, shopData]) => {
        const baseTime = getShopBaseTime(shopId)
        const itemTime = shopData.totalItems * 2 // 2 minutes per item
        const totalTime = Math.min(baseTime + itemTime, 25) // Cap at 25 minutes
        
        shopTimes[shopId] = {
          shopName: shopData.shopName,
          estimatedMinutes: totalTime,
          readyTime: new Date(Date.now() + totalTime * 60000).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          itemCount: shopData.totalItems
        }
      })
      
      setEstimatedTimes(shopTimes)
    }
  }, [orderData])

  const getShopBaseTime = (shopId) => {
    const baseTimes = {
      'zuzu': 12,      // Pizza takes longer
      'oasis': 10,     // Healthy food prep time
      'bites': 8,      // Fast food, quicker prep
      'shakers': 5     // Beverages, fastest
    }
    return baseTimes[shopId] || 10
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

  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(orderData.tokenNumber)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
    
    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Food Street Order',
        text: `My order token: ${orderData.tokenNumber}. Total: ₹${orderData.totalAmount}`,
        url: window.location.origin
      })
    } else {
      copyTokenToClipboard()
    }
  }

  if (!orderData) return null

  return (
    <div className="token-overlay">
      <div className="token-container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">🎫</div>
          <h2>Order Token</h2>
          <p>Your order details and pickup information</p>
        </div>

        {/* Token Display */}
        <div className="token-display">
          <div className="token-label">Your Token Number</div>
          <div className="token-number" onClick={copyTokenToClipboard}>
            {orderData.tokenNumber}
            {showCopied && <span className="copied-indicator">Copied!</span>}
          </div>
          <div className="token-hint">Tap to copy • Show this to shopkeepers</div>
        </div>

        {/* Order Summary */}
        <div className="order-summary-token">
          <h3>Order Details</h3>
          <div className="summary-row">
            <span>Order ID:</span>
            <span>{orderData.firestoreOrderId?.slice(-8) || 'N/A'}</span>
          </div>
          <div className="summary-row">
            <span>Total Amount:</span>
            <span>₹{orderData.totalAmount}</span>
          </div>
          <div className="summary-row">
            <span>Order Status:</span>
            <span className={`status-${orderData.orderStatus || 'confirmed'}`}>
              {getStatusIcon(orderData.orderStatus || 'confirmed')} {(orderData.orderStatus || 'confirmed').toUpperCase()}
            </span>
          </div>
          <div className="summary-row">
            <span>Customer:</span>
            <span>{orderData.customerInfo.name}</span>
          </div>
        </div>

        {/* Pickup Locations & Times */}
        <div className="pickup-info">
          <h3>📍 Pickup Locations & Times</h3>
          {Object.entries(estimatedTimes).map(([shopId, shopInfo]) => (
            <div key={shopId} className="pickup-location">
              <div className="location-header">
                <span className="shop-name">{shopInfo.shopName}</span>
                <span className="item-count">{shopInfo.itemCount} items</span>
              </div>
              <div className="timing-info">
                <span className="estimated-time">⏱️ Ready in ~{shopInfo.estimatedMinutes} minutes</span>
                <span className="ready-time">🕒 Around {shopInfo.readyTime}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="pickup-instructions">
          <h3>📋 Pickup Instructions</h3>
          <div className="instruction-list">
            <div className="instruction-item">
              <span className="step-number">1</span>
              <div className="step-content">
                <strong>Wait for Ready Notification</strong>
                <p>You'll receive a notification when your order is ready</p>
              </div>
            </div>
            
            <div className="instruction-item">
              <span className="step-number">2</span>
              <div className="step-content">
                <strong>Visit the Shop(s)</strong>
                <p>Go to the respective vendor stalls mentioned above</p>
              </div>
            </div>
            
            <div className="instruction-item">
              <span className="step-number">3</span>
              <div className="step-content">
                <strong>Show Your Token</strong>
                <p>Present token <strong>{orderData.tokenNumber}</strong> to the shopkeeper</p>
              </div>
            </div>
            
            <div className="instruction-item">
              <span className="step-number">4</span>
              <div className="step-content">
                <strong>Verify Identity</strong>
                <p>Show your student ID for verification</p>
              </div>
            </div>
            
            <div className="instruction-item">
              <span className="step-number">5</span>
              <div className="step-content">
                <strong>Collect Your Food</strong>
                <p>Enjoy your delicious meal! 🍽️</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="important-notes">
          <h4>⚠️ Important Notes</h4>
          <ul>
            <li>🎫 <strong>Keep your token safe</strong> - you'll need it for pickup</li>
            <li>⏰ <strong>Pickup within 45 minutes</strong> of order ready notification</li>
            <li>🆔 <strong>Student ID required</strong> for order verification</li>
            <li>📞 <strong>Contact +91-8306461994</strong> for any issues</li>
            <li>🖨️ <strong>Receipt printed at shop</strong> - no need to show payment proof</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="token-actions">
          <button className="copy-token-btn" onClick={copyTokenToClipboard}>
            📋 Copy Token
          </button>
          <button className="share-btn" onClick={shareOrder}>
            📤 Share Order
          </button>
          <button className="done-btn" onClick={onClose}>
            ✅ Got It!
          </button>
        </div>

        {/* Contact Support */}
        <div className="support-contact">
          <p>Need help? Contact support: <strong>+91-8306461994</strong></p>
        </div>
      </div>
    </div>
  )
}

export default TokenDisplay