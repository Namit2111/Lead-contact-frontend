import { useState, useEffect } from 'react'

function Logs() {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [userId, setUserId] = useState(null)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 50

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            const user = JSON.parse(savedUser)
            setUserId(user.id)
            loadLogs(user.id, page)
        } else {
            setLoading(false)
        }
    }, [page])

    const loadLogs = async (uid, currentPage) => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/campaigns/logs?page=${currentPage}&page_size=${pageSize}`, {
                headers: { 'X-User-Id': uid }
            })

            if (response.ok) {
                const data = await response.json()
                setLogs(data.logs)
                setTotal(data.total)
            } else {
                setError('Failed to load logs')
            }
        } catch (err) {
            console.error('Error loading logs:', err)
            setError('Failed to load logs')
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
        return date.toLocaleDateString()
    }

    const getStatusBadge = (status) => {
        const styles = {
            sent: { background: '#f0fdf4', color: '#166534', border: '1px solid #dcfce7' },
            failed: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fee2e2' },
            pending: { background: '#fafafa', color: '#737373', border: '1px solid #e5e5e5' }
        }
        const style = styles[status] || styles.pending
        return (
            <span style={{
                ...style,
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '500'
            }}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        )
    }

    if (loading && logs.length === 0) {
        return (
            <div className="logs-page">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="loading-spinner"></div>
                    <p style={{ color: '#737373', marginTop: '16px' }}>Loading logs...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="logs-page">
            <div className="page-header">
                <h1 className="page-title">Email Logs</h1>
                <p className="page-subtitle">Track sent emails and delivery status</p>
            </div>

            {error && (
                <div style={{ padding: '12px', background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '6px', marginBottom: '16px', color: '#000000' }}>
                    {error}
                </div>
            )}

            <div className="card">
                {logs.length === 0 ? (
                    <p style={{ color: '#737373', fontStyle: 'italic', textAlign: 'center', padding: '40px' }}>
                        No email logs yet. Send your first campaign to see logs here.
                    </p>
                ) : (
                    <>
                        <div className="contacts-table-container">
                            <table className="contacts-table">
                                <thead>
                                    <tr>
                                        <th>Recipient</th>
                                        <th>Subject</th>
                                        <th>Status</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.id}>
                                            <td className="email-cell">{log.to_email}</td>
                                            <td>{log.subject}</td>
                                            <td>{getStatusBadge(log.status)}</td>
                                            <td className="date-cell">
                                                {log.sent_at ? formatDate(log.sent_at) : formatDate(log.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {total > pageSize && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e5e5' }}>
                                <div style={{ fontSize: '14px', color: '#737373' }}>
                                    Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className="btn-secondary"
                                        style={{ padding: '8px 16px' }}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page * pageSize >= total}
                                        className="pagination-btn"
                                        style={{ padding: '8px 16px' }}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Logs
