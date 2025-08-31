import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSimpleCart } from './SimpleCartContext'
import './SimpleMenu.css'

// Static menu data
const menuItems = [
  {
    id: 1,
    name: 'Classic Burger',
    price: 299,
    image: '🍔',
    description: 'Juicy beef patty with lettuce, tomato, and special sauce',
    category: 'burgers'
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    price: 399,
    image: '🍕',
    description: 'Fresh mozzarella, tomato sauce, and basil',
    category: 'pizza'
  },
  {
    id: 3,
    name: 'Chicken Sandwich',
    price: 249,
    image: '🥪',
    description: 'Grilled chicken breast with mayo and vegetables',
    category: 'sandwiches'
  },
  {
    id: 4,
    name: 'French Fries',
    price: 149,
    image: '🍟',
    description: 'Crispy golden fries with salt',
    category: 'sides'
  },
  {
    id: 5,
    name: 'Caesar Salad',
    price: 199,
    image: '🥗',
    description: 'Fresh romaine lettuce with caesar dressing',
    category: 'salads'
  },
  {
    id: 6,
    name: 'Chocolate Shake',
    price: 179,
    image: '🥤',
    description: 'Rich chocolate milkshake with whipped cream',
    category: 'beverages'
  },
  {
    id: 7,
    name: 'Pepperoni Pizza',
    price: 449,
    image: '🍕',
    description: 'Classic pepperoni with mozzarella cheese',
    category: 'pizza'
  },
  {
    id: 8,
    name: 'Chicken Wings',
    price: 329,
    image: '🍗',
    description: 'Spicy buffalo wings with ranch dip',
    category: 'sides'
  },
  {
    id: 9,
    name: 'Veggie Burger',
    price: 269,
    image: '🍔',
    description: 'Plant-based patty with fresh vegetables',
    category: 'burgers'
  },
  {
    id: 10,
    name: 'Iced Coffee',
    price: 129,
    image: '☕',
    description: 'Cold brew coffee with ice and milk',
    category: 'beverages'
  }
]

const categories = [
  { id: 'all', name: 'All Items', icon: '🍽️' },
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'sandwiches', name: 'Sandwiches', icon: '🥪' },
  { id: 'sides', name: 'Sides', icon: '🍟' },
  { id: 'salads', name: 'Salads', icon: '🥗' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' }
]

const SimpleMenu = () => {
  const { addToCart, getTotalItems, getTotalPrice } = useSimpleCart()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [addedItems, setAddedItems] = useState({})

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const handleAddToCart = (item) => {
    addToCart(item)
    setAddedItems(prev => ({ ...prev, [item.id]: true }))
    
    // Reset the animation after 1 second
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }))
    }, 1000)
  }

  const formatPrice = (price) => {
    return `₹${price}`
  }

  return (
    <div className="simple-menu">
      {/* Header */}
      <header className="menu-header">
        <div className="header-content">
          <Link to="/" className="back-btn">
            ← Back
          </Link>
          <h1 className="menu-title">Our Menu</h1>
          <Link to="/cart" className="cart-btn">
            🛒
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </Link>
        </div>
      </header>

      {/* Category Filter */}
      <div className="category-filter">
        <div className="categories-scroll">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <main className="menu-content">
        <div className="menu-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="menu-item">
              <div className="item-image">
                <span className="food-emoji">{item.image}</span>
              </div>
              <div className="item-info">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <div className="item-footer">
                  <span className="item-price">{formatPrice(item.price)}</span>
                  <button
                    className={`add-btn ${addedItems[item.id] ? 'added' : ''}`}
                    onClick={() => handleAddToCart(item)}
                  >
                    {addedItems[item.id] ? '✓ Added' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Summary */}
      {getTotalItems() > 0 && (
        <div className="cart-summary">
          <div className="summary-content">
            <div className="summary-info">
              <span className="total-items">{getTotalItems()} items</span>
              <span className="total-price">{formatPrice(getTotalPrice())}</span>
            </div>
            <Link to="/cart" className="view-cart-btn">
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimpleMenu