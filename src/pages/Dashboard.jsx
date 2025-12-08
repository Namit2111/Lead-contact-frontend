import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiUrl } from '../utils/api'

function Dashboard() {
    const location = useLocation()
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        total_contacts: 0,
        total_templates: 0,
        emails_sent: 0,
        csv_uploads: 0
    })
    const [user, setUser] = useState(null)

    useEffect(() => {
        // Try to get user data from location state or localStorage
        const connectionData = location.state?.connectionData
        if (connectionData) {
            setUser(connectionData.user)
            // In a real app, we'd persist this to context/localStorage
            localStorage.setItem('user', JSON.stringify(connectionData.user))
        } else {
            const savedUser = localStorage.getItem('user')
            if (savedUser) {
                setUser(JSON.parse(savedUser))
            }
        }

        // Fetch stats
        fetchStats()
    }, [location])

    const fetchStats = async () => {
        // TODO: Implement actual stats endpoint
        // For now, we'll mock or use what we have
        try {
            // Mock stats for MVP
            setStats({
                total_contacts: 0,
                total_templates: 0,
                emails_sent: 0,
                csv_uploads: 0
            })

            // If we have a user ID, we could fetch real contact count
            const savedUser = JSON.parse(localStorage.getItem('user'))
            if (savedUser?.id) {
                // Fetch contact stats
                const statsResponse = await fetch(apiUrl('/api/contacts/stats'), {
                    headers: { 'X-User-Id': savedUser.id }
                })
                if (statsResponse.ok) {
                    const statsData = await statsResponse.json()
                    const uploadsCount = Object.keys(statsData.sources || {}).length
                    setStats(prev => ({
                        ...prev,
                        total_contacts: statsData.total_contacts,
                        csv_uploads: uploadsCount
                    }))
                }
            }
        } catch (err) {
            console.error('Error fetching stats:', err)
        }
    }

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Welcome back, {user?.name || 'User'}</p>
            </div>

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                <div className="card stat-card">
                    <h3>Total Contacts</h3>
                    <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: '600', color: 'var(--color-text-neutral)', marginTop: '12px' }}>
                        {stats.total_contacts}
                    </div>
                </div>
                <div className="card stat-card">
                    <h3>CSV Uploads</h3>
                    <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: '600', color: 'var(--color-text-neutral)', marginTop: '12px' }}>
                        {stats.csv_uploads}
                    </div>
                </div>
                <div className="card stat-card">
                    <h3>Templates</h3>
                    <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: '600', color: 'var(--color-text-neutral)', marginTop: '12px' }}>
                        {stats.total_templates}
                    </div>
                </div>
                <div className="card stat-card">
                    <h3>Emails Sent</h3>
                    <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: '600', color: 'var(--color-text-neutral)', marginTop: '12px' }}>
                        {stats.emails_sent}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
