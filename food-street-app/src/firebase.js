// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v9-compat and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDytu0AoYnDsQdfmtZgbxKmvL_-8mYJpqo",
  authDomain: "new-food-0.firebaseapp.com",
  projectId: "new-food-0",
  storageBucket: "new-food-0.firebasestorage.app",
  messagingSenderId: "1007390502780",
  appId: "1:1007390502780:web:e0aa377372b0f4554f3ef9",
  measurementId: "G-F1E8Q8MD8S"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Add parameters to help with popup issues
  access_type: 'online',
  response_type: 'code'
})

// Add scopes if needed
googleProvider.addScope('email')
googleProvider.addScope('profile')

export default app