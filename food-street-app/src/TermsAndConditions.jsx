import React from 'react'
import './PolicyPages.css'

function TermsAndConditions() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <header className="policy-header">
          <h1>Terms and Conditions</h1>
          <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="policy-content">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using College Food Street, you accept and agree to be bound by the terms and provision 
              of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              College Food Street is an online food ordering platform that connects college students with campus food vendors. 
              We facilitate pre-ordering of food items for pickup or delivery within the college campus.
            </p>
          </section>

          <section>
            <h2>3. User Eligibility</h2>
            <p>You must meet the following requirements to use our service:</p>
            <ul>
              <li>Be a current student, faculty, or staff member of the college</li>
              <li>Be at least 18 years old or have parental consent</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
            </ul>
          </section>

          <section>
            <h2>4. Account Responsibilities</h2>
            <ul>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>We reserve the right to refuse service or terminate accounts for violations</li>
            </ul>
          </section>

          <section>
            <h2>5. Ordering and Payment</h2>
            <h3>5.1 Order Placement</h3>
            <ul>
              <li>All orders are subject to vendor availability and acceptance</li>
              <li>Prices are subject to change without notice</li>
              <li>We reserve the right to refuse or cancel any order</li>
              <li>Order confirmation does not guarantee fulfillment</li>
            </ul>

            <h3>5.2 Payment Terms</h3>
            <ul>
              <li>Payment is required at the time of order placement</li>
              <li>We accept major credit cards, debit cards, and digital wallets</li>
              <li>All payments are processed securely through Razorpay</li>
              <li>You authorize us to charge your payment method for all orders</li>
            </ul>
          </section>

          <section>
            <h2>6. Delivery and Pickup</h2>
            <ul>
              <li>Delivery times are estimates and may vary based on demand</li>
              <li>You must be available to receive your order during the estimated time</li>
              <li>For pickup orders, you must collect your order within the specified timeframe</li>
              <li>We are not responsible for orders left unattended or unclaimed</li>
            </ul>
          </section>

          <section>
            <h2>7. Food Safety and Allergies</h2>
            <ul>
              <li>Food vendors are responsible for food safety and quality</li>
              <li>Please inform vendors of any allergies or dietary restrictions</li>
              <li>We are not liable for allergic reactions or food-related illnesses</li>
              <li>If you have severe allergies, please exercise caution when ordering</li>
            </ul>
          </section>

          <section>
            <h2>8. Intellectual Property</h2>
            <p>
              All content on this platform, including text, graphics, logos, and software, is the property of College Food Street 
              or its content suppliers and is protected by copyright and intellectual property laws.
            </p>
          </section>

          <section>
            <h2>9. Limitation of Liability</h2>
            <p>
              College Food Street shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
              resulting from your use of the service. Our total liability shall not exceed the amount paid for the specific order.
            </p>
          </section>

          <section>
            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify and hold College Food Street harmless from any claims, damages, or expenses arising from 
              your use of the service or violation of these terms.
            </p>
          </section>

          <section>
            <h2>11. Modifications</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
              Your continued use of the service constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2>12. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be 
              resolved in the courts of the jurisdiction where the college is located.
            </p>
          </section>

          <section>
            <h2>13. Contact Information</h2>
            <p>For questions about these Terms and Conditions, please contact us:</p>
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

export default TermsAndConditions