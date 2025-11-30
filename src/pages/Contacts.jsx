import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import CsvUpload from '../components/CsvUpload'
import ContactModal from '../components/ContactModal'
import './Contacts.css'

function Contacts() {
  const navigate = useNavigate()
  const location = useLocation()
  const [csvUploads, setCsvUploads] = useState([])
  const [filteredUploads, setFilteredUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userId, setUserId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedCsv, setSelectedCsv] = useState(null)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

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

  useEffect(() => {
    // Filter uploads based on search query
    if (searchQuery.trim() === '') {
      setFilteredUploads(csvUploads)
    } else {
      const filtered = csvUploads.filter(upload =>
        upload.source.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredUploads(filtered)
    }
  }, [searchQuery, csvUploads])

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
        setFilteredUploads(data.uploads)
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

  const handleUploadComplete = () => {
    setShowUploadModal(false)
    if (userId) {
      loadCsvUploads(userId)
    }
  }

  const handleViewContacts = (csvSource) => {
    setSelectedCsv(csvSource)
    setIsContactModalOpen(true)
  }

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false)
    setSelectedCsv(null)
  }

  const handleDeleteCsv = async (source) => {
    if (!window.confirm(`Are you sure you want to delete all contacts from "${source}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/contacts/by-source/${encodeURIComponent(source)}`, {
        method: 'DELETE',
        headers: {
          'X-User-Id': userId
        }
      })

      if (response.ok) {
        // Reload the CSV uploads list
        loadCsvUploads(userId)
      } else {
        const data = await response.json()
        alert(data.detail || 'Failed to delete contacts')
      }
    } catch (err) {
      console.error('Error deleting CSV:', err)
      alert('Failed to delete contacts. Please try again.')
    }
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
    <div className="contacts-page">
      <div className="page-header">
        <h1 className="page-title">CSV Uploads</h1>
        <p className="page-subtitle">Manage your uploaded contact files</p>
      </div>

      {/* Search and Upload Bar */}
      <div className="contacts-toolbar">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          className="upload-button"
          onClick={() => setShowUploadModal(true)}
        >
          Upload CSV
        </button>
      </div>

      {/* CSV Uploads Table */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading CSV uploads...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <span className="error-icon">!</span>
          {error}
        </div>
      )}

      {!loading && !error && filteredUploads.length === 0 && searchQuery === '' && (
        <div className="empty-state">
          <h3>No CSV uploads yet</h3>
          <p>Upload your first CSV file to get started</p>
          <button
            className="empty-action-button"
            onClick={() => setShowUploadModal(true)}
          >
            Upload CSV
          </button>
        </div>
      )}

      {!loading && !error && filteredUploads.length === 0 && searchQuery !== '' && (
        <div className="empty-state">
          <h3>No results found</h3>
          <p>No CSV files match "{searchQuery}"</p>
        </div>
      )}

      {!loading && !error && filteredUploads.length > 0 && (
        <div className="table-container">
          <table className="csv-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Contact Count</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUploads.map((upload, index) => (
                <tr key={index}>
                  <td className="filename-cell">
                    {upload.source}
                  </td>
                  <td className="count-cell">{upload.contact_count}</td>
                  <td className="date-cell">{formatDate(upload.last_uploaded)}</td>
                  <td className="actions-cell">
                    <button
                      className="view-button"
                      onClick={() => handleViewContacts(upload.source)}
                      title="View contacts"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteCsv(upload.source)}
                      title="Delete all contacts from this file"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload CSV File</h2>
              <button
                className="modal-close"
                onClick={() => setShowUploadModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {userId && (
                <CsvUpload
                  userId={userId}
                  onUploadComplete={handleUploadComplete}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
        csvSource={selectedCsv}
        userId={userId}
      />
    </div>
  )
}

export default Contacts
