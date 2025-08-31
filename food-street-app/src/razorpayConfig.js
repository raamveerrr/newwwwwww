// Razorpay Configuration
export const razorpayConfig = {
  // Get key from environment variables
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Fallback for development
  currency: 'INR',
  name: 'Digital Food Street',
  description: 'College Food Street Pre-Order',
  image: 'https://via.placeholder.com/200x200/667eea/ffffff?text=FS', // Placeholder logo
  theme: {
    color: '#667eea'
  },
  modal: {
    ondismiss: function() {
      console.log('Payment cancelled by user')
    }
  },
  // Development mode flag
  isDevelopment: true
}

// For production, use environment variables
export const getRazorpayKey = () => {
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID || razorpayConfig.keyId
  console.log('🔑 Razorpay Key Status:', {
    envKey: import.meta.env.VITE_RAZORPAY_KEY_ID ? 'Present' : 'Missing',
    fallbackKey: razorpayConfig.keyId,
    finalKey: key ? `${key.substring(0, 12)}...` : 'No key found',
    keyLength: key?.length || 0,
    isValidFormat: key?.startsWith('rzp_') || false
  })
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
  
  console.log('🔍 Payment mode detection:', {
    hostname: window.location.hostname,
    isLocalhost,
    isDevEnvironment,
    hasTestKey,
    isDev,
    keyPresent: !!key
  })
  
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
      
      console.log('🧪 Mock payment completed:', mockResponse)
      onSuccess(mockResponse)
      resolve(mockResponse)
    }, 2000) // 2 second delay to simulate processing
  })
}

// Mock payment verification (in production, this should be done on backend)
export const verifyPayment = async (paymentData) => {
  // In production, send this data to your backend for verification
  // For demo purposes, we'll simulate verification
  console.log('Payment verification data:', paymentData)
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // For demo, always return success
  // In production, verify the payment signature on backend
  return {
    success: true,
    orderId: paymentData.razorpay_order_id,
    paymentId: paymentData.razorpay_payment_id,
    signature: paymentData.razorpay_signature
  }
}