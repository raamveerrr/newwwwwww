# Thermal Printer Setup Guide for Food Street

## 🖨️ **Hardware Requirements**

### **Recommended Thermal Printers:**
1. **Epson TM-T20III** (₹8,000-12,000)
   - 80mm thermal printer
   - USB + Ethernet connectivity
   - Fast printing speed
   - Reliable for food service

2. **TVS RP 3160 Star** (₹6,000-9,000)
   - 80mm thermal printer
   - USB connectivity
   - Good for small shops

3. **TVSE PT 280** (₹5,000-7,000)
   - Budget-friendly option
   - USB connectivity
   - Suitable for low-volume shops

### **Network Requirements:**
- **Each shop needs:**
  - Wi-Fi connection
  - Fixed local IP address
  - Printer connected to network via USB-to-Ethernet adapter or built-in Ethernet

## 🔧 **Software Setup**

### **1. Printer Server Setup (Per Shop)**

Install print server software on each shop's computer/Raspberry Pi:

```bash
# Install Node.js print server
npm install express thermal-printer escpos

# Create printer server
node printer-server.js
```

### **2. Printer Server Code (printer-server.js)**

```javascript
const express = require('express')
const ThermalPrinter = require('thermal-printer').printer
const PrinterTypes = require('thermal-printer').types

const app = express()
app.use(express.json())

// Configure printer
const printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: '/dev/usb/lp0', // Linux
  // interface: 'tcp://192.168.1.100', // Network printer
  options: {
    timeout: 5000
  }
})

// Health check endpoint
app.get('/status', (req, res) => {
  res.json({ 
    status: 'online', 
    printer: printer.isPrinterConnected(),
    shop: process.env.SHOP_ID || 'unknown'
  })
})

// Print receipt endpoint
app.post('/print', async (req, res) => {
  try {
    const { content, tokenNumber, copies = 1 } = req.body
    
    console.log(`Printing receipt for token: ${tokenNumber}`)
    
    // Clear any previous print jobs
    printer.clear()
    
    // Print the receipt content
    printer.println(content)
    printer.cut()
    
    // Execute print job
    await printer.execute()
    
    console.log(`✅ Receipt printed successfully: ${tokenNumber}`)
    
    res.json({ 
      success: true, 
      tokenNumber,
      printerId: process.env.SHOP_ID,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Print error:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

// Notification endpoint for shop displays
app.post('/notify', (req, res) => {
  const notification = req.body
  console.log('🔔 New order notification:', notification)
  
  // Here you could trigger LED display, speaker alert, etc.
  // For example: update digital display board
  
  res.json({ success: true })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🖨️ Printer server running on port ${PORT}`)
  console.log(`Shop: ${process.env.SHOP_ID || 'Unknown'}`)
})
```

### **3. Shop-Specific Configuration**

Create `.env` file for each shop:

**ZUZU Shop (.env):**
```
SHOP_ID=zuzu
SHOP_NAME=ZUZU
PORT=8080
PRINTER_IP=192.168.1.100
```

**Oasis Kitchen (.env):**
```
SHOP_ID=oasis  
SHOP_NAME=Oasis Kitchen
PORT=8080
PRINTER_IP=192.168.1.101
```

**Bites and Bites (.env):**
```
SHOP_ID=bites
SHOP_NAME=Bites and Bites  
PORT=8080
PRINTER_IP=192.168.1.102
```

**Shakers and Movers (.env):**
```
SHOP_ID=shakers
SHOP_NAME=Shakers and Movers
PORT=8080  
PRINTER_IP=192.168.1.103
```

## 🌐 **Network Configuration**

### **Router Setup:**
1. **Assign static IPs** to each shop's computer/device
2. **Port forwarding** if needed (port 8080 for each shop)
3. **Firewall rules** to allow printing traffic

### **IP Address Mapping:**
```
ZUZU:              192.168.1.100:8080
Oasis Kitchen:     192.168.1.101:8080  
Bites and Bites:   192.168.1.102:8080
Shakers & Movers:  192.168.1.103:8080
```

## 📱 **Mobile App Integration**

### **Receipt Format:**
```
=====================================
         ZUZU
    DIGITAL FOOD STREET
=====================================
Date: 31/08/2024 14:30:25
Token: FS156789012
Order: ABC12345
=====================================
CUSTOMER DETAILS:
Name: John Doe
Phone: +91-9876543210
Email: john@example.com
=====================================
ORDER ITEMS:
Pizza Margherita     x2
                        ₹540.00
Coke                 x1  
                        ₹40.00
=====================================
TOTAL AMOUNT: ₹580.00
PAYMENT: PAID ONLINE
STATUS: CONFIRMED
=====================================
PICKUP INSTRUCTIONS:
1. Show this token: FS156789012
2. Present student ID for verification
3. Pickup within 45 minutes
4. Contact: +91-8306461994
=====================================
Thank you for choosing Food Street!
     Visit us again soon!
=====================================
```

### **Student Mobile Display:**
```
🎉 PAYMENT SUCCESSFUL!

🎫 YOUR TOKEN: FS156789012

📍 PICKUP LOCATIONS:
• ZUZU (2 items) - Ready in 15 mins
• Oasis Kitchen (1 item) - Ready in 8 mins

📋 WHAT TO DO:
1. Wait for "Ready" notification
2. Visit the shop(s) 
3. Show token: FS156789012
4. Present your student ID
5. Collect your delicious food!

🔔 You'll be notified when ready!
```

## 🔧 **Installation Steps**

### **For Each Shop:**

1. **Hardware Setup:**
   ```bash
   # Connect thermal printer to computer via USB
   # Configure printer drivers
   # Set static IP for computer
   ```

2. **Software Installation:**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Create printer service directory
   mkdir /opt/foodstreet-printer
   cd /opt/foodstreet-printer
   
   # Install dependencies
   npm init -y
   npm install express thermal-printer escpos dotenv
   
   # Copy printer server code
   # Configure .env file for shop
   # Start service
   node printer-server.js
   ```

3. **Auto-Start Service:**
   ```bash
   # Create systemd service
   sudo nano /etc/systemd/system/foodstreet-printer.service
   
   # Enable and start
   sudo systemctl enable foodstreet-printer
   sudo systemctl start foodstreet-printer
   ```

## 💰 **Cost Breakdown (Per Shop)**

| Item | Cost (₹) | Purpose |
|------|----------|---------|
| Thermal Printer | 6,000-12,000 | Receipt printing |
| Thermal Paper Rolls | 200/month | Consumables |
| USB Cable | 200 | Connectivity |
| Computer/Raspberry Pi | 3,000-15,000 | Print server |
| Setup & Configuration | 2,000 | One-time setup |
| **Total per shop** | **11,400-29,400** | **Complete setup** |

## 🚀 **Testing the System**

1. **Test printer connectivity:**
   ```bash
   curl http://192.168.1.100:8080/status
   ```

2. **Test receipt printing:**
   ```bash
   curl -X POST http://192.168.1.100:8080/print \
   -H "Content-Type: application/json" \
   -d '{"content":"Test Receipt\nToken: TEST123", "tokenNumber":"TEST123"}'
   ```

3. **Monitor printer status:**
   ```bash
   # Check if printer is ready
   # Verify paper level
   # Test automatic alerts
   ```

## 📞 **Support & Troubleshooting**

- **Contact:** +91-8306461994
- **Email:** veerramjat333@gmail.com
- **Common Issues:** Paper jam, network connectivity, driver problems
- **Backup Plan:** SMS/email alerts when printer offline

---

**Note:** This setup enables fully automated receipt printing. When a student pays, receipts automatically print at relevant shops within 2-3 seconds!