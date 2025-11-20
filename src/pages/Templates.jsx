import { useState } from 'react'

function Templates() {
    const [templates, setTemplates] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [currentTemplate, setCurrentTemplate] = useState({ name: '', subject: '', body: '' })

    const handleSave = () => {
        // TODO: Save to backend
        setTemplates([...templates, { ...currentTemplate, id: Date.now(), createdAt: new Date().toLocaleDateString() }])
        setIsEditing(false)
        setCurrentTemplate({ name: '', subject: '', body: '' })
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

            {isEditing ? (
                <div className="card">
                    <h3>{currentTemplate.id ? 'Edit Template' : 'New Template'}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#000000' }}>Template Name</label>
                            <input
                                type="text"
                                value={currentTemplate.name}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '14px',
                                    fontFamily: 'inherit'
                                }}
                                placeholder="e.g., Welcome Email"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#000000' }}>Subject Line</label>
                            <input
                                type="text"
                                value={currentTemplate.subject}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, subject: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '14px',
                                    fontFamily: 'inherit'
                                }}
                                placeholder="e.g., Welcome to our service!"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#000000' }}>Email Body</label>
                            <textarea
                                value={currentTemplate.body}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, body: e.target.value })}
                                style={{
                                    width: '100%',
                                    minHeight: '200px',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    border: '1px solid #e5e5e5',
                                    fontFamily: 'inherit',
                                    fontSize: '14px',
                                    resize: 'vertical'
                                }}
                                placeholder="Hello {{name}}, ..."
                            />
                            <p style={{ fontSize: '13px', color: '#737373', marginTop: '8px' }}>
                                Use <code style={{ background: '#fafafa', padding: '2px 6px', borderRadius: '3px' }}>{`{{variable}}`}</code> to insert dynamic content.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', paddingTop: '20px', borderTop: '1px solid #e5e5e5' }}>
                            <button
                                onClick={handleSave}
                                className="pagination-btn"
                                style={{ padding: '12px 24px' }}
                            >
                                Save Template
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
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
                        <p style={{ color: '#737373', fontStyle: 'italic', textAlign: 'center', padding: '40px' }}>
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
                                    {templates.map((t, i) => (
                                        <tr key={i}>
                                            <td>{t.name}</td>
                                            <td className="date-cell">{t.createdAt}</td>
                                            <td>
                                                <button className="delete-btn" style={{ marginRight: '8px' }}>Edit</button>
                                                <button className="delete-btn">Delete</button>
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
