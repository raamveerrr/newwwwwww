import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useCart } from './CartContext'
import Navigation from './Navigation'
import { db } from './firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { usePullToRefresh } from './hooks/usePullToRefresh'
import { useVoiceSearch, useAutocomplete } from './hooks/useSearch'
import './Menu.css'

function Menu({ shopData }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { addToCart } = useCart()
  const categoriesRef = useRef(null)
  const searchInputRef = useRef(null)

  // Set up real-time listener for menu items
  useEffect(() => {
    console.log('📍 Menu component loaded with shopData:', shopData)
    console.log('📍 Shop items:', shopData?.items?.length || 0, 'items')
    
    // First, load static data immediately
    if (shopData && shopData.items) {
      setMenuItems(shopData.items || [])
      console.log('✅ Static menu items loaded:', shopData.items.length)
    } else {
      console.error('❌ No shop data or items found!', shopData)
    }
    setLoading(false)
    
    // Then try to load from Firestore (optional)
    const itemsRef = collection(db, 'menuItems')
    const q = query(
      itemsRef, 
      where('shopId', '==', shopData.id)
    )
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = []
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() })
      })
      
      // Only use Firestore data if we have items
      if (items.length > 0) {
        // Sort items locally instead of in Firestore query
        items.sort((a, b) => {
          if (a.category !== b.category) {
            return a.category.localeCompare(b.category)
          }
          return a.name.localeCompare(b.name)
        })
        setMenuItems(items)
      }
    }, (error) => {
      console.log('Firestore query failed, using static data:', error)
      // Keep using static data on error
    })
    
    return () => unsubscribe()
  }, [shopData.id]) // Remove shopData.items from dependencies to prevent infinite loop

  // Filter items based on category, search term, and availability
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const isAvailable = item.available !== false // Show item if available is true or undefined
    return matchesCategory && matchesSearch && isAvailable
  })

  // Get all categories including 'All'
  const categories = ['All', ...shopData.categories]
  const currentCategoryIndex = categories.indexOf(selectedCategory)

  // Create autocomplete options from menu items (memoized to prevent infinite loops)
  const autocompleteOptions = useMemo(() => menuItems.map(item => item.name), [menuItems])
  const { suggestions } = useAutocomplete(searchTerm, autocompleteOptions)

  // Voice search functionality
  const { isListening, isSupported: isVoiceSupported, startListening } = useVoiceSearch(
    (transcript) => {
      setSearchTerm(transcript)
      setShowSuggestions(false)
      // Focus back to search input
      if (searchInputRef.current) {
        searchInputRef.current.focus()
      }
    },
    (error) => {
      console.error('Voice search error:', error)
    }
  )

  const handleAddToCart = (item) => {
    addToCart(item, {
      id: shopData.id,
      name: shopData.name
    })
    
    // Add haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(25)
    }
  }

  return (
    <>
      <Navigation />
      <div className="menu-container">
        
        {/* Shop Header */}
        <div className={`shop-header ${shopData.color}`}>
          <div className="shop-info">
            <div className="shop-emoji">{shopData.emoji}</div>
            <div>
              <h1 className="shop-name">{shopData.name}</h1>
              <p className="shop-description">{shopData.description}</p>
            </div>
          </div>
        </div>

      {/* Enhanced Search Bar with Voice and Autocomplete */}
      <div className="search-section">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for food items..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setShowSuggestions(e.target.value.length > 1)
            }}
            onFocus={() => setShowSuggestions(searchTerm.length > 1)}
            onBlur={() => {
              // Delay hiding suggestions to allow clicking
              setTimeout(() => setShowSuggestions(false), 200)
            }}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => {
                setSearchTerm('')
                setShowSuggestions(false)
                if (navigator.vibrate) navigator.vibrate(10)
              }}
            >
              ✕
            </button>
          )}
          {isVoiceSupported && (
            <button 
              className={`voice-search-btn ${isListening ? 'listening' : ''}`}
              onClick={() => {
                startListening()
                if (navigator.vibrate) navigator.vibrate(25)
              }}
              disabled={isListening}
              title="Voice search"
            >
              {isListening ? '🎤' : '🎙️'}
            </button>
          )}
          
          {/* Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-item"
                  onClick={() => {
                    setSearchTerm(suggestion)
                    setShowSuggestions(false)
                    if (navigator.vibrate) navigator.vibrate(15)
                  }}
                >
                  <span className="suggestion-icon">🍽️</span>
                  <span className="suggestion-text">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <div className="category-tabs-container">
          <div className="category-tabs">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(category)
                  if (navigator.vibrate) navigator.vibrate(10)
                }}
              >
                {category}
                {selectedCategory === category && (
                  <span className="active-indicator">●</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="menu-grid">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading menu items...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <MenuItemCard 
              key={item.id} 
              item={item} 
              onAddToCart={() => handleAddToCart(item)}
            />
          ))
        ) : (
          <div className="no-items">
            <span className="no-items-emoji">🍽️</span>
            <h3>No items available</h3>
            <p>Items may be temporarily unavailable or try a different category</p>
            
            {/* Debug information for troubleshooting */}
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '0.9rem',
              textAlign: 'left',
              border: '1px solid #dee2e6'
            }}>
              <strong>🐛 Debug Info:</strong><br/>
              Shop ID: {shopData?.id || 'Missing'}<br/>
              Shop Name: {shopData?.name || 'Missing'}<br/>
              Total Items: {menuItems?.length || 0}<br/>
              Filtered Items: {filteredItems?.length || 0}<br/>
              Search Term: '{searchTerm}'<br/>
              Selected Category: '{selectedCategory}'<br/>
              Environment: {import.meta.env.MODE}<br/>
              Hostname: {window.location.hostname}<br/>
              Static Data Available: {shopData?.items ? 'Yes (' + shopData.items.length + ')' : 'No'}
            </div>
            
            <button 
              className="refresh-menu-btn"
              onClick={() => window.location.reload()}
            >
              🔄 Refresh Menu
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

// Enhanced Menu Item Card Component
function MenuItemCard({ item, onAddToCart }) {
  const [isAdding, setIsAdding] = useState(false)
  
  const handleAddToCart = async () => {
    setIsAdding(true)
    onAddToCart()
    
    // Visual feedback
    setTimeout(() => setIsAdding(false), 300)
  }
  
  return (
    <div className={`menu-item-card ${isAdding ? 'adding' : ''}`}>
      {item.popular && <div className="popular-badge">⭐ Popular</div>}
      
      <div className="item-image">
        <span className="item-emoji">{item.image}</span>
        <div className={`veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}`}>
          <span className="veg-dot"></span>
        </div>
      </div>

      <div className="item-content">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-description">{item.description}</p>
        
        <div className="item-footer">
          <div className="item-price">₹{item.price}</div>
          <button 
            className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <span className="adding-spinner">⭕</span>
                Adding...
              </>
            ) : (
              'Add to Cart'
            )}
          </button>
        </div>
      </div>

    </div>
  )
}



export default Menu