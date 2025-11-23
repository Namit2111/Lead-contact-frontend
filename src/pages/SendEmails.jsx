import { useState, useEffect } from 'react'

function SendEmails() {
    const [step, setStep] = useState(1)
    const [selectedBatch, setSelectedBatch] = useState('')
    const [selectedTemplate, setSelectedTemplate] = useState('')
    const [csvUploads, setCsvUploads] = useState([])
    const [templates, setTemplates] = useState([])
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [sending, setSending] = useState(false)
    const [result, setResult] = useState(null)
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            const user = JSON.parse(savedUser)
            setUserId(user.id)
            loadData(user.id)
        }
    }, [])

    const loadData = async (uid) => {
        try {
            // Load CSV uploads
            const csvResponse = await fetch('/api/contacts/uploads', {
                headers: { 'X-User-Id': uid }
            })
            if (csvResponse.ok) {
                const csvData = await csvResponse.json()
                setCsvUploads(csvData.uploads)
            }

            // Load templates
            const templateResponse = await fetch('/api/templates', {
                headers: { 'X-User-Id': uid }
            })
            if (templateResponse.ok) {
                const templateData = await templateResponse.json()
                setTemplates(templateData.templates)
            }
        } catch (err) {
            console.error('Error loading data:', err)
        }
    }

    const loadPreview = async () => {
        if (!selectedBatch || !selectedTemplate || !userId) return
        
        setLoading(true)
        try {
            const response = await fetch('/api/campaigns/preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': userId
                },
                body: JSON.stringify({
                    csv_source: selectedBatch,
                    template_id: selectedTemplate
                })
            })
            
            if (response.ok) {
                const data = await response.json()
                setPreview(data)
            } else {
                alert('Failed to load preview')
            }
        } catch (err) {
            console.error('Error loading preview:', err)
            alert('Failed to load preview')
        } finally {
            setLoading(false)
        }
    }

    const handleNext = () => {
        if (step === 2) {
            loadPreview()
        }
        setStep(step + 1)
    }
    
    const handleBack = () => setStep(step - 1)

    const handleSendCampaign = async () => {
        if (!userId || !selectedBatch || !selectedTemplate) return
        
        setSending(true)
        try {
            const response = await fetch('/api/campaigns/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': userId
                },
                body: JSON.stringify({
                    csv_source: selectedBatch,
                    template_id: selectedTemplate
                })
            })
            
            const data = await response.json()
            setResult(data)
        } catch (err) {
            console.error('Error sending campaign:', err)
            alert('Failed to send campaign')
        } finally {
            setSending(false)
        }
    }

    const stepLabels = ['Select Batch', 'Select Template', 'Preview', 'Send']

    const selectedCsvName = csvUploads.find(c => c.source === selectedBatch)?.source || ''
    const selectedTemplateName = templates.find(t => t.id === selectedTemplate)?.name || ''
    const contactCount = csvUploads.find(c => c.source === selectedBatch)?.contact_count || 0

    return (
        <div className="send-emails-page">
            <div className="page-header">
                <h1 className="page-title">Send Emails</h1>
                <p className="page-subtitle">Launch your email campaign</p>
            </div>

            {/* Progress Steps */}
            <div style={{ display: 'flex', marginBottom: '32px', gap: '12px' }}>
                {[1, 2, 3, 4].map(s => (
                    <div key={s} style={{
                        flex: 1,
                        padding: '16px 12px',
                        background: step >= s ? '#000000' : '#ffffff',
                        color: step >= s ? '#ffffff' : '#737373',
                        border: `1px solid ${step >= s ? '#000000' : '#e5e5e5'}`,
                        borderRadius: '6px',
                        fontWeight: '500',
                        fontSize: '14px',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                    }}>
                        Step {s}: {stepLabels[s - 1]}
                    </div>
                ))}
            </div>

            <div className="card">
                {step === 1 && (
                    <div>
                        <h3>Select Contact Batch</h3>
                        <div style={{ marginTop: '24px' }}>
                            <select
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    background: '#ffffff'
                                }}
                            >
                                <option value="">-- Select a CSV Batch --</option>
                                {csvUploads.map((upload) => (
                                    <option key={upload.source} value={upload.source}>
                                        {upload.source} ({upload.contact_count} contacts)
                                    </option>
                                ))}
                            </select>
                            {csvUploads.length === 0 && (
                                <p style={{ marginTop: '12px', color: '#737373', fontSize: '14px' }}>
                                    No CSV uploads found. Please upload contacts first.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h3>Select Email Template</h3>
                        <div style={{ marginTop: '24px' }}>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => setSelectedTemplate(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    background: '#ffffff'
                                }}
                            >
                                <option value="">-- Select a Template --</option>
                                {templates.map((template) => (
                                    <option key={template.id} value={template.id}>
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                            {templates.length === 0 && (
                                <p style={{ marginTop: '12px', color: '#737373', fontSize: '14px' }}>
                                    No templates found. Please create a template first.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h3>Preview Campaign</h3>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <div className="loading-spinner"></div>
                                <p style={{ color: '#737373', marginTop: '16px' }}>Loading preview...</p>
                            </div>
                        ) : preview ? (
                            <div style={{
                                marginTop: '24px',
                                padding: '24px',
                                border: '1px solid #e5e5e5',
                                borderRadius: '6px',
                                background: '#fafafa'
                            }}>
                                <p style={{ marginBottom: '12px' }}><strong>To:</strong> {preview.to}</p>
                                <p style={{ marginBottom: '12px' }}><strong>Subject:</strong> {preview.subject}</p>
                                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e5e5e5' }} />
                                <div style={{ minHeight: '100px', color: '#171717', whiteSpace: 'pre-wrap' }}>
                                    {preview.body}
                                </div>
                                <p style={{ marginTop: '16px', fontSize: '13px', color: '#737373' }}>
                                    Preview shown with first contact from {selectedCsvName}
                                </p>
                            </div>
                        ) : (
                            <p style={{ marginTop: '24px', color: '#737373' }}>No preview available</p>
                        )}
                    </div>
                )}

                {step === 4 && !result && (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <h3 style={{ marginBottom: '16px' }}>Ready to Launch?</h3>
                        <p style={{ color: '#737373', marginBottom: '8px' }}>
                            You are about to send emails to <strong>{contactCount} contacts</strong>.
                        </p>
                        <p style={{ color: '#737373', marginBottom: '32px', fontSize: '14px' }}>
                            CSV: {selectedCsvName}<br/>
                            Template: {selectedTemplateName}
                        </p>
                        <button
                            className="pagination-btn"
                            style={{ padding: '16px 48px', fontSize: '16px' }}
                            onClick={handleSendCampaign}
                            disabled={sending}
                        >
                            {sending ? 'Sending...' : 'Send Campaign'}
                        </button>
                    </div>
                )}

                {step === 4 && result && (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                            {result.success ? '✓' : '✕'}
                        </div>
                        <h3 style={{ marginBottom: '16px' }}>
                            {result.success ? 'Campaign Sent!' : 'Campaign Failed'}
                        </h3>
                        <p style={{ color: '#737373', marginBottom: '24px' }}>
                            {result.message}
                        </p>
                        <div style={{ display: 'inline-flex', gap: '24px', marginBottom: '32px' }}>
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: '600' }}>{result.sent}</div>
                                <div style={{ fontSize: '14px', color: '#737373' }}>Sent</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: '600' }}>{result.failed}</div>
                                <div style={{ fontSize: '14px', color: '#737373' }}>Failed</div>
                            </div>
                        </div>
                        <button
                            className="pagination-btn"
                            onClick={() => window.location.href = '/logs'}
                            style={{ padding: '12px 32px' }}
                        >
                            View Logs
                        </button>
                    </div>
                )}

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '32px',
                    borderTop: '1px solid #e5e5e5',
                    paddingTop: '24px'
                }}>
                    <button
                        onClick={handleBack}
                        disabled={step === 1}
                        className="btn-secondary"
                        style={{ padding: '12px 24px' }}
                    >
                        Back
                    </button>
                    {step < 4 && (
                        <button
                            onClick={handleNext}
                            className="pagination-btn"
                            style={{ padding: '12px 24px' }}
                            disabled={
                                (step === 1 && !selectedBatch) ||
                                (step === 2 && !selectedTemplate)
                            }
                        >
                            Next Step
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SendEmails
