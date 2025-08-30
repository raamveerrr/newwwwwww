import React, { useState, useEffect } from 'react'
import { useCart } from './CartContext'
import Navigation from './Navigation'
import { db } from './firebase'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import './Menu.css'

function Menu({ shopData }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  // Set up real-time listener for menu items
  useEffect(() => {
    // First, load static data immediately
    setMenuItems(shopData.items || [])
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
  }, [shopData.id, shopData.items])

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

  const handleAddToCart = (item) => {
    addToCart(item, {
      id: shopData.id,
      name: shopData.name
    })
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

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for food items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category}
              className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
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
            <div key={item.id} className="menu-item-card">
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
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-items">
            <span className="no-items-emoji">🍽️</span>
            <h3>No items available</h3>
            <p>Items may be temporarily unavailable or try a different category</p>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default Menu