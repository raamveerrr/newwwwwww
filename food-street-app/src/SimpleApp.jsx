import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SimpleCartProvider } from './SimpleCartContext'
import { SimpleOrderProvider } from './SimpleOrderContext'
import SimpleHome from './SimpleHome'
import SimpleMenu from './SimpleMenu'
import SimpleCart from './SimpleCart'
import SimplePayment from './SimplePayment'
import SimpleSuccess from './SimpleSuccess'
import './SimpleApp.css'

function SimpleApp() {
  return (
    <div className="simple-app">
      <SimpleOrderProvider>
        <SimpleCartProvider>
          <Router>
            <Routes>
              {/* Home Page */}
              <Route path="/" element={<SimpleHome />} />
              
              {/* Menu Page */}
              <Route path="/menu" element={<SimpleMenu />} />
              
              {/* Cart Page */}
              <Route path="/cart" element={<SimpleCart />} />
              
              {/* Payment Page */}
              <Route path="/payment" element={<SimplePayment />} />
              
              {/* Success Page */}
              <Route path="/success" element={<SimpleSuccess />} />
              
              {/* Fallback - redirect to home */}
              <Route path="*" element={<SimpleHome />} />
            </Routes>
          </Router>
        </SimpleCartProvider>
      </SimpleOrderProvider>
    </div>
  )
}

export default SimpleApp