import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import CsvUpload from '../components/CsvUpload'
import '../App.css'

function Success() {
  const navigate = useNavigate()
  const location = useLocation()
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [contactStats, setContactStats] = useState(null)

  useEffect(() => {
    // Get data from router state
    const data = location.state?.connectionData
    
    console.log('Success page loaded, data:', data)
    
    if (data) {
      setConnectionStatus(data)
      // Load contact stats
      loadContactStats(data.user.id)
    } else {
      // No connection data, redirect to home
      console.log('No connection data found, redirecting to home')
      navigate('/')
    }
  }, [navigate, location])

  const loadContactStats = async (userId) => {
    try {
      const response = await fetch('/api/contacts/stats', {
        headers: {
          'X-User-Id': userId
        }
      })
      if (response.ok) {
        const data = await response.json()
        setContactStats(data)
      }
    } catch (err) {
      console.error('Error loading contact stats:', err)
    }
  }

  const handleUploadComplete = (uploadResult) => {
    console.log('Upload completed:', uploadResult)
    // Refresh stats after successful upload
    if (connectionStatus?.user?.id) {
      loadContactStats(connectionStatus.user.id)
    }
  }

  if (!connectionStatus) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Lead Contact</h1>
          <p>Email Campaign Management Platform</p>
        </header>
        <main className="app-content">
          <div className="connect-container">
            <div className="loading-spinner"></div>
            <h2 className="connect-title">Loading...</h2>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Lead Contact</h1>
        <p>Email Campaign Management Platform</p>
      </header>

      <main className="app-content">
        <div className="connected-container">
          <div className="success-icon">✓</div>
          <h2 className="connected-title">Successfully Connected</h2>
          <p className="connected-subtitle">
            Your account has been connected and authenticated
          </p>

          <div className="user-card">
            <h3>Account Information</h3>
            <div className="user-info">
              <div className="user-info-row">
                <span className="user-info-label">Provider</span>
                <span className="provider-badge">{connectionStatus.provider}</span>
              </div>
              <div className="user-info-row">
                <span className="user-info-label">Name</span>
                <span className="user-info-value">{connectionStatus.user.name}</span>
              </div>
              <div className="user-info-row">
                <span className="user-info-label">Email</span>
                <span className="user-info-value">{connectionStatus.user.email}</span>
              </div>
              {contactStats && (
                <div className="user-info-row">
                  <span className="user-info-label">Total Contacts</span>
                  <span className="user-info-value">{contactStats.total_contacts}</span>
                </div>
              )}
            </div>
          </div>

          {/* CSV Upload Component */}
          <CsvUpload 
            userId={connectionStatus.user.id}
            onUploadComplete={handleUploadComplete}
          />
        </div>
      </main>
    </div>
  )
}

export default Success

