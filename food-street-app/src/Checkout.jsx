import React, { useState } from 'react'
import { useCart } from './CartContext'
import { useAuth } from './AuthContext'
import { razorpayConfig, getRazorpayKey, verifyPayment } from './razorpayConfig'
import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import './Checkout.css'

function Checkout({ isOpen, onClose, onOrderSuccess }) {
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const { currentUser } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    address: ''
  })

  if (!isOpen) return null

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    })
  }

  const createOrderInFirestore = async (orderData) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      // Trigger automatic receipt printing for each shop
      await triggerAutomaticReceipts(orderData)
      
      return docRef.id
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  const generateTokenNumber = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    return `FS${timestamp}${random}`
  }

  const triggerAutomaticReceipts = async (orderData) => {
    try {
      // Group items by shop for separate receipts
      const shopOrders = {}
      orderData.items.forEach(item => {
        if (!shopOrders[item.shopId]) {
          shopOrders[item.shopId] = {
            shopName: item.shopName,
            items: [],
            shopTotal: 0
          }
        }
        shopOrders[item.shopId].items.push(item)
        shopOrders[item.shopId].shopTotal += item.price * item.quantity
      })

      // Send receipt to each shop's printer
      for (const [shopId, shopOrder] of Object.entries(shopOrders)) {
        await sendReceiptToPrinter({
          ...orderData,
          shopId,
          shopName: shopOrder.shopName,
          items: shopOrder.items,
          shopTotal: shopOrder.shopTotal
        })
      }
    } catch (error) {
      console.error('Error sending receipts to printers:', error)
    }
  }

  const sendReceiptToPrinter = async (orderData) => {
    try {
      // In production, this would call your backend API to trigger printer
      // For now, we'll simulate the receipt printing
      console.log(`🖨️ Auto-printing receipt for ${orderData.shopName}:`, orderData)
      
      // You would implement this API call:
      // await fetch('/api/print-receipt', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // })
      
      // For demo, show alert
      setTimeout(() => {
        alert(`🖨️ Receipt auto-printed at ${orderData.shopName}!\nToken: ${orderData.tokenNumber}\nItems: ${orderData.items.length}\nTotal: ₹${orderData.shopTotal}`)
      }, 2000)
    } catch (error) {
      console.error('Error printing receipt:', error)
    }
  }

  const handlePayment = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Please fill in all required fields')
      return
    }

    setIsProcessing(true)

    try {
      // Load Razorpay script dynamically
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const options = {
          key: getRazorpayKey(),
          amount: getTotalPrice() * 100, // Amount in paise
          currency: razorpayConfig.currency,
          name: razorpayConfig.name,
          description: `Order for ${cartItems.length} items`,
          image: razorpayConfig.image,
          handler: async function (response) {
            try {
              // Verify payment (in production, do this on backend)
              const verification = await verifyPayment(response)
              
              if (verification.success) {
                // Generate unique token number
                const tokenNumber = generateTokenNumber()
                
                // Create order in Firestore
                const orderData = {
                  userId: currentUser.uid,
                  customerInfo,
                  items: cartItems,
                  totalAmount: getTotalPrice(),
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                  tokenNumber: tokenNumber,
                  status: 'paid',
                  orderStatus: 'confirmed',
                  orderType: 'pickup'
                }

                const firestoreOrderId = await createOrderInFirestore(orderData)
                
                // Clear cart and show success
                clearCart()
                onOrderSuccess({
                  ...orderData,
                  firestoreOrderId,
                  orderNumber: `FS${Date.now()}`
                })
                onClose()
              } else {
                alert('Payment verification failed. Please contact support.')
              }
            } catch (error) {
              console.error('Payment verification error:', error)
              alert('Payment verification failed. Please contact support.')
            } finally {
              setIsProcessing(false)
            }
          },
          prefill: {
            name: customerInfo.name,
            email: customerInfo.email,
            contact: customerInfo.phone
          },
          notes: {
            address: customerInfo.address,
            orderType: 'food_preorder'
          },
          theme: razorpayConfig.theme,
          modal: {
            ondismiss: function() {
              setIsProcessing(false)
            }
          }
        }

        const rzp1 = new window.Razorpay(options)
        rzp1.open()
      }
      
      script.onerror = () => {
        setIsProcessing(false)
        alert('Failed to load payment gateway. Please try again.')
      }
      
      document.body.appendChild(script)
    } catch (error) {
      setIsProcessing(false)
      console.error('Payment initiation error:', error)
      alert('Failed to initiate payment. Please try again.')
    }
  }

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-container" onClick={e => e.stopPropagation()}>
        <div className="checkout-header">
          <h2>Checkout</h2>
          <button className="close-checkout-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <span className="item-emoji">{item.image}</span>
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-shop">from {item.shopName}</div>
                  </div>
                  <div className="item-quantity">×{item.quantity}</div>
                  <div className="item-total">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Total: ₹{getTotalPrice()}</strong>
            </div>
          </div>

          {/* Customer Information */}
          <div className="customer-info">
            <h3>Pickup Information</h3>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="pickup-note">
              <div className="note-header">
                <span className="note-icon">ℹ️</span>
                <strong>Pickup Instructions</strong>
              </div>
              <ul>
                <li>📱 You'll receive a <strong>Token Number</strong> after payment</li>
                <li>🏃‍♂️ Visit the respective shop(s) to collect your order</li>
                <li>🎫 Show your token number to the shopkeeper</li>
                <li>⏰ Estimated preparation time will be provided</li>
              </ul>
            </div>
          </div>

          {/* Payment Button */}
          <div className="payment-section">
            <button 
              className="pay-now-btn"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="loading-spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  Pay ₹{getTotalPrice()} with Razorpay
                  <span className="payment-icon">💳</span>
                </>
              )}
            </button>
            <p className="payment-note">
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout