// Razorpay Configuration
export const razorpayConfig = {
  // Test Key - Replace with your actual Razorpay key
  keyId: 'rzp_test_1234567890', // Replace with your test key
  currency: 'INR',
  name: 'Food Street',
  description: 'College Food Street Pre-Order',
  image: '🍕', // You can replace with actual logo URL
  theme: {
    color: '#667eea'
  },
  modal: {
    ondismiss: function() {
      console.log('Payment cancelled by user')
    }
  }
}

// For production, use environment variables
export const getRazorpayKey = () => {
  return import.meta.env.VITE_RAZORPAY_KEY_ID || razorpayConfig.keyId
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