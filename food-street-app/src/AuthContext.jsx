import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from './firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null) // Additional user data
  const [loading, setLoading] = useState(true)

  // Email validation function (for Google emails)
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // College email validation (you can customize this)
  const validateCollegeEmail = (email) => {
    // Add your college domain validation here
    // For now, accepting any valid email from Google
    return validateEmail(email)
  }

  // Google Sign in/Sign up function with popup fallback to redirect
  async function signInWithGoogle(userData = {}) {
    try {
      console.log('🔐 Attempting Google Sign In...')
      
      let result
      
      try {
        // First try popup method
        console.log('📱 Trying popup authentication...')
        result = await signInWithPopup(auth, googleProvider)
        console.log('✅ Popup authentication successful')
      } catch (popupError) {
        console.log('❌ Popup failed:', popupError.code)
        
        // If popup fails due to CSP or user closed popup, try redirect
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request') {
          
          console.log('🔄 Falling back to redirect authentication...')
          
          // Store user data for after redirect
          if (userData.userType) {
            localStorage.setItem('pendingUserData', JSON.stringify(userData))
          }
          
          // Use redirect instead
          await signInWithRedirect(auth, googleProvider)
          return // Function will complete after redirect
        } else {
          // Re-throw other errors
          throw popupError
        }
      }
      
      const user = result.user
      
      // Validate email (you can add college domain validation here)
      if (!validateCollegeEmail(user.email)) {
        // Sign out the user if email is not valid
        await signOut(auth)
        throw new Error('Please use a valid email address. Only authorized domains are allowed.')
      }
      
      // Check if user profile already exists
      const userDocRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userDocRef)
      
      let profileData
      
      if (!userDoc.exists()) {
        // Create new user profile
        profileData = {
          uid: user.uid,
          name: user.displayName || 'User',
          email: user.email,
          userType: userData.userType || 'student',
          shopId: userData.shopId || null,
          createdAt: new Date().toISOString(),
          authProvider: 'google',
          photoURL: user.photoURL
        }
        
        await setDoc(userDocRef, profileData)
        console.log('👤 New user profile created')
      } else {
        // Update existing profile with new user type if provided
        profileData = userDoc.data()
        if (userData.userType && profileData.userType !== userData.userType) {
          profileData.userType = userData.userType
          profileData.shopId = userData.shopId || profileData.shopId
          await setDoc(userDocRef, profileData, { merge: true })
          console.log('👤 User profile updated')
        }
      }
      
      setUserProfile(profileData)
      console.log('✅ Authentication completed successfully')
      return result
    } catch (error) {
      console.error('❌ Google authentication error:', error)
      throw error
    }
  }



  // Logout function
  async function logout() {
    try {
      await signOut(auth)
      setUserProfile(null)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  useEffect(() => {
    // Handle redirect result on page load
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result) {
          console.log('✅ Redirect authentication successful')
          
          // Get stored user data
          const pendingUserData = localStorage.getItem('pendingUserData')
          const userData = pendingUserData ? JSON.parse(pendingUserData) : {}
          
          // Clean up stored data
          localStorage.removeItem('pendingUserData')
          
          // Process the user like in popup flow
          const user = result.user
          const userDocRef = doc(db, 'users', user.uid)
          const userDoc = await getDoc(userDocRef)
          
          let profileData
          if (!userDoc.exists()) {
            profileData = {
              uid: user.uid,
              name: user.displayName || 'User',
              email: user.email,
              userType: userData.userType || 'student',
              shopId: userData.shopId || null,
              createdAt: new Date().toISOString(),
              authProvider: 'google',
              photoURL: user.photoURL
            }
            await setDoc(userDocRef, profileData)
          } else {
            profileData = userDoc.data()
            if (userData.userType && profileData.userType !== userData.userType) {
              profileData.userType = userData.userType
              profileData.shopId = userData.shopId || profileData.shopId
              await setDoc(userDocRef, profileData, { merge: true })
            }
          }
          setUserProfile(profileData)
        }
      } catch (error) {
        console.error('Redirect result error:', error)
      }
    }
    
    // Handle redirect result first
    handleRedirectResult()
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user profile from Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid)
          const userDoc = await getDoc(userDocRef)
          
          if (userDoc.exists()) {
            setUserProfile(userDoc.data())
          } else {
            // Create default profile for existing users
            const defaultProfile = {
              uid: user.uid,
              name: user.displayName || 'User',
              email: user.email,
              userType: 'student',
              shopId: null,
              createdAt: new Date().toISOString()
            }
            
            await setDoc(userDocRef, defaultProfile)
            setUserProfile(defaultProfile)
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      } else {
        setUserProfile(null)
      }
      
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    signInWithGoogle,
    logout,
    validateEmail,
    validateCollegeEmail
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}