import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut, 
  onAuthStateChanged,
  updateProfile 
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

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // College email validation (you can customize this)
  const validateCollegeEmail = (email) => {
    // Add your college domain validation here
    // For now, accepting any valid email
    return validateEmail(email)
  }

  // Sign up function with email validation
  async function signup(email, password, displayName, userData = {}) {
    // Validate email first
    if (!validateCollegeEmail(email)) {
      throw new Error('Please enter a valid email address')
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      })
      
      // Store additional user data in Firestore
      const userDoc = {
        uid: userCredential.user.uid,
        name: displayName,
        email: email,
        userType: userData.userType || 'student',
        shopId: userData.shopId || null,
        createdAt: new Date().toISOString(),
        authProvider: 'email'
      }
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userDoc)
      setUserProfile(userDoc)
      
      return userCredential
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  // Google Sign up/Sign in function
  async function signupWithGoogle(userData = {}) {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Validate email (you can add college domain validation here)
      if (!validateCollegeEmail(user.email)) {
        // Sign out the user if email is not valid
        await signOut(auth)
        throw new Error('Please use a valid college email address')
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
      } else {
        // Update existing profile with new user type if provided
        profileData = userDoc.data()
        if (userData.userType && profileData.userType !== userData.userType) {
          profileData.userType = userData.userType
          profileData.shopId = userData.shopId || profileData.shopId
          await setDoc(userDocRef, profileData, { merge: true })
        }
      }
      
      setUserProfile(profileData)
      return result
    } catch (error) {
      console.error('Google signup error:', error)
      throw error
    }
  }

  // Login function
  async function login(email, password, userData = {}) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Get user profile from Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const profileData = userDoc.data()
        
        // Verify user type and shop if provided
        if (userData.userType && profileData.userType !== userData.userType) {
          throw new Error(`This account is registered as ${profileData.userType}, not ${userData.userType}`)
        }
        
        if (userData.shopId && profileData.shopId !== userData.shopId) {
          throw new Error(`This admin account is not associated with the selected shop`)
        }
        
        setUserProfile(profileData)
      } else {
        // Create profile if it doesn't exist (for existing users)
        const newProfile = {
          uid: userCredential.user.uid,
          name: userCredential.user.displayName || 'User',
          email: userCredential.user.email,
          userType: userData.userType || 'student',
          shopId: userData.shopId || null,
          createdAt: new Date().toISOString()
        }
        
        await setDoc(userDocRef, newProfile)
        setUserProfile(newProfile)
      }
      
      return userCredential
    } catch (error) {
      console.error('Login error:', error)
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
    signup,
    signupWithGoogle,
    login,
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