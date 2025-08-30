import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { Navigate } from 'react-router-dom'
import { db } from './firebase'
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  orderBy 
} from 'firebase/firestore'
import Navigation from './Navigation'
import LogoutDialog from './LogoutDialog'
import './Admin.css'

function Admin() {
  const { currentUser, userProfile, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('inventory')
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState('')
  const [menuItems, setMenuItems] = useState([])
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '🍕',
    isVeg: true,
    available: true,
    popular: false
  })
  const [loading, setLoading] = useState(true)

  // Check if user is admin and get their shop
  const isAdmin = userProfile?.userType === 'admin'
  const userShopId = userProfile?.shopId

  // Redirect non-admin users
  if (currentUser && userProfile && !isAdmin) {
    return <Navigate to="/" replace />
  }

  useEffect(() => {
    if (isAdmin && userShopId) {
      loadShopsAndItems()
    }
  }, [isAdmin, userShopId])

  const loadShopsAndItems = async () => {
    try {
      setLoading(true)
      
      // Load shop data based on user's assigned shop
      const allShops = [
        { id: 'zuzu', name: 'ZUZU', categories: ['Pizzas', 'Burgers', 'Sandwiches', 'Beverages'] },
        { id: 'oasis', name: 'Oasis Kitchen', categories: ['Salads', 'Bowls', 'Wraps', 'Smoothies'] },
        { id: 'bites', name: 'Bites and Bites', categories: ['Snacks', 'Burgers', 'Wraps', 'Beverages'] },
        { id: 'shakers', name: 'Shakers and Movers', categories: ['Shakes', 'Smoothies', 'Juices', 'Mocktails'] }
      ]
      
      const userShop = allShops.find(shop => shop.id === userShopId)
      if (userShop) {
        setShops([userShop]) // Only show user's assigned shop
        setSelectedShop(userShop.id)
        
        // Set up real-time listener for menu items (only for this shop)
        const itemsRef = collection(db, 'menuItems')
        const q = query(
          itemsRef, 
          where('shopId', '==', userShopId),
          orderBy('name')
        )
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const items = []
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() })
          })
          setMenuItems(items)
          setLoading(false)
        })
        
        return unsubscribe
      }
    } catch (error) {
      console.error('Error loading data:', error)
      // Fallback to static data if Firestore fails
      const allShops = [
        { id: 'zuzu', name: 'ZUZU', categories: ['Pizzas', 'Burgers', 'Sandwiches', 'Beverages'] },
        { id: 'oasis', name: 'Oasis Kitchen', categories: ['Salads', 'Bowls', 'Wraps', 'Smoothies'] },
        { id: 'bites', name: 'Bites and Bites', categories: ['Snacks', 'Burgers', 'Wraps', 'Beverages'] },
        { id: 'shakers', name: 'Shakers and Movers', categories: ['Shakes', 'Smoothies', 'Juices', 'Mocktails'] }
      ]
      const userShop = allShops.find(shop => shop.id === userShopId)
      if (userShop) {
        setShops([userShop])
        setSelectedShop(userShop.id)
      }
      setLoading(false)
    }
  }

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  const handleLogoutConfirm = async () => {
    try {
      await logout()
      setShowLogoutDialog(false)
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false)
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    try {
      const itemData = {
        ...newItem,
        price: parseFloat(newItem.price),
        shopId: selectedShop,
        shopName: shops.find(s => s.id === selectedShop)?.name,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await addDoc(collection(db, 'menuItems'), itemData)
      
      // Reset form
      setNewItem({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '🍕',
        isVeg: true,
        available: true,
        popular: false
      })
      
      alert('Item added successfully!')
    } catch (error) {
      console.error('Error adding item:', error)
      alert('Failed to add item. Please try again.')
    }
  }

  const toggleAvailability = async (itemId, currentAvailability) => {
    try {
      const itemRef = doc(db, 'menuItems', itemId)
      await updateDoc(itemRef, {
        available: !currentAvailability,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Error updating availability:', error)
      alert('Failed to update availability')
    }
  }

  const deleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'menuItems', itemId))
        alert('Item deleted successfully!')
      } catch (error) {
        console.error('Error deleting item:', error)
        alert('Failed to delete item')
      }
    }
  }

  if (!currentUser || !userProfile) {
    return (
      <>
        <Navigation />
        <div className="admin-container">
          <div className="access-denied">
            <h2>Please login to access admin panel</h2>
          </div>
        </div>
      </>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  const currentShop = shops.find(s => s.id === selectedShop)

  return (
    <>
      <div className="admin-navbar">
        <div className="admin-nav-content">
          <div className="admin-nav-logo">
            <span className="logo-icon">🍕</span>
            <span className="logo-text">Admin Panel - {currentShop?.name}</span>
          </div>
          <div className="admin-nav-actions">
            <span className="welcome-text">
              Welcome, {userProfile?.name || 'Admin'}!
            </span>
            <button className="logout-btn" onClick={handleLogoutClick}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-container">
        <div className="admin-header">
          <h1>🔧 {currentShop?.name} - Admin Panel</h1>
          <p>Manage your shop's inventory and orders</p>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            📦 Inventory Management
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📋 Order Management
          </button>
        </div>

        {activeTab === 'inventory' && (
          <div className="inventory-management">
            {/* Shop is pre-selected based on user profile, no need for selector */}
            <div className="admin-content">
              {/* Add New Item Form */}
              <div className="add-item-section">
                <h3>Add New Item to {currentShop?.name}</h3>
                <form onSubmit={handleAddItem} className="add-item-form">
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      required
                    />
                  </div>
                  
                  <textarea
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    required
                  />
                  
                  <div className="form-row">
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      required
                    >
                      <option value="">Select Category</option>
                      {currentShop?.categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    
                    <input
                      type="text"
                      placeholder="Emoji (🍕)"
                      value={newItem.image}
                      onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                    />
                  </div>
                  
                  <div className="checkboxes">
                    <label>
                      <input
                        type="checkbox"
                        checked={newItem.isVeg}
                        onChange={(e) => setNewItem({...newItem, isVeg: e.target.checked})}
                      />
                      Vegetarian
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={newItem.popular}
                        onChange={(e) => setNewItem({...newItem, popular: e.target.checked})}
                      />
                      Popular Item
                    </label>
                  </div>
                  
                  <button type="submit" className="add-btn">
                    Add Item
                  </button>
                </form>
              </div>

              {/* Current Items */}
              <div className="current-items">
                <h3>Current Items - {currentShop?.name}</h3>
                {loading ? (
                  <div className="loading">Loading items...</div>
                ) : (
                  <div className="items-list">
                    {menuItems.map(item => (
                      <div key={item.id} className={`item-card ${!item.available ? 'unavailable' : ''}`}>
                        <div className="item-info">
                          <span className="item-emoji">{item.image}</span>
                          <div className="item-details">
                            <h4>{item.name}</h4>
                            <p>{item.description}</p>
                            <div className="item-meta">
                              <span className="price">₹{item.price}</span>
                              <span className="category">{item.category}</span>
                              {item.isVeg && <span className="veg-badge">🌱 Veg</span>}
                              {item.popular && <span className="popular-badge">⭐ Popular</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="item-actions">
                          <button
                            className={`availability-btn ${item.available ? 'available' : 'unavailable'}`}
                            onClick={() => toggleAvailability(item.id, item.available)}
                          >
                            {item.available ? '✅ Available' : '❌ Unavailable'}
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteItem(item.id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {menuItems.length === 0 && (
                      <div className="no-items">
                        <p>No items found for this shop. Add some items to get started!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="order-management">
            <h3>Order Management</h3>
            <p>Order management features coming soon...</p>
          </div>
        )}
      </div>

      {/* Logout Dialog */}
      <LogoutDialog 
        isOpen={showLogoutDialog}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  )
}

export default Admin