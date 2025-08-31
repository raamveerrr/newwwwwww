// Automated Receipt Printing Service
export class PrinterService {
  constructor() {
    // Check if we're in development mode
    this.isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        import.meta.env.DEV
    
    this.printerEndpoints = {
      'zuzu': 'http://192.168.1.100:8080/print', // ZUZU shop printer IP
      'oasis': 'http://192.168.1.101:8080/print', // Oasis Kitchen printer IP
      'bites': 'http://192.168.1.102:8080/print', // Bites and Bites printer IP
      'shakers': 'http://192.168.1.103:8080/print' // Shakers and Movers printer IP
    }
    
    this.retryAttempts = this.isDevelopment ? 1 : 3 // Fewer retries in dev
    this.retryDelay = this.isDevelopment ? 500 : 2000 // Faster fail in dev
    
    // Print queue management for concurrent orders
    this.printQueues = {
      'zuzu': [],
      'oasis': [],
      'bites': [],
      'shakers': []
    }
    
    this.isProcessing = {
      'zuzu': false,
      'oasis': false,
      'bites': false,
      'shakers': false
    }
    
    // Maximum concurrent prints per shop
    this.maxConcurrentPrints = 1
    
    // Queue status tracking
    this.queueStats = {
      'zuzu': { processed: 0, failed: 0, avgTime: 0 },
      'oasis': { processed: 0, failed: 0, avgTime: 0 },
      'bites': { processed: 0, failed: 0, avgTime: 0 },
      'shakers': { processed: 0, failed: 0, avgTime: 0 }
    }
    
    // Connection pool for each printer
    this.activeConnections = {
      'zuzu': 0,
      'oasis': 0,
      'bites': 0,
      'shakers': 0
    }
    
    // Circuit breaker for printer health monitoring
    this.circuitBreakers = {
      'zuzu': { state: 'closed', failures: 0, lastFailure: null, cooldownUntil: null },
      'oasis': { state: 'closed', failures: 0, lastFailure: null, cooldownUntil: null },
      'bites': { state: 'closed', failures: 0, lastFailure: null, cooldownUntil: null },
      'shakers': { state: 'closed', failures: 0, lastFailure: null, cooldownUntil: null }
    }
    
    this.circuitBreakerConfig = {
      failureThreshold: 3, // Open circuit after 3 consecutive failures
      cooldownPeriod: 30000, // 30 seconds cooldown
      halfOpenRetryDelay: 5000 // 5 seconds between half-open attempts
    }
    
    console.log(this.isDevelopment ? '🧪 PrinterService: Development mode' : '🖨️ PrinterService: Production mode')
  }

  // Generate formatted receipt content
  generateReceiptContent(orderData) {
    const receiptTime = new Date().toLocaleString('en-IN')
    const shopName = orderData.shopName.toUpperCase()
    
    let receipt = `
=====================================
         ${shopName}
    DIGITAL FOOD STREET
=====================================
Date: ${receiptTime}
Token: ${orderData.tokenNumber}
Order: ${orderData.firestoreOrderId?.slice(-8) || 'N/A'}
=====================================
CUSTOMER DETAILS:
Name: ${orderData.customerInfo.name}
Phone: ${orderData.customerInfo.phone}
Email: ${orderData.customerInfo.email}
=====================================
ORDER ITEMS:
`

    orderData.items.forEach(item => {
      const itemTotal = (item.price * item.quantity).toFixed(2)
      receipt += `${item.name.padEnd(20)} x${item.quantity}\n`
      receipt += `${' '.repeat(25)}₹${itemTotal}\n`
    })

    receipt += `=====================================
TOTAL AMOUNT: ₹${orderData.shopTotal?.toFixed(2) || orderData.totalAmount.toFixed(2)}
PAYMENT: PAID ONLINE
STATUS: CONFIRMED
=====================================
PICKUP INSTRUCTIONS:
1. Show this token: ${orderData.tokenNumber}
2. Present student ID for verification
3. Pickup within 45 minutes
4. Contact: +91-8306461994
=====================================
Thank you for choosing Food Street!
     Visit us again soon!
=====================================

`
    return receipt
  }

  // Mock printing for development
  async mockPrint(shopId, orderData) {
    console.log(`🧪 Mock printing for ${orderData.shopName}:`)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate and log the receipt content
    const receiptContent = this.generateReceiptContent(orderData)
    console.log('--- MOCK RECEIPT ---')
    console.log(receiptContent)
    console.log('--- END RECEIPT ---')
    
    // Simulate successful print
    const mockResult = {
      success: true,
      printerId: `mock_printer_${shopId}`,
      timestamp: new Date().toISOString(),
      isDevelopment: true
    }
    
    console.log(`✅ Mock receipt printed successfully for ${orderData.shopName}`)
    return mockResult
  }

  // Send receipt to specific shop printer with queue management
  async sendToPrinter(shopId, orderData) {
    // Development mode - simulate printing
    if (this.isDevelopment) {
      return this.mockPrint(shopId, orderData)
    }
    
    // Add to print queue for concurrency management
    return this.addToPrintQueue(shopId, orderData)
  }
  
  // Queue management for concurrent printing
  async addToPrintQueue(shopId, orderData) {
    const queueId = `${shopId}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    
    const printJob = {
      id: queueId,
      shopId,
      orderData,
      timestamp: new Date().toISOString(),
      attempts: 0,
      status: 'queued'
    }
    
    this.printQueues[shopId].push(printJob)
    console.log(`📋 Added print job ${queueId} to ${orderData.shopName} queue (position: ${this.printQueues[shopId].length})`)
    
    // Process the queue
    this.processPrintQueue(shopId)
    
    // Return a promise that resolves when this specific job completes
    return new Promise((resolve) => {
      const checkJobStatus = setInterval(() => {
        const job = this.findJobInQueue(queueId)
        if (!job || job.status === 'completed' || job.status === 'failed') {
          clearInterval(checkJobStatus)
          resolve(job ? job.result : { success: false, error: 'Job not found' })
        }
      }, 100)
    })
  }
  
  // Process print queue for a specific shop with enhanced concurrency control
  async processPrintQueue(shopId) {
    if (this.isProcessing[shopId] || this.printQueues[shopId].length === 0) {
      return
    }
    
    this.isProcessing[shopId] = true
    console.log(`🔄 Starting queue processing for ${shopId} (${this.printQueues[shopId].length} jobs)`)
    
    while (this.printQueues[shopId].length > 0) {
      const job = this.printQueues[shopId].shift()
      job.status = 'processing'
      job.startTime = Date.now()
      
      console.log(`🖨️ Processing print job ${job.id} for ${job.orderData.shopName} (Queue position: 1 of ${this.printQueues[shopId].length + 1})`)
      
      try {
        const result = await this.executePrintJob(job)
        job.status = 'completed'
        job.result = result
        job.completedTime = Date.now()
        console.log(`✅ Print job ${job.id} completed in ${job.completedTime - job.startTime}ms`)
      } catch (error) {
        job.attempts++
        
        if (job.attempts < 3) {
          // Retry the job
          job.status = 'retrying'
          this.printQueues[shopId].unshift(job) // Put back at front of queue
          console.warn(`🔄 Retrying print job ${job.id} (attempt ${job.attempts + 1}/3)`)
          await new Promise(resolve => setTimeout(resolve, 1000))
        } else {
          job.status = 'failed'
          job.result = { success: false, error: error.message }
          console.error(`❌ Print job ${job.id} failed permanently:`, error)
        }
      }
      
      // Staggered delay between prints to prevent printer overload
      if (this.printQueues[shopId].length > 0) {
        const delay = this.calculateOptimalDelay(shopId)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    this.isProcessing[shopId] = false
    console.log(`✅ Queue processing completed for ${shopId}`)
  }
  
  // Calculate optimal delay between prints based on queue performance
  calculateOptimalDelay(shopId) {
    const stats = this.queueStats[shopId]
    const baseDelay = 200
    
    // Increase delay if we're seeing failures
    const failureRate = stats.processed > 0 ? stats.failed / stats.processed : 0
    const failurePenalty = failureRate * 1000 // Add up to 1 second for high failure rates
    
    // Increase delay if average processing time is high
    const timePenalty = stats.avgTime > 3000 ? 500 : 0
    
    const optimalDelay = baseDelay + failurePenalty + timePenalty
    console.log(`⏱️ Optimal delay for ${shopId}: ${Math.round(optimalDelay)}ms (failure rate: ${(failureRate * 100).toFixed(1)}%)`)
    
    return Math.min(optimalDelay, 2000) // Cap at 2 seconds
  }
  
  // Find a specific job in queues
  findJobInQueue(jobId) {
    for (const shopId in this.printQueues) {
      const job = this.printQueues[shopId].find(j => j.id === jobId)
      if (job) return job
    }
    return null
  }
  
  // Execute actual print job with enhanced error handling and circuit breaker
  async executePrintJob(job) {
    const { shopId, orderData } = job
    const printerUrl = this.printerEndpoints[shopId]
    const startTime = Date.now()
    
    if (!printerUrl) {
      throw new Error('Printer not configured')
    }
    
    // Check circuit breaker state
    const circuitState = this.checkCircuitBreaker(shopId)
    if (circuitState === 'open') {
      throw new Error('Printer circuit breaker is open - printer appears to be down')
    }
    
    // Check connection limits
    if (this.activeConnections[shopId] >= this.maxConcurrentPrints) {
      throw new Error('Maximum concurrent connections reached')
    }
    
    this.activeConnections[shopId]++
    
    try {
      const receiptContent = this.generateReceiptContent(orderData)
      
      // Enhanced retry logic with exponential backoff
      const result = await this.executeWithRetry(printerUrl, receiptContent, orderData, shopId)
      
      // Update statistics and circuit breaker on success
      const duration = Date.now() - startTime
      this.updateQueueStats(shopId, true, duration)
      this.recordCircuitBreakerSuccess(shopId)
      
      return result
    } catch (error) {
      // Record failure in circuit breaker
      this.recordCircuitBreakerFailure(shopId)
      throw error
    } finally {
      this.activeConnections[shopId]--
    }
  }
  
  // Check circuit breaker state
  checkCircuitBreaker(shopId) {
    const breaker = this.circuitBreakers[shopId]
    const now = Date.now()
    
    switch (breaker.state) {
      case 'closed':
        return 'closed' // Normal operation
        
      case 'open':
        if (breaker.cooldownUntil && now >= breaker.cooldownUntil) {
          breaker.state = 'half-open'
          console.log(`🔄 Circuit breaker for ${shopId} moving to half-open state`)
          return 'half-open'
        }
        return 'open'
        
      case 'half-open':
        return 'half-open'
        
      default:
        return 'closed'
    }
  }
  
  // Record successful print for circuit breaker
  recordCircuitBreakerSuccess(shopId) {
    const breaker = this.circuitBreakers[shopId]
    
    if (breaker.state === 'half-open') {
      console.log(`✅ Circuit breaker for ${shopId} closing after successful print`)
      breaker.state = 'closed'
    }
    
    breaker.failures = 0
    breaker.lastFailure = null
  }
  
  // Record failed print for circuit breaker
  recordCircuitBreakerFailure(shopId) {
    const breaker = this.circuitBreakers[shopId]
    const now = Date.now()
    
    breaker.failures++
    breaker.lastFailure = now
    
    if (breaker.failures >= this.circuitBreakerConfig.failureThreshold) {
      breaker.state = 'open'
      breaker.cooldownUntil = now + this.circuitBreakerConfig.cooldownPeriod
      console.warn(`⚠️ Circuit breaker OPENED for ${shopId} after ${breaker.failures} failures. Cooldown until: ${new Date(breaker.cooldownUntil).toLocaleTimeString()}`)
    }
  }
  
  // Get printer health status
  getPrinterHealth(shopId) {
    const breaker = this.circuitBreakers[shopId]
    const stats = this.queueStats[shopId]
    const queueLength = this.printQueues[shopId].length
    
    return {
      shopId,
      circuitState: breaker.state,
      queueLength,
      activeConnections: this.activeConnections[shopId],
      failures: breaker.failures,
      successRate: stats.processed > 0 ? ((stats.processed - stats.failed) / stats.processed * 100).toFixed(1) + '%' : 'N/A',
      avgResponseTime: Math.round(stats.avgTime) + 'ms',
      lastFailure: breaker.lastFailure ? new Date(breaker.lastFailure).toLocaleTimeString() : 'None'
    }
  }
  
  // Enhanced retry mechanism with exponential backoff
  async executeWithRetry(printerUrl, receiptContent, orderData, shopId) {
    const printData = {
      type: 'receipt',
      content: receiptContent,
      copies: 1,
      shopId: shopId,
      tokenNumber: orderData.tokenNumber,
      timestamp: new Date().toISOString(),
      priority: 'high', // Auto-print has high priority
      requestId: `${shopId}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` // Unique request ID
    }

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`🖨️ Sending receipt to ${orderData.shopName} (Attempt ${attempt}/${this.retryAttempts})`)
        
        // Create AbortController for timeout handling
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)
        
        const response = await fetch(printerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shop-Id': shopId,
            'X-Token': orderData.tokenNumber,
            'X-Request-Id': printData.requestId,
            'X-Attempt': attempt.toString()
          },
          body: JSON.stringify(printData),
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)

        if (response.ok) {
          const result = await response.json()
          console.log(`✅ Receipt printed successfully at ${orderData.shopName}`)
          
          // Send notification to shop's display/notification system
          this.sendShopNotification(shopId, orderData)
          
          return { 
            success: true, 
            printerId: result.printerId || `printer_${shopId}`,
            timestamp: result.timestamp || new Date().toISOString(),
            requestId: printData.requestId
          }
        } else {
          throw new Error(`Printer responded with status: ${response.status} - ${response.statusText}`)
        }
      } catch (error) {
        console.error(`❌ Print attempt ${attempt} failed for ${orderData.shopName}:`, error.message)
        
        if (attempt < this.retryAttempts) {
          // Exponential backoff: wait longer between retries
          const backoffDelay = this.retryDelay * Math.pow(2, attempt - 1)
          console.log(`⏳ Waiting ${backoffDelay}ms before retry...`)
          await new Promise(resolve => setTimeout(resolve, backoffDelay))
        } else {
          // Final attempt failed - use fallback
          this.updateQueueStats(shopId, false, 0)
          return this.handlePrintFailure(shopId, orderData)
        }
      }
    }
  }
  
  // Update queue statistics for monitoring
  updateQueueStats(shopId, success, duration) {
    const stats = this.queueStats[shopId]
    stats.processed++
    if (!success) stats.failed++
    
    // Calculate rolling average time
    if (success && duration > 0) {
      stats.avgTime = stats.avgTime === 0 ? duration : (stats.avgTime + duration) / 2
    }
    
    console.log(`📊 Queue stats for ${shopId}: Processed: ${stats.processed}, Failed: ${stats.failed}, Avg Time: ${Math.round(stats.avgTime)}ms`)
  }

  // Send notification to shop's display system
  async sendShopNotification(shopId, orderData) {
    try {
      const notificationData = {
        type: 'NEW_ORDER',
        tokenNumber: orderData.tokenNumber,
        customerName: orderData.customerInfo.name,
        itemCount: orderData.items.length,
        totalAmount: orderData.shopTotal || orderData.totalAmount,
        estimatedTime: this.calculatePrepTime(orderData.items),
        priority: 'normal',
        timestamp: new Date().toISOString()
      }

      // Send to shop's notification display (LED screen, computer, etc.)
      const displayUrl = this.printerEndpoints[shopId].replace('/print', '/notify')
      
      await fetch(displayUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      })
      
      console.log(`🔔 Notification sent to ${orderData.shopName} display`)
    } catch (error) {
      console.error('Failed to send shop notification:', error)
    }
  }

  // Calculate estimated preparation time
  calculatePrepTime(items) {
    const baseTimes = {
      'beverage': 3,    // 3 minutes for drinks
      'snack': 5,       // 5 minutes for snacks
      'main': 12,       // 12 minutes for main dishes
      'dessert': 8      // 8 minutes for desserts
    }
    
    let maxTime = 0
    items.forEach(item => {
      const category = item.category?.toLowerCase() || 'main'
      const timeRequired = (baseTimes[category] || 10) * item.quantity
      maxTime = Math.max(maxTime, timeRequired)
    })
    
    return Math.min(maxTime, 25) // Cap at 25 minutes
  }

  // Handle printer failure with backup options
  async handlePrintFailure(shopId, orderData) {
    console.error(`🚨 All print attempts failed for ${orderData.shopName}`)
    
    try {
      // Fallback 1: Send SMS to shop owner
      await this.sendSMSAlert(shopId, orderData)
      
      // Fallback 2: Send email notification
      await this.sendEmailAlert(shopId, orderData)
      
      // Fallback 3: Store in pending prints queue
      await this.queueForManualPrint(shopId, orderData)
      
      return { 
        success: false, 
        error: 'Printer offline - alerts sent',
        fallbacksSent: ['sms', 'email', 'queue']
      }
    } catch (error) {
      console.error('Fallback notifications also failed:', error)
      return { success: false, error: 'Complete print failure' }
    }
  }

  // Send SMS alert to shop when printer fails
  async sendSMSAlert(shopId, orderData) {
    const shopContacts = {
      'zuzu': '+91-8306461994',
      'oasis': '+91-8306461994', 
      'bites': '+91-8306461994',
      'shakers': '+91-8306461994'
    }
    
    const phoneNumber = shopContacts[shopId]
    const message = `🚨 PRINTER DOWN! New Order: Token ${orderData.tokenNumber}, Customer: ${orderData.customerInfo.name}, Items: ${orderData.items.length}, Total: ₹${orderData.totalAmount}. Check system immediately!`
    
    // In production, integrate with SMS service like Twilio
    console.log(`📱 SMS Alert sent to ${phoneNumber}: ${message}`)
  }

  // Send email alert to shop when printer fails
  async sendEmailAlert(shopId, orderData) {
    const emailContent = {
      to: 'veerramjat333@gmail.com',
      subject: `🚨 Printer Failure - New Order ${orderData.tokenNumber}`,
      body: this.generateReceiptContent(orderData)
    }
    
    // In production, integrate with email service
    console.log(`📧 Email alert sent for shop ${shopId}:`, emailContent)
  }

  // Queue order for manual printing when system is back online
  async queueForManualPrint(shopId, orderData) {
    const queueItem = {
      shopId,
      orderData,
      queuedAt: new Date().toISOString(),
      retryCount: 0,
      status: 'pending'
    }
    
    // In production, store in database or Redis queue
    console.log(`📋 Order queued for manual print:`, queueItem)
  }

  // Process all pending print jobs (called when printer comes back online)
  async processPendingPrints(shopId) {
    console.log(`🔄 Processing pending prints for shop: ${shopId}`)
    // Implementation would fetch from queue and retry printing
  }
  
  // Get comprehensive system status for monitoring dashboard
  getSystemStatus() {
    const systemStatus = {
      timestamp: new Date().toISOString(),
      mode: this.isDevelopment ? 'Development' : 'Production',
      shops: {}
    }
    
    // Get status for each shop
    Object.keys(this.printerEndpoints).forEach(shopId => {
      systemStatus.shops[shopId] = this.getPrinterHealth(shopId)
    })
    
    // Calculate overall system health
    const totalShops = Object.keys(this.printerEndpoints).length
    const healthyShops = Object.values(systemStatus.shops).filter(shop => shop.circuitState === 'closed').length
    systemStatus.overallHealth = {
      status: healthyShops === totalShops ? 'Healthy' : healthyShops > totalShops / 2 ? 'Degraded' : 'Critical',
      healthyShops: `${healthyShops}/${totalShops}`,
      totalQueueLength: Object.values(this.printQueues).reduce((total, queue) => total + queue.length, 0)
    }
    
    return systemStatus
  }
  
  // Emergency flush all queues (admin function)
  emergencyFlushQueues() {
    console.warn('🚨 EMERGENCY: Flushing all print queues')
    Object.keys(this.printQueues).forEach(shopId => {
      const flushedCount = this.printQueues[shopId].length
      this.printQueues[shopId] = []
      console.log(`📋 Flushed ${flushedCount} jobs from ${shopId} queue`)
    })
  }
}

// Export singleton instance
export const printerService = new PrinterService()
export default printerService