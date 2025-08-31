import React from 'react'
import './PolicyPages.css'

function PrivacyPolicy() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <header className="policy-header">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="policy-content">
          <section>
            <h2>1. Information We Collect</h2>
            <p>
              At College Food Street, we collect information you provide directly to us, such as when you create an account, 
              place an order, or contact us for support.
            </p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, phone number</li>
              <li><strong>Payment Information:</strong> Credit card details, billing address (processed securely via Razorpay)</li>
              <li><strong>Order Information:</strong> Food preferences, delivery address, order history</li>
              <li><strong>Device Information:</strong> IP address, browser type, device identifiers</li>
            </ul>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfill your food orders</li>
              <li>Communicate with you about your orders and account</li>
              <li>Provide customer support and respond to your inquiries</li>
              <li>Improve our services and user experience</li>
              <li>Send you promotional offers and updates (with your consent)</li>
              <li>Comply with legal obligations and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2>3. Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
            <ul>
              <li><strong>Service Providers:</strong> With trusted partners who help us operate our service (payment processors, delivery partners)</li>
              <li><strong>Restaurant Partners:</strong> Order details with respective food vendors to fulfill your orders</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. All payment transactions are processed through secure, PCI-compliant 
              payment gateways.
            </p>
          </section>

          <section>
            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and update your personal information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt-out of promotional communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section>
            <h2>6. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide 
              personalized content. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2>7. Children's Privacy</h2>
            <p>
              Our service is intended for college students (18+). We do not knowingly collect personal information from 
              children under 18. If you believe we have collected such information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2>9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <div className="contact-info">
              <p><strong>Email:</strong> veerramjat333@gmail.com</p>
              <p><strong>Phone:</strong> +91-8306461994</p>
              <p><strong>Address:</strong> A-25 Krishi Vihar Badarwas Jaipur, Rajasthan 302020</p>
              <p><strong>Business:</strong> Digital Food Street</p>
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

export default PrivacyPolicy