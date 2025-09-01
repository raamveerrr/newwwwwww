// Razorpay Configuration
export const razorpayConfig = {
  // Get key from environment variables
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Fallback for development
  currency: 'INR',
  name: 'Digital Food Street',
  description: 'College Food Street Pre-Order',
  image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj5GUzwvdGV4dD4KPC9zdmc+', // Base64 encoded SVG logo
  theme: {
    color: '#667eea'
  },
  modal: {
    ondismiss: function() {
      console.log('Payment cancelled by user')
    }
  },
  // Payment method preferences (UPI prioritized)
  method: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true,
    emi: false,
    paylater: false
  },
  // UPI specific configuration
  config: {
    display: {
      blocks: {
        banks: {
          name: 'Pay using ' + (window.navigator.userAgent.includes('Mobile') ? 'UPI Apps' : 'Net Banking'),
          instruments: [
            {
              method: 'upi'
            },
            {
              method: 'card'
            },
            {
              method: 'netbanking'
            }
          ]
        }
      },
      sequence: ['block.banks'],
      preferences: {
        show_default_blocks: true
      }
    }
  },
  // Development mode flag
  isDevelopment: true
}

// For production, use environment variables
export const getRazorpayKey = () => {
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID || razorpayConfig.keyId
  // Only log in development, never expose key details in production
  if (import.meta.env.DEV) {
    console.log('🔑 Razorpay Key loaded successfully')
  }
  return key
}

// Check if we're in development mode with invalid keys
export const isDevelopmentMode = () => {
  const key = getRazorpayKey()
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '0.0.0.0'
  const isDevEnvironment = import.meta.env.DEV
  
  // Consider development mode only if:
  // 1. Running on localhost/127.0.0.1 OR
  // 2. Vite dev environment OR 
  // 3. Using placeholder/test keys
  const hasTestKey = !key || key === 'rzp_test_1234567890' || key.includes('YOUR_NEW_VALID_KEY_HERE')
  
  const isDev = isLocalhost || isDevEnvironment || (hasTestKey && !window.location.hostname.includes('netlify.app'))
  
  // Only log detailed info in development
  if (import.meta.env.DEV) {
    console.log('🔍 Payment mode: ' + (isDev ? 'Development' : 'Production'))
  }
  
  return isDev
}

// Mock payment for development
export const mockPayment = (amount, onSuccess, onError) => {
  return new Promise((resolve) => {
    // Simulate payment processing delay
    setTimeout(() => {
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substr(2, 9)
      
      const mockResponse = {
        razorpay_payment_id: `pay_mock_${timestamp}_${randomId}`,
        razorpay_order_id: `order_mock_${timestamp}_${randomId}`,
        razorpay_signature: `mock_signature_${randomId}_${timestamp}`
      }
      
      console.log('🧪 Mock payment completed')
      onSuccess(mockResponse)
      resolve(mockResponse)
    }, 2000) // 2 second delay to simulate processing
  })
}

// Mock payment verification (in production, this should be done on backend)
export const verifyPayment = async (paymentData) => {
  // In production, send this data to your backend for verification
  // For demo purposes, we'll simulate verification with proper validation

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Enhanced validation with better error handling
  if (!paymentData) {
    console.error('❌ Payment verification failed: No payment data received')
    return {
      success: false,
      error: 'No payment data received',
      orderId: null,
      paymentId: null
    }
  }

  // Log the received payment data for debugging
  console.log('🔍 Payment data received:', {
    hasPaymentId: !!paymentData.razorpay_payment_id,
    hasOrderId: !!paymentData.razorpay_order_id,
    hasSignature: !!paymentData.razorpay_signature,
    paymentId: paymentData.razorpay_payment_id?.substring(0, 10) + '...',
    orderId: paymentData.razorpay_order_id?.substring(0, 10) + '...',
    signature: paymentData.razorpay_signature?.substring(0, 10) + '...'
  })

  // Check for required fields with more detailed validation
  const missingFields = []
  if (!paymentData.razorpay_payment_id) missingFields.push('payment_id')
  if (!paymentData.razorpay_order_id) missingFields.push('order_id')
  if (!paymentData.razorpay_signature) missingFields.push('signature')

  if (missingFields.length > 0) {
    console.error('❌ Payment verification failed: Missing required fields:', missingFields.join(', '))

    // For development/testing, if we have at least a payment ID, we can proceed
    // This handles cases where Razorpay might not return all fields in test mode
    if (paymentData.razorpay_payment_id && isDevelopmentMode()) {
      console.log('🔄 Development mode: Proceeding with partial payment data')
      return {
        success: true,
        orderId: paymentData.razorpay_order_id || `order_${Date.now()}`,
        paymentId: paymentData.razorpay_payment_id,
        signature: paymentData.razorpay_signature || 'dev_signature',
        partial: true // Flag to indicate partial data
      }
    }

    return {
      success: false,
      error: `Missing required fields: ${missingFields.join(', ')}`,
      orderId: paymentData.razorpay_order_id,
      paymentId: paymentData.razorpay_payment_id
    }
  }

  // Remove random verification failures for production stability
  // In production, implement proper signature verification on backend

  // For demo, return success with proper validation
  // In production, verify the payment signature on backend
  console.log('✅ Payment verification successful')
  return {
    success: true,
    orderId: paymentData.razorpay_order_id,
    paymentId: paymentData.razorpay_payment_id,
    signature: paymentData.razorpay_signature
  }
}
