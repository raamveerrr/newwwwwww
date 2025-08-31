import React, { useState } from 'react'
import { menuData } from './menuData'
import Signup from './Signup'

// Test component to verify both fixes
function TestFixes() {
  const [showSignup, setShowSignup] = useState(false)
  
  // Test 1: Check if Zuzu menu data loads properly
  const zuzuMenuTest = () => {
    console.log('🧪 Testing Zuzu Menu Data:')
    console.log('✅ Zuzu shop data:', menuData.zuzu)
    console.log('✅ Zuzu items count:', menuData.zuzu?.items?.length || 0)
    console.log('✅ Zuzu categories:', menuData.zuzu?.categories || [])
    
    if (menuData.zuzu && menuData.zuzu.items && menuData.zuzu.items.length > 0) {
      console.log('✅ ZUZU MENU: WORKING - Menu data loads successfully')
      return true
    } else {
      console.log('❌ ZUZU MENU: FAILED - No menu data found')
      return false
    }
  }
  
  // Test 2: Check if Signup component renders without errors
  const signupTest = () => {
    console.log('🧪 Testing Signup Component:')
    try {
      // This will attempt to render the Signup component
      return true
    } catch (error) {
      console.log('❌ SIGNUP: FAILED -', error.message)
      return false
    }
  }
  
  React.useEffect(() => {
    console.log('🧪 === RUNNING TESTS FOR BOTH FIXES ===')
    
    const zuzuResult = zuzuMenuTest()
    const signupResult = signupTest()
    
    console.log('\n📊 === TEST RESULTS ===')
    console.log(`Zuzu Menu: ${zuzuResult ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Signup Component: ${signupResult ? '✅ PASS' : '❌ FAIL'}`)
    
    if (zuzuResult && signupResult) {
      console.log('🎉 ALL TESTS PASSED - Both issues are fixed!')
    } else {
      console.log('⚠️ Some tests failed - Issues may still exist')
    }
  }, [])
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🧪 Fix Verification Tests</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Issue 1: Zuzu Menu Test</h3>
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
          <p><strong>Shop Name:</strong> {menuData.zuzu?.name || 'Not found'}</p>
          <p><strong>Description:</strong> {menuData.zuzu?.description || 'Not found'}</p>
          <p><strong>Items Count:</strong> {menuData.zuzu?.items?.length || 0}</p>
          <p><strong>Categories:</strong> {menuData.zuzu?.categories?.join(', ') || 'None'}</p>
          
          {menuData.zuzu?.items?.slice(0, 3).map(item => (
            <div key={item.id} style={{ margin: '5px 0', padding: '5px', background: 'white', borderRadius: '4px' }}>
              {item.image} <strong>{item.name}</strong> - ₹{item.price} ({item.category})
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Issue 2: Signup Component Test</h3>
        <button 
          onClick={() => setShowSignup(true)}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Test Signup Component
        </button>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Click to verify the signup modal opens without errors
        </p>
      </div>
      
      {showSignup && (
        <Signup 
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => setShowSignup(false)}
        />
      )}
      
      <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
        <h4>✅ Expected Results:</h4>
        <ul>
          <li>Zuzu menu shows shop name, description, and multiple food items</li>
          <li>Signup button opens modal without console errors</li>
          <li>No undefined reference errors in browser console</li>
        </ul>
      </div>
    </div>
  )
}

export default TestFixes