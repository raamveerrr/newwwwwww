#!/bin/bash
# Firebase Quick Setup Script

echo "🔥 Firebase Google Authentication Setup"
echo "========================================="

echo "1. Go to: https://console.firebase.google.com/project/new-food-0/authentication/providers"
echo "2. Click on 'Google'"
echo "3. Enable the toggle (Google Sign-in)"
echo "4. Configure OAuth consent screen if prompted"
echo "5. Add your domain to Authorized domains"
echo "6. Click 'Save'"
echo ""
echo "7. Test your app at: http://localhost:5174"
echo "8. Try signing in with your Google account"
echo ""
echo "✅ If Google sign-in works → Authentication is enabled!"
echo "❌ If you get 'popup-blocked' → Enable popups for localhost"
echo "❌ If you get 'unauthorized-domain' → Add domain to authorized list"
echo ""
echo "🔒 Security: Only Google accounts can access the system"
echo "🚫 Fake emails are now impossible!"
echo ""
echo "Need help? Check the FIREBASE_AUTH_SETUP.md file"