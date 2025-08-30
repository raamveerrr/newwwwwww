import React from 'react'
import { Link } from 'react-router-dom'
import './OrderSuccess.css'

function OrderSuccess({ isOpen, onClose, orderData }) {
  if (!isOpen || !orderData) return null

  const estimatedTime = () => {
    const maxTime = Math.max(...orderData.items.map(item => {
      // Different shops have different preparation times
      const shopTimes = {
        'zuzu': 20,
        'oasis': 15,
        'bites': 10,
        'shakers': 8
      }
      return shopTimes[item.shopId] || 15
    }))
    return maxTime
  }

  const printReceipt = () => {
    const printWindow = window.open('', '_blank')
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Receipt - ${orderData.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
          .order-info { margin: 20px 0; }
          .items { margin: 20px 0; }
          .item { display: flex; justify-content: space-between; margin: 5px 0; }
          .total { border-top: 2px solid #000; padding-top: 10px; font-weight: bold; }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Food Street</h2>
          <p>College Food Court</p>
        </div>
        <div class="order-info">
          <p><strong>Order #:</strong> ${orderData.orderNumber}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Customer:</strong> ${orderData.customerInfo.name}</p>
          <p><strong>Phone:</strong> ${orderData.customerInfo.phone}</p>
          <p><strong>Payment ID:</strong> ${orderData.paymentId}</p>
        </div>
        <div class="items">
          <h3>Items Ordered:</h3>
          ${orderData.items.map(item => `
            <div class="item">
              <span>${item.name} (${item.shopName}) x${item.quantity}</span>
              <span>₹${item.price * item.quantity}</span>
            </div>
          `).join('')}
        </div>
        <div class="total">
          <div class="item">
            <span>Total Amount:</span>
            <span>₹${orderData.totalAmount}</span>
          </div>
        </div>
        <div class="footer">
          <p>Thank you for your order!</p>
          <p>Estimated preparation time: ${estimatedTime()} minutes</p>
          <p>Please show this receipt when collecting your order</p>
        </div>
      </body>
      </html>
    `
    printWindow.document.write(receiptHTML)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="order-success-overlay" onClick={onClose}>
      <div className="order-success-container" onClick={e => e.stopPropagation()}>
        <div className="success-animation">
          <div className="success-checkmark">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
        </div>

        <div className="success-content">
          <h2>Order Placed Successfully! 🎉</h2>
          <p className="success-message">
            Thank you for your order! Your payment has been processed successfully.
          </p>

          <div className="order-details">
            <div className="token-highlight">
              <div className="token-label">Your Pickup Token</div>
              <div className="token-number">{orderData.tokenNumber || orderData.orderNumber}</div>
              <div className="token-instruction">Show this to the shopkeeper</div>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Order Number:</span>
              <span className="detail-value">{orderData.orderNumber}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value">₹{orderData.totalAmount}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Payment ID:</span>
              <span className="detail-value">{orderData.paymentId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Estimated Time:</span>
              <span className="detail-value">{estimatedTime()} minutes</span>
            </div>
          </div>

          <div className="order-summary">
            <h3>Items Ordered:</h3>
            {orderData.items.map(item => (
              <div key={item.id} className="ordered-item">
                <span className="item-emoji">{item.image}</span>
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-shop">from {item.shopName}</div>
                </div>
                <div className="item-quantity">×{item.quantity}</div>
                <div className="item-price">₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button className="print-receipt-btn" onClick={printReceipt}>
              🖨️ Print Receipt
            </button>
            <Link to="/" className="continue-shopping-btn" onClick={onClose}>
              Continue Shopping
            </Link>
          </div>

          <div className="next-steps">
            <h4>What's Next?</h4>
            <ul>
              <li>🔔 Receipts are being automatically printed at the shops</li>
              <li>👨‍🍳 Your order is being prepared by the shops</li>
              <li>⏰ Estimated time: {estimatedTime()} minutes</li>
              <li>🎫 Show your token number: <strong>{orderData.tokenNumber || orderData.orderNumber}</strong></li>
              <li>🏃‍♂️ Visit the respective shops to collect your order</li>
            </ul>
          </div>
        </div>

        <button className="close-success-btn" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  )
}

export default OrderSuccess