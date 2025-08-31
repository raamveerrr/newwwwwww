# Menu Items Not Showing After Deployment - Troubleshooting Guide

## 🚨 **Common Causes & Solutions**

### **1. Build/Import Path Issues**
**Problem:** Static imports fail during build process
**Solution:** Check build logs and verify all imports

```bash
# Check build process
npm run build

# Look for build errors in terminal
# Common errors:
# - "Module not found"
# - "Cannot resolve './menuData'"
# - "Unexpected token"
```

### **2. Environment Variables Missing**
**Problem:** Firebase config missing in production
**Solution:** Check Firebase environment variables

```javascript
// In firebase.js - ensure environment variables exist
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  // ... other config
}

// Add to your .env file:
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_actual_auth_domain
VITE_FIREBASE_PROJECT_ID=your_actual_project_id
```

### **3. Static Data Loading Issue**
**Problem:** menuData.js not loading properly in production
**Solution:** Add error handling and fallback

```javascript
// In Menu.jsx - Add error handling
useEffect(() => {
  console.log('Shop Data:', shopData) // Debug log
  console.log('Menu Items:', shopData.items) // Debug log
  
  if (!shopData || !shopData.items) {
    console.error('No shop data or items found!')
    setLoading(false)
    return
  }
  
  setMenuItems(shopData.items || [])
  setLoading(false)
}, [shopData])
```

### **4. JavaScript Bundling Issues**
**Problem:** ES6 modules not transpiled correctly
**Solution:** Check Vite config

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  }
})
```

### **5. Hosting Platform Issues**
**Problem:** Platform-specific deployment issues

#### **Firebase Hosting:**
```bash
# Redeploy with verbose logging
firebase deploy --only hosting --debug

# Check hosting config
# firebase.json should have:
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### **Vercel/Netlify:**
```bash
# Check build command in vercel.json or netlify.toml
# Should be: "npm run build"
# Publish directory: "dist"
```

### **6. Browser Console Errors**
**Problem:** JavaScript errors preventing render
**Solution:** Check browser console (F12)

Common errors to look for:
- `Uncaught TypeError: Cannot read property 'items' of undefined`
- `Module not found: Can't resolve './menuData'`
- `Firebase configuration error`
- `Chunk load error`

### **7. Network/CORS Issues**
**Problem:** Firebase requests blocked
**Solution:** Check Firebase rules and network

```javascript
// Firestore rules - ensure read access
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to menu items
    match /menuItems/{document} {
      allow read: if true;
    }
    
    // Allow authenticated users to read/write their data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🛠️ **Immediate Debug Steps**

### **Step 1: Check Browser Console**
1. Open your deployed website
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Look for red error messages
5. Take screenshot and share errors

### **Step 2: Check Network Tab**
1. In Developer Tools, go to Network tab
2. Refresh the page
3. Look for failed requests (red status codes)
4. Check if menuData.js is loading

### **Step 3: Verify Static Data**
1. In Console tab, type: `console.log(window)`
2. Check if JavaScript is executing
3. Type: `console.log('Menu test')` to verify JS works

### **Step 4: Check Build Output**
```bash
# Verify build output exists
ls dist/
# Should see: index.html, assets/ folder with .js and .css files

# Check if menuData is in the bundle
grep -r "menuData" dist/assets/
```

### **Step 5: Test Locally First**
```bash
# Test production build locally
npm run build
npm run preview

# If this works but deployed version doesn't,
# it's a deployment/hosting issue
```

## 🔧 **Quick Fixes to Try**

### **Fix 1: Force Static Import**
```javascript
// In each menu component (ZuzuMenu.jsx, etc.)
import React from 'react'
import Menu from './Menu'

// Hard-code data temporarily to test
const zuzuData = {
  id: 'zuzu',
  name: 'ZUZU',
  description: 'Delicious street food & snacks',
  emoji: '🍕',
  color: 'zuzu',
  categories: ['Pizzas', 'Burgers', 'Sandwiches', 'Beverages'],
  items: [
    {
      id: 'z1',
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
      price: 199,
      category: 'Pizzas',
      image: '🍕',
      isVeg: true,
      popular: true
    }
    // Add a few items to test
  ]
}

function ZuzuMenu() {
  return <Menu shopData={zuzuData} />
}
```

### **Fix 2: Add Debug Component**
```javascript
// Create DebugMenu.jsx for testing
import React from 'react'

function DebugMenu() {
  return (
    <div style={{padding: '20px'}}>
      <h1>Debug Menu</h1>
      <p>If you see this, React is working!</p>
      <div>
        <h3>Test Menu Items:</h3>
        <div>🍕 Pizza - ₹199</div>
        <div>🍔 Burger - ₹159</div>
        <div>🥤 Drink - ₹49</div>
      </div>
    </div>
  )
}

export default DebugMenu

// Then use <DebugMenu /> instead of <Menu />
```

### **Fix 3: Environment Check**
```javascript
// Add to App.jsx to debug environment
console.log('Environment:', import.meta.env.MODE)
console.log('Firebase Config:', import.meta.env.VITE_FIREBASE_API_KEY ? 'Present' : 'Missing')
```

## 📞 **Next Steps**

1. **Open browser console** and share any error messages
2. **Try the debug component** to isolate the issue
3. **Check build logs** for any warning/error messages
4. **Test locally** with `npm run build && npm run preview`

Which of these steps reveals the issue? Share the console errors and I'll help you fix it immediately! 🚀