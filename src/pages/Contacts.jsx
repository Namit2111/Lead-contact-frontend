import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ContactModal from '../components/ContactModal'
import './Contacts.css'

function Contacts() {
  const navigate = useNavigate()
  const location = useLocation()
  const [csvUploads, setCsvUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCsv, setSelectedCsv] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    // Get user ID from location state or localStorage
    const userData = location.state?.userData
    const savedUser = localStorage.getItem('user')
    
    if (userData?.id) {
      setUserId(userData.id)
      loadCsvUploads(userData.id)
    } else if (savedUser) {
      const user = JSON.parse(savedUser)
      setUserId(user.id)
      loadCsvUploads(user.id)
    } else {
      // No user data, redirect to home
      navigate('/')
    }
  }, [navigate, location])

  const loadCsvUploads = async (uid) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/contacts/uploads', {
        headers: {
          'X-User-Id': uid
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCsvUploads(data.uploads)
      } else {
        setError('Failed to load CSV uploads')
      }
    } catch (err) {
      console.error('Error loading CSV uploads:', err)
      setError('Failed to load CSV uploads')
    } finally {
      setLoading(false)
    }
  }

  const handleCsvClick = (csvSource) => {
    setSelectedCsv(csvSource)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCsv(null)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Lead Contact</h1>
        <p>Email Campaign Management Platform</p>
      </header>

      <main className="app-content">
        <div className="contacts-page-container">
          <div className="contacts-page-header">
            <div>
              <h2 className="contacts-page-title">Your CSV Uploads</h2>
              <p className="contacts-page-subtitle">
                Click on any CSV to view its contacts
              </p>
            </div>
            <button 
              className="back-button"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          </div>

          {loading && (
            <div className="contacts-page-loading">
              <div className="loading-spinner"></div>
              <p>Loading CSV uploads...</p>
            </div>
          )}

          {error && (
            <div className="contacts-page-error">
              <span className="error-icon">!</span>
              {error}
            </div>
          )}

          {!loading && !error && csvUploads.length === 0 && (
            <div className="contacts-page-empty">
              <div className="empty-icon">📁</div>
              <h3>No CSV uploads yet</h3>
              <p>Upload your first CSV file to get started</p>
              <button 
                className="empty-action-button"
                onClick={() => navigate(-1)}
              >
                Go back to upload
              </button>
            </div>
          )}

          {!loading && !error && csvUploads.length > 0 && (
            <div className="csv-uploads-grid">
              {csvUploads.map((upload, index) => (
                <div
                  key={index}
                  className="csv-upload-card"
                  onClick={() => handleCsvClick(upload.source)}
                >
                  <div className="csv-card-icon">📄</div>
                  <div className="csv-card-content">
                    <h3 className="csv-card-title">{upload.source}</h3>
                    <div className="csv-card-stats">
                      <div className="csv-card-stat">
                        <span className="stat-label">Contacts:</span>
                        <span className="stat-value">{upload.contact_count}</span>
                      </div>
                      <div className="csv-card-stat">
                        <span className="stat-label">Uploaded:</span>
                        <span className="stat-value">
                          {formatDate(upload.last_uploaded)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="csv-card-arrow">→</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        csvSource={selectedCsv}
        userId={userId}
      />
    </div>
  )
}

export default Contacts
