# 🔐 Firebase Authentication Setup Guide

## Quick Setup Steps:

### 1. Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (or create new one)
3. Click **Authentication** in left sidebar
4. Click **Get Started**
5. Go to **Sign-in method** tab
6. Enable **Google** provider
7. Configure OAuth consent screen if prompted
8. Add your domain to **Authorized domains** (localhost is included by default)
9. Click **Save**

### 2. Download Config
1. Go to Project Settings → General
2. Scroll to "Your apps" → Web app
3. Copy the config object
4. Replace the config in `src/firebase.js`

### 3. Test Setup
```bash
npm run dev
```

### 4. Replace Firebase Config
Update `src/firebase.js` with your actual config:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
}
```

### 5. Test Authentication
1. Start your app: `npm run dev`
2. Try to signup/login with Google
3. Check Firebase Console > Authentication > Users

## Current Status:
- ✅ Firebase SDK installed
- ✅ Auth components created  
- ✅ Google-only authentication implemented
- ✅ Email/password authentication removed for security

## Security Benefits:
- 🔒 No fake email accounts possible
- 🛡️ Google's robust authentication system
- ✅ OAuth 2.0 security standards
- 🚫 No password management needed

## Need Help?
If you see authentication errors, check:
1. Firebase config is correct
2. Google provider is enabled in Console
3. Domain is authorized (localhost should work by default)
4. OAuth consent screen is configured

### 2. Get Firebase Config
1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Web app** icon (</>)
4. Register your app name: "Food Street App"
5. Copy the config object

### 3. Update Your Code
Replace the config in `src/firebase.js` with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
}
```

### 4. Test Authentication
1. Start your app: `npm run dev`
2. Try to signup/login
3. Check Firebase Console > Authentication > Users

## Current Status:
- ✅ Firebase SDK installed
- ✅ Auth components created  
- ✅ Auth context implemented
- ❌ Need to enable Email/Password in Firebase Console
- ❌ Need to update config with real credentials

## Quick Test:
After setup, you should be able to:
1. Click "Sign Up" on your app
2. Enter email/password  
3. See user created in Firebase Console
4. Login/logout should work

## Need Help?
If you see authentication errors, check:
1. Firebase config is correct
2. Email/Password is enabled in Console
3. Domain is authorized (localhost should work by default)