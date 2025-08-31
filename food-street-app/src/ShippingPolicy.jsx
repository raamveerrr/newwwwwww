import React from 'react'
import './PolicyPages.css'

function ShippingPolicy() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <header className="policy-header">
          <h1>Pre-Order & Pickup Policy</h1>
          <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="policy-content">
          <section>
            <h2>1. Service Overview</h2>
            <p>Our pre-order system allows students to order food in advance and pick it up at their convenience:</p>
            <ul>
              <li><strong>Service Type:</strong> Pre-order and pickup only (no delivery)</li>
              <li><strong>Pickup Locations:</strong> ZUZU, Oasis Kitchen, Bites and Bites, Shakers and Movers</li>
              <li><strong>Operating Hours:</strong> 8:00 AM to 10:00 PM (Monday to Sunday)</li>
              <li><strong>Campus Coverage:</strong> All food courts and vendor stalls within college campus</li>
            </ul>
          </section>

          <section>
            <h2>2. How Pre-Ordering Works</h2>
            <h3>2.1 Place Your Order</h3>
            <ul>
              <li><strong>Online Ordering:</strong> Select items from your preferred vendor</li>
              <li><strong>Payment:</strong> Pay securely online using Razorpay</li>
              <li><strong>Order Confirmation:</strong> Receive instant confirmation with pickup details</li>
              <li><strong>Preparation Time:</strong> Estimated ready time displayed for each order</li>
            </ul>

            <h3>2.2 Pickup Process</h3>
            <ul>
              <li><strong>Pickup Time:</strong> Collect order when ready (typically 10-20 minutes)</li>
              <li><strong>Pickup Location:</strong> Visit the specific vendor's stall</li>
              <li><strong>Order Verification:</strong> Show order ID and student ID for collection</li>
              <li><strong>Hold Time:</strong> Orders held for 45 minutes after preparation</li>
            </ul>
          </section>

          <section>
            <h2>3. Order Processing Fees</h2>
            <div className="delivery-charges">
              <p><strong>Platform Fee:</strong> ₹0 (Zero platform fee policy)</p>
              <p><strong>Payment Processing:</strong> Included in item prices</p>
              <p><strong>Service Charges:</strong> None</p>
              <br />
              <h3>Vendor-Specific Pricing:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Minimum Order</th>
                    <th>Processing Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ZUZU</td>
                    <td>₹30</td>
                    <td>10-15 minutes</td>
                  </tr>
                  <tr>
                    <td>Oasis Kitchen</td>
                    <td>₹25</td>
                    <td>12-18 minutes</td>
                  </tr>
                  <tr>
                    <td>Bites and Bites</td>
                    <td>₹35</td>
                    <td>8-12 minutes</td>
                  </tr>
                  <tr>
                    <td>Shakers and Movers</td>
                    <td>₹20</td>
                    <td>5-10 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>4. Order Preparation Time</h2>
            <h3>4.1 Standard Preparation Times</h3>
            <ul>
              <li><strong>Beverages & Snacks:</strong> 5-8 minutes</li>
              <li><strong>Fast Food Items:</strong> 10-15 minutes</li>
              <li><strong>Cooked Meals:</strong> 15-25 minutes</li>
              <li><strong>Special Requests:</strong> 20-30 minutes</li>
              <li><strong>Large Group Orders:</strong> 25-40 minutes</li>
            </ul>

            <h3>4.2 Factors Affecting Preparation Time</h3>
            <ul>
              <li>Peak hours (12:00-2:00 PM, 7:00-9:00 PM) may have longer preparation times</li>
              <li>Complex customizations may extend preparation time</li>
              <li>Special dietary requirements may require additional preparation</li>
              <li>Fresh preparation ensures quality but may take longer</li>
            </ul>
          </section>

          <section>
            <h2>5. Pickup Instructions</h2>
            <h3>5.1 For Students</h3>
            <ul>
              <li>Check order status in the app before visiting the vendor</li>
              <li>Bring your student ID and order confirmation</li>
              <li>Visit the correct vendor stall as mentioned in your order</li>
              <li>Provide order ID number to the vendor for quick collection</li>
            </ul>

            <h3>5.2 Order Collection Guidelines</h3>
            <ul>
              <li><strong>Ready Notification:</strong> You'll receive notification when order is ready</li>
              <li><strong>Pickup Window:</strong> Collect within 45 minutes of preparation</li>
              <li><strong>ID Verification:</strong> Student ID required for order verification</li>
              <li><strong>Order Changes:</strong> No modifications allowed after payment confirmation</li>
            </ul>
          </section>

          <section>
            <h2>6. Missed Pickup Policy</h2>
            <p>If you cannot collect your order within the specified time:</p>
            <ul>
              <li><strong>Grace Period:</strong> 45 minutes from order ready notification</li>
              <li><strong>Late Pickup:</strong> Order may be discarded after grace period for food safety</li>
              <li><strong>Refund Policy:</strong> No refund for orders not collected within grace period</li>
              <li><strong>Emergency Contact:</strong> Call support immediately if delayed</li>
            </ul>
            <p><strong>Food Safety Note:</strong> We cannot hold prepared food beyond safe time limits</p>
          </section>

          <section>
            <h2>7. Order Tracking</h2>
            <p>Track your order status in real-time through our app:</p>
            <ul>
              <li><strong>Order Confirmed:</strong> Vendor has accepted your order and payment processed</li>
              <li><strong>Preparing:</strong> Food is being prepared by the vendor</li>
              <li><strong>Ready for Pickup:</strong> Order is ready - come collect it!</li>
              <li><strong>Collected:</strong> Order has been successfully picked up</li>
              <li><strong>Expired:</strong> Order not collected within grace period</li>
            </ul>
          </section>

          <section>
            <h2>8. Food Safety & Quality</h2>
            <ul>
              <li>All food is prepared fresh after order confirmation</li>
              <li>Vendors follow strict food safety and hygiene protocols</li>
              <li>Hot food is kept warm until pickup time</li>
              <li>Cold items are properly refrigerated until collection</li>
              <li>Contactless pickup options available upon request</li>
              <li>All packaging is food-grade and eco-friendly when possible</li>
            </ul>
          </section>

          <section>
            <h2>9. Peak Hour Policy</h2>
            <h3>9.1 Peak Hours</h3>
            <ul>
              <li><strong>Lunch Rush:</strong> 12:00 PM - 2:00 PM</li>
              <li><strong>Dinner Rush:</strong> 7:00 PM - 9:00 PM</li>
              <li><strong>Exam Period:</strong> Extended hours with higher demand</li>
              <li><strong>Weekend Evenings:</strong> Increased preparation times</li>
            </ul>

            <h3>9.2 Peak Hour Adjustments</h3>
            <ul>
              <li>Preparation times may be extended by 10-20 minutes during peak hours</li>
              <li>Pre-ordering strongly recommended during lunch and dinner rush</li>
              <li>Some vendors may temporarily disable complex items during peak times</li>
              <li>Queue system in place to ensure fairness in order processing</li>
            </ul>
          </section>

          <section>
            <h2>10. Contact Information</h2>
            <p>For pickup and order-related queries:</p>
            <div className="contact-info">
              <p><strong>Order Support:</strong> veerramjat333@gmail.com</p>
              <p><strong>Pickup Assistance:</strong> +91-8306461994</p>
              <p><strong>Emergency Contact:</strong> +91-8306461994</p>
              <p><strong>WhatsApp Support:</strong> +91-8306461994</p>
              <p><strong>Business Address:</strong> A-25 Krishi Vihar Badarwas Jaipur, Rajasthan 302020</p>
            </div>
          </section>
        </div>

        <footer className="policy-footer">
          <a href="/" className="back-home">← Back to Home</a>
        </footer>
      </div>
    </div>
  )
}

export default ShippingPolicy