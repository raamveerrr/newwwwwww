import React, { useState } from 'react'
import { useCart } from './CartContext'
import { useAuth } from './AuthContext'
import { useTokenContext } from './TokenContext'
import { razorpayConfig, getRazorpayKey, verifyPayment, isDevelopmentMode, mockPayment } from './razorpayConfig'
import { printerService } from './PrinterService'
import PaymentSuccess from './PaymentSuccess'
import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import './Checkout.css'

function Checkout({ isOpen, onClose, onOrderSuccess }) {
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const { currentUser } = useAuth()
  const { setNewOrder, addShopToken } = useTokenContext()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    address: ''
  })

  if (!isOpen) return null

  const handlePaymentSuccessClose = () => {
    setShowPaymentSuccess(false)
    setCompletedOrder(null)
    onClose()
  }

  // Show payment success if order completed
  if (showPaymentSuccess && completedOrder) {
    return <PaymentSuccess orderData={completedOrder} isOpen={showPaymentSuccess} onClose={handlePaymentSuccessClose} />
  }

  // Remove token-related code from cart after payment success
  // Instead, add token to TokenContext for the specific shop

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    })
  }

  const createOrderInFirestore = async (orderData) => {
    try {
      // Validate and clean order data before saving
      const cleanOrderData = {
        ...orderData,
        // Ensure all required fields are present
        userId: orderData.userId || currentUser?.uid,
        paymentId: orderData.paymentId || 'mock_payment_id',
        orderId: orderData.orderId || `order_${Date.now()}`,
        signature: orderData.signature || 'mock_signature',
        status: orderData.status || 'paid',
        orderStatus: orderData.orderStatus || 'confirmed',
        orderType: orderData.orderType || 'pickup'
      }
      
      console.log('💾 Saving order to Firestore:', cleanOrderData)
      
      const docRef = await addDoc(collection(db, 'orders'), {
        ...cleanOrderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      console.log('✅ Order saved successfully with ID:', docRef.id)
      
      // Option to completely disable printer integration if it causes issues
      const isProduction = window.location.hostname.includes('netlify.app') || 
                          window.location.hostname.includes('digitalfoodstreet')
      const ENABLE_PRINTER_INTEGRATION = !isProduction // Disable in production for now
      
      if (ENABLE_PRINTER_INTEGRATION) {
        // Trigger automatic receipt printing for each shop (non-blocking)
        // Don't await this - let it run in background to avoid interfering with payment flow
        triggerAutomaticReceipts(cleanOrderData).catch(error => {
          console.warn('⚠️ Background receipt printing failed:', error)
          // Don't throw - payment was successful, printing is optional
        })
      } else {
        console.log('🖨️ Printer integration disabled in production mode')
      }
      
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
    // Wrap in timeout to ensure this never blocks payment processing
    const printingPromise = new Promise(async (resolve) => {
      try {
        console.log('🖨️ Starting automatic receipt printing process...')
        
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

        // Send receipt to each shop's printer automatically (with individual timeouts)
        const printResults = []
        const printPromises = Object.entries(shopOrders).map(async ([shopId, shopOrder]) => {
          try {
            const shopOrderData = {
              ...orderData,
              shopId,
              shopName: shopOrder.shopName,
              items: shopOrder.items,
              shopTotal: shopOrder.shopTotal
            }
            
            // Individual timeout for each print job (3 seconds max)
            const printResult = await Promise.race([
              printerService.sendToPrinter(shopId, shopOrderData),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Print timeout')), 3000)
              )
            ])
            
            printResults.push({ shopId, shopName: shopOrder.shopName, ...printResult })
            
            if (printResult.success) {
              console.log(`✅ Print successful for ${shopOrder.shopName}`)
            } else {
              console.warn(`⚠️ Print failed for ${shopOrder.shopName}:`, printResult.error)
            }
          } catch (error) {
            console.warn(`⚠️ Print failed for ${shopOrder.shopName}:`, error.message)
            printResults.push({ shopId, shopName: shopOrder.shopName, success: false, error: error.message })
          }
        })
        
        // Wait for all print jobs with overall timeout
        await Promise.allSettled(printPromises)
        
        // Show user notification about receipt printing (non-blocking)
        const successfulPrints = printResults.filter(r => r.success)
        const failedPrints = printResults.filter(r => !r.success)
        
        if (successfulPrints.length > 0) {
          const shopNames = successfulPrints.map(p => p.shopName).join(', ')
          const isDev = successfulPrints.some(p => p.isDevelopment)
          
          setTimeout(() => {
            alert(`✅ Receipt ${isDev ? 'simulated' : 'printed'} at: ${shopNames}\n\n🎫 Your Token: ${orderData.tokenNumber}\n\n📍 Please visit the shop(s) to collect your order!`)
          }, 1500)
        }
        
        if (failedPrints.length > 0) {
          const failedShops = failedPrints.map(p => p.shopName).join(', ')
          console.warn(`⚠️ Print failed for: ${failedShops} - shop owners will be notified`)
        }
        
        resolve(printResults)
      } catch (error) {
        console.error('Error in automatic receipt printing:', error)
        resolve([]) // Always resolve, never reject
      }
    })
    
    // Overall timeout for entire printing process (10 seconds max)
    return Promise.race([
      printingPromise,
      new Promise(resolve => 
        setTimeout(() => {
          console.warn('⚠️ Receipt printing timed out - continuing with payment success')
          resolve([])
        }, 10000)
      )
    ])
  }



  const handlePayment = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Please fill in all required fields')
      return
    }

    setIsProcessing(true)

    // Force production mode on Netlify regardless of Razorpay keys
    const isNetlifyProduction = window.location.hostname.includes('netlify.app') || 
                               window.location.hostname.includes('digitalfoodstreet')
    
    // Check if we should use mock payment (development mode)
    // TEMPORARILY DISABLED: Force real Razorpay for testing
    const FORCE_REAL_RAZORPAY = true // Set to false to use mock payments

    if (isDevelopmentMode() && !isNetlifyProduction && !FORCE_REAL_RAZORPAY) {
      console.log('🧪 Development mode detected - using mock payment')
      
      try {
        await mockPayment(
          getTotalPrice(),
          async (response) => {
            try {
              console.log('📝 Mock payment response received')
              
              // Validate response
              if (!response || !response.razorpay_payment_id) {
                throw new Error('Invalid payment response')
              }
              
              // Handle successful mock payment
              const verification = await verifyPayment(response)
              
              if (verification.success) {
                const tokenNumber = generateTokenNumber()
                
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
                  orderType: 'pickup',
                  mockPayment: true // Flag for development
                }

                console.log('📝 Creating order...')
                const firestoreOrderId = await createOrderInFirestore(orderData)
                
                const completedOrderData = {
                  ...orderData,
                  firestoreOrderId,
                  orderNumber: `FS${Date.now()}`
                }
                
                // Add tokens to each shop that has items in the order
                const shopTokens = {}
                completedOrderData.items.forEach(item => {
                  if (!shopTokens[item.shopId]) {
                    shopTokens[item.shopId] = {
                      shopName: item.shopName,
                      shopId: item.shopId,
                      items: [],
                      totalAmount: 0
                    }
                  }
                  shopTokens[item.shopId].items.push(item)
                  shopTokens[item.shopId].totalAmount += item.price * item.quantity
                })

                // Add token to each shop
                Object.values(shopTokens).forEach(shopData => {
                  const shopTokenData = {
                    tokenNumber: completedOrderData.tokenNumber,
                    shopName: shopData.shopName,
                    shopId: shopData.shopId,
                    items: shopData.items,
                    totalAmount: shopData.totalAmount,
                    orderStatus: 'confirmed',
                    customerInfo: completedOrderData.customerInfo,
                    firestoreOrderId: completedOrderData.firestoreOrderId,
                    timestamp: new Date().toISOString()
                  }
                  addShopToken(shopData.shopId, shopTokenData)
                })

                setCompletedOrder(completedOrderData)
                clearCart() // Clear cart immediately after successful payment
                onOrderSuccess(completedOrderData)

                // Show payment success dialog
                setShowPaymentSuccess(true)
              } else {
                throw new Error('Payment verification failed')
              }
            } catch (paymentError) {
              console.error('Payment processing error:', paymentError)
              const errorMessage = paymentError.message || 'Unknown payment error'
              alert(`Payment failed: ${errorMessage}`)
            }
          },
          (error) => {
            console.error('Mock payment error:', error)
            alert('Payment failed. Please try again.')
          }
        )
      } catch (error) {
        console.error('Mock payment error:', error)
        alert('Payment failed. Please try again.')
      } finally {
        setIsProcessing(false)
      }
      return
    }

    // Production payment flow or when mock payments are disabled
    if (isNetlifyProduction) {
      console.log('🖨️ Production environment detected - using Razorpay')
    }

    try {
      // Load Razorpay script dynamically
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        let razorpayKey = getRazorpayKey()

        // Debug logging
        console.log('🔑 Razorpay Key:', razorpayKey ? razorpayKey.substring(0, 10) + '...' : 'NOT SET')
        console.log('🌐 Environment:', import.meta.env.MODE)
        console.log('🏠 Hostname:', window.location.hostname)

        // More robust key validation - check if it's a real Razorpay key
        const isValidRazorpayKey = razorpayKey &&
                                  razorpayKey.startsWith('rzp_') &&
                                  razorpayKey !== 'rzp_test_1234567890' &&
                                  razorpayKey.length > 20

        if (!isValidRazorpayKey) {
          console.error('⚠️ Razorpay key validation failed')
          console.error('Key details:', {
            exists: !!razorpayKey,
            startsWithRzp: razorpayKey?.startsWith('rzp_'),
            isTestKey: razorpayKey === 'rzp_test_1234567890',
            length: razorpayKey?.length
          })

          // Try fallback test key for development
          const fallbackKey = 'rzp_test_your_test_key_here' // Replace with actual test key
          if (fallbackKey !== 'rzp_test_your_test_key_here') {
            console.log('🔄 Using fallback test key')
            razorpayKey = fallbackKey
          } else {
            alert(`⚠️ Razorpay configuration error. Please check your API keys.\n\nDebug Info:\n- Key: ${razorpayKey ? 'Set' : 'NOT SET'}\n- Environment: ${import.meta.env.MODE}`)
            setIsProcessing(false)
            return
          }
        }

        let options
        try {
          options = {
            key: razorpayKey,
            amount: getTotalPrice() * 100, // Amount in paise
            currency: razorpayConfig.currency,
            name: razorpayConfig.name,
            description: `Order for ${cartItems.length} items`,
            image: razorpayConfig.image,
            // Enhanced payment method configuration with UPI priority
            method: razorpayConfig.method,
            config: razorpayConfig.config,
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
                  
                  // Set completed order data for token display
                  const completedOrderData = {
                    ...orderData,
                    firestoreOrderId,
                    orderNumber: `FS${Date.now()}`
                  }
                  
                  // Add tokens to each shop that has items in the order
                  const shopTokens = {}
                  completedOrderData.items.forEach(item => {
                    if (!shopTokens[item.shopId]) {
                      shopTokens[item.shopId] = {
                        shopName: item.shopName,
                        shopId: item.shopId,
                        items: [],
                        totalAmount: 0
                      }
                    }
                    shopTokens[item.shopId].items.push(item)
                    shopTokens[item.shopId].totalAmount += item.price * item.quantity
                  })

                  // Add token to each shop
                  Object.values(shopTokens).forEach(shopData => {
                    const shopTokenData = {
                      tokenNumber: completedOrderData.tokenNumber,
                      shopName: shopData.shopName,
                      shopId: shopData.shopId,
                      items: shopData.items,
                      totalAmount: shopData.totalAmount,
                      orderStatus: 'confirmed',
                      customerInfo: completedOrderData.customerInfo,
                      firestoreOrderId: completedOrderData.firestoreOrderId,
                      timestamp: new Date().toISOString()
                    }
                    addShopToken(shopData.shopId, shopTokenData)
                  })

                  setCompletedOrder(completedOrderData)
                  // Clear cart and show payment success
                  clearCart() // Clear cart immediately after successful payment
                  onOrderSuccess(completedOrderData)

                  // Show payment success dialog
                  setShowPaymentSuccess(true)
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
        } catch (configError) {
          console.error('Razorpay configuration error:', configError)
          alert('⚠️ Razorpay configuration error. Please check your setup.')
          setIsProcessing(false)
          return
        }

        try {
          const rzp1 = new window.Razorpay(options)
          rzp1.on('payment.failed', function (response) {
            console.error('Payment failed:', response.error)
            alert(`Payment failed: ${response.error.description}`)
            setIsProcessing(false)
          })
          rzp1.open()
        } catch (razorpayError) {
          console.error('Razorpay initialization error:', razorpayError)
          alert('Payment gateway initialization failed. Please check your connection and try again.')
          setIsProcessing(false)
        }
      } // Close script.onload function
      
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
                <li>🎫 Show your token number to the shopkeeper</li>
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