import React from 'react'
import './PolicyPages.css'

function CancellationRefunds() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <header className="policy-header">
          <h1>Cancellation & Refunds Policy</h1>
          <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="policy-content">
          <section>
            <h2>1. Order Cancellation</h2>
            <h3>1.1 Customer-Initiated Cancellation</h3>
            <ul>
              <li><strong>Before Food Preparation:</strong> Orders can be cancelled within 2 minutes of placement for a full refund</li>
              <li><strong>During Food Preparation:</strong> Orders can be cancelled up to 50% completion with a 50% refund</li>
              <li><strong>After Food Preparation:</strong> Orders cannot be cancelled once food preparation is complete</li>
              <li><strong>Pickup Orders:</strong> Must be cancelled at least 10 minutes before scheduled pickup time</li>
            </ul>

            <h3>1.2 Vendor-Initiated Cancellation</h3>
            <ul>
              <li>If a vendor cannot fulfill your order, you will receive a full refund</li>
              <li>Refunds for vendor cancellations are processed within 3-5 business days</li>
              <li>You will be notified immediately via SMS/email about the cancellation</li>
            </ul>
          </section>

          <section>
            <h2>2. Refund Eligibility</h2>
            <p>You are eligible for a refund in the following circumstances:</p>
            <ul>
              <li><strong>Order Cancellation:</strong> Within the allowed cancellation timeframe</li>
              <li><strong>Vendor Unavailability:</strong> When the vendor cannot fulfill your order</li>
              <li><strong>Food Quality Issues:</strong> Significantly substandard food quality (subject to verification)</li>
              <li><strong>Delivery Failure:</strong> When we fail to deliver within the committed time frame</li>
              <li><strong>Payment Errors:</strong> Duplicate charges or billing errors</li>
              <li><strong>Technical Issues:</strong> Platform errors that result in incorrect orders</li>
            </ul>
          </section>

          <section>
            <h2>3. Non-Refundable Situations</h2>
            <p>Refunds will NOT be provided in the following cases:</p>
            <ul>
              <li>Change of mind after food preparation has started</li>
              <li>Failure to collect pickup orders within the specified timeframe</li>
              <li>Unavailability at delivery location (for delivery orders)</li>
              <li>Dislike of taste (unless there's a genuine quality issue)</li>
              <li>Orders cancelled after the allowed cancellation period</li>
              <li>Allergic reactions (customers are responsible for informing about allergies)</li>
            </ul>
          </section>

          <section>
            <h2>4. Refund Process</h2>
            <h3>4.1 How to Request a Refund</h3>
            <ol>
              <li>Contact our customer support within 1 hour of order delivery/pickup</li>
              <li>Provide your order ID and reason for refund request</li>
              <li>Submit any required documentation (photos for quality issues)</li>
              <li>Wait for verification and approval from our team</li>
            </ol>

            <h3>4.2 Refund Timeline</h3>
            <ul>
              <li><strong>Immediate Cancellation:</strong> Instant refund to original payment method</li>
              <li><strong>Credit/Debit Cards:</strong> 3-7 business days</li>
              <li><strong>Digital Wallets:</strong> 24-48 hours</li>
              <li><strong>Net Banking:</strong> 2-5 business days</li>
            </ul>
          </section>

          <section>
            <h2>5. Quality Guarantee</h2>
            <p>We are committed to providing high-quality food. If you receive:</p>
            <ul>
              <li><strong>Cold Food:</strong> (When supposed to be hot) - Full refund or replacement</li>
              <li><strong>Wrong Order:</strong> - Full refund and correct order delivery</li>
              <li><strong>Missing Items:</strong> - Refund for missing items or immediate replacement</li>
              <li><strong>Damaged Packaging:</strong> - Refund if food safety is compromised</li>
            </ul>
          </section>

          <section>
            <h2>6. Special Circumstances</h2>
            <h3>6.1 Promotional Orders</h3>
            <ul>
              <li>Orders placed using promotional codes follow standard refund policies</li>
              <li>Promotional discounts will be adjusted accordingly in refunds</li>
              <li>Free items in combo offers are non-refundable individually</li>
            </ul>

            <h3>6.2 Group Orders</h3>
            <ul>
              <li>Individual items in group orders can be cancelled separately</li>
              <li>Partial refunds are available for individual cancellations</li>
              <li>Group order coordinators can cancel the entire order if notified in time</li>
            </ul>
          </section>

          <section>
            <h2>7. Dispute Resolution</h2>
            <p>If you're not satisfied with our refund decision:</p>
            <ol>
              <li>Contact our customer support manager</li>
              <li>Provide additional evidence or documentation</li>
              <li>We will review your case within 24-48 hours</li>
              <li>Final decisions will be communicated via email</li>
            </ol>
          </section>

          <section>
            <h2>8. Contact for Refunds</h2>
            <div className="contact-info">
              <p><strong>Customer Support:</strong> veerramjat333@gmail.com</p>
              <p><strong>Refund Helpline:</strong> +91-8306461994</p>
              <p><strong>WhatsApp Support:</strong> +91-8306461994</p>
              <p><strong>Address:</strong> A-25 Krishi Vihar Badarwas Jaipur, Rajasthan 302020</p>
              <p><strong>Office Hours:</strong> Monday to Sunday, 8:00 AM - 10:00 PM</p>
            </div>
          </section>

          <section>
            <h2>9. Policy Updates</h2>
            <p>
              This policy may be updated from time to time. Any changes will be communicated via email and will be 
              effective from the date of notification. Continued use of our service implies acceptance of the updated policy.
            </p>
          </section>
        </div>

        <footer className="policy-footer">
          <a href="/" className="back-home">← Back to Home</a>
        </footer>
      </div>
    </div>
  )
}

export default CancellationRefunds