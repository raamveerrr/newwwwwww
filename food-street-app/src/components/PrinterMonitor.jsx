import React, { useState, useEffect } from 'react'
import { printerService } from '../PrinterService'

// Real-time printer system monitoring component
export default function PrinterMonitor() {
  const [systemStatus, setSystemStatus] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Update status every 2 seconds
    const interval = setInterval(() => {
      const status = printerService.getSystemStatus()
      setSystemStatus(status)
    }, 2000)

    // Initial load
    setSystemStatus(printerService.getSystemStatus())

    return () => clearInterval(interval)
  }, [])

  if (!systemStatus) {
    return <div className="printer-monitor loading">Loading printer status...</div>
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy': return '#10b981'
      case 'Degraded': return '#f59e0b'
      case 'Critical': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getCircuitColor = (state) => {
    switch (state) {
      case 'closed': return '#10b981'
      case 'half-open': return '#f59e0b'
      case 'open': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className="printer-monitor">
      <div 
        className="monitor-header" 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer' }}
      >
        <div className="status-indicator">
          <div 
            className="status-dot"
            style={{ 
              backgroundColor: getStatusColor(systemStatus.overallHealth.status),
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              display: 'inline-block',
              marginRight: '8px'
            }}
          />
          <span>Printer System: {systemStatus.overallHealth.status}</span>
        </div>
        <span>{isExpanded ? '▼' : '▶'}</span>
      </div>

      {isExpanded && (
        <div className="monitor-details">
          <div className="system-overview">
            <h4>System Overview</h4>
            <p>Mode: {systemStatus.mode}</p>
            <p>Healthy Shops: {systemStatus.overallHealth.healthyShops}</p>
            <p>Total Queue Length: {systemStatus.overallHealth.totalQueueLength}</p>
            <p>Last Updated: {new Date(systemStatus.timestamp).toLocaleTimeString()}</p>
          </div>

          <div className="shops-grid">
            {Object.entries(systemStatus.shops).map(([shopId, shopStatus]) => (
              <div key={shopId} className="shop-card">
                <div className="shop-header">
                  <h5>{shopId.toUpperCase()}</h5>
                  <div 
                    className="circuit-indicator"
                    style={{ 
                      backgroundColor: getCircuitColor(shopStatus.circuitState),
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%'
                    }}
                  />
                </div>
                <div className="shop-metrics">
                  <div className="metric">
                    <span>Queue:</span> 
                    <strong>{shopStatus.queueLength}</strong>
                  </div>
                  <div className="metric">
                    <span>Active:</span> 
                    <strong>{shopStatus.activeConnections}</strong>
                  </div>
                  <div className="metric">
                    <span>Success Rate:</span> 
                    <strong>{shopStatus.successRate}</strong>
                  </div>
                  <div className="metric">
                    <span>Avg Time:</span> 
                    <strong>{shopStatus.avgResponseTime}</strong>
                  </div>
                  <div className="metric">
                    <span>Failures:</span> 
                    <strong>{shopStatus.failures}</strong>
                  </div>
                  <div className="metric">
                    <span>Last Failure:</span> 
                    <strong>{shopStatus.lastFailure}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="monitor-actions">
            <button 
              onClick={() => {
                printerService.emergencyFlushQueues()
                alert('All print queues have been flushed!')
              }}
              className="emergency-button"
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🚨 Emergency Flush Queues
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .printer-monitor {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          z-index: 1000;
        }

        .monitor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .monitor-details {
          padding: 16px;
          max-height: 400px;
          overflow-y: auto;
        }

        .system-overview {
          margin-bottom: 16px;
          padding: 12px;
          background: #f3f4f6;
          border-radius: 4px;
        }

        .system-overview h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .system-overview p {
          margin: 4px 0;
          font-size: 12px;
          color: #374151;
        }

        .shops-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .shop-card {
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 8px;
          background: #fafafa;
        }

        .shop-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .shop-header h5 {
          margin: 0;
          font-size: 12px;
          font-weight: 600;
        }

        .shop-metrics {
          font-size: 10px;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          margin: 2px 0;
        }

        .metric span {
          color: #6b7280;
        }

        .monitor-actions {
          text-align: center;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
        }

        .emergency-button:hover {
          background-color: #dc2626 !important;
        }
      `}</style>
    </div>
  )
}