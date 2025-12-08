import { useState, useEffect } from 'react'
import ProviderList from '../components/ProviderList'
import { apiUrl } from '../utils/api'
import '../App.css'

function Home() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      const response = await fetch(apiUrl('/api/providers'))
      const data = await response.json()
      setProviders(data)
    } catch (err) {
      console.error('Error fetching providers:', err)
      setError('Failed to fetch providers')
    }
  }

  const handleConnect = async (provider) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(apiUrl(`/api/auth/${provider}/url?state=${provider}`))
      const data = await response.json()
      
      if (response.ok) {
        window.location.href = data.auth_url
      } else {
        setError(data.detail || 'Failed to generate auth URL')
      }
    } catch (err) {
      console.error('Error connecting:', err)
      setError('Failed to initiate authentication')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Lead Contact</h1>
        <p>Email Campaign Management Platform</p>
      </header>

      <main className="app-content">
        <div className="connect-container">
          <h2 className="connect-title">Connect Your Account</h2>
          <p className="connect-subtitle">
            Choose a provider below to connect your account and start managing your email campaigns
          </p>

          {error && (
            <div className="alert">
              <span>{error}</span>
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}

          <ProviderList 
            providers={providers}
            onConnect={handleConnect}
            loading={loading}
          />
        </div>
      </main>
    </div>
  )
}

export default Home

