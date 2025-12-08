import { useState, useEffect } from 'react'
import { apiUrl } from '../utils/api'

function Templates() {
    const [templates, setTemplates] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [currentTemplate, setCurrentTemplate] = useState({ id: null, name: '', subject: '', body: '' })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        // Get user from localStorage
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            const user = JSON.parse(savedUser)
            setUserId(user.id)
            loadTemplates(user.id)
        } else {
            setLoading(false)
        }
    }, [])

    const loadTemplates = async (uid) => {
        setLoading(true)
        setError(null)
        
        try {
            const response = await fetch(apiUrl('/api/templates'), {
                headers: { 'X-User-Id': uid }
            })
            
            if (response.ok) {
                const data = await response.json()
                setTemplates(data.templates)
            } else {
                setError('Failed to load templates')
            }
        } catch (err) {
            console.error('Error loading templates:', err)
            setError('Failed to load templates')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!userId) return
        
        try {
            const url = currentTemplate.id 
                ? apiUrl(`/api/templates/${currentTemplate.id}`)
                : apiUrl('/api/templates')
            
            const method = currentTemplate.id ? 'PUT' : 'POST'
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': userId
                },
                body: JSON.stringify({
                    name: currentTemplate.name,
                    subject: currentTemplate.subject,
                    body: currentTemplate.body
                })
            })
            
            if (response.ok) {
                await loadTemplates(userId)
                setIsEditing(false)
                setCurrentTemplate({ id: null, name: '', subject: '', body: '' })
            } else {
                const data = await response.json()
                alert(data.detail || 'Failed to save template')
            }
        } catch (err) {
            console.error('Error saving template:', err)
            alert('Failed to save template')
        }
    }

    const handleEdit = (template) => {
        setCurrentTemplate({
            id: template.id,
            name: template.name,
            subject: template.subject,
            body: template.body
        })
        setIsEditing(true)
    }

    const handleDelete = async (templateId) => {
        if (!confirm('Are you sure you want to delete this template?')) return
        
        try {
            const response = await fetch(apiUrl(`/api/templates/${templateId}`), {
                method: 'DELETE',
                headers: { 'X-User-Id': userId }
            })
            
            if (response.ok) {
                await loadTemplates(userId)
            } else {
                alert('Failed to delete template')
            }
        } catch (err) {
            console.error('Error deleting template:', err)
            alert('Failed to delete template')
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setCurrentTemplate({ id: null, name: '', subject: '', body: '' })
    }

    if (loading) {
        return (
            <div className="templates-page">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="loading-spinner"></div>
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: '16px' }}>Loading templates...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="templates-page">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Templates</h1>
                    <p className="page-subtitle">Create and manage email templates</p>
                </div>
                {!isEditing && (
                    <button
                        className="pagination-btn"
                        onClick={() => setIsEditing(true)}
                        style={{ padding: '12px 24px' }}
                    >
                        Create Template
                    </button>
                )}
            </div>

            {error && (
                <div style={{ padding: '12px', background: 'var(--color-bg-warm)', border: '1px solid var(--color-border)', borderRadius: '6px', marginBottom: '16px', color: 'var(--color-text-neutral)' }}>
                    {error}
                </div>
            )}

            {isEditing ? (
                <div className="card">
                    <h3>{currentTemplate.id ? 'Edit Template' : 'New Template'}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: 'var(--color-text-neutral)' }}>Template Name</label>
                            <input
                                type="text"
                                value={currentTemplate.name}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--color-border)',
                                    fontSize: '14px',
                                    fontFamily: 'inherit'
                                }}
                                placeholder="e.g., Welcome Email"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: 'var(--color-text-neutral)' }}>Subject Line</label>
                            <input
                                type="text"
                                value={currentTemplate.subject}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, subject: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--color-border)',
                                    fontSize: '14px',
                                    fontFamily: 'inherit'
                                }}
                                placeholder="e.g., Welcome to our service!"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: 'var(--color-text-neutral)' }}>Email Body</label>
                            <textarea
                                value={currentTemplate.body}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, body: e.target.value })}
                                style={{
                                    width: '100%',
                                    minHeight: '200px',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--color-border)',
                                    fontFamily: 'inherit',
                                    fontSize: '14px',
                                    resize: 'vertical'
                                }}
                                placeholder="Hello {{name}}, ..."
                            />
                            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
                                Use <code style={{ background: 'var(--color-bg-warm)', padding: '2px 6px', borderRadius: '3px' }}>{`{{variable}}`}</code> to insert dynamic content.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
                            <button
                                onClick={handleSave}
                                className="pagination-btn"
                                style={{ padding: '12px 24px' }}
                                disabled={!currentTemplate.name || !currentTemplate.subject || !currentTemplate.body}
                            >
                                {currentTemplate.id ? 'Update Template' : 'Save Template'}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="btn-secondary"
                                style={{ padding: '12px 24px' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card">
                    {templates.length === 0 ? (
                        <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: '40px' }}>
                            No templates created yet. Click "Create Template" to get started.
                        </p>
                    ) : (
                        <div className="contacts-table-container">
                            <table className="contacts-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {templates.map((t) => (
                                        <tr key={t.id}>
                                            <td>{t.name}</td>
                                            <td className="date-cell">{new Date(t.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <button 
                                                    className="delete-btn" 
                                                    style={{ marginRight: '8px' }}
                                                    onClick={() => handleEdit(t)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="delete-btn"
                                                    onClick={() => handleDelete(t.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Templates
