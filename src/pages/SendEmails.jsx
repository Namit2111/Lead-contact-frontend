import { useState } from 'react'

function SendEmails() {
    const [step, setStep] = useState(1)
    const [selectedBatch, setSelectedBatch] = useState('')
    const [selectedTemplate, setSelectedTemplate] = useState('')

    const handleNext = () => setStep(step + 1)
    const handleBack = () => setStep(step - 1)

    const stepLabels = ['Select Batch', 'Select Template', 'Preview', 'Send']

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
                                <option value="1">Batch #1 (Uploaded Today)</option>
                            </select>
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
                                <option value="1">Welcome Email</option>
                            </select>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h3>Preview Campaign</h3>
                        <div style={{
                            marginTop: '24px',
                            padding: '24px',
                            border: '1px solid #e5e5e5',
                            borderRadius: '6px',
                            background: '#fafafa'
                        }}>
                            <p style={{ marginBottom: '12px' }}><strong>To:</strong> john@example.com</p>
                            <p style={{ marginBottom: '12px' }}><strong>Subject:</strong> Welcome to our service!</p>
                            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e5e5e5' }} />
                            <div style={{ minHeight: '100px', color: '#171717' }}>
                                Hello John, ...
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <h3 style={{ marginBottom: '16px' }}>Ready to Launch?</h3>
                        <p style={{ color: '#737373', marginBottom: '32px' }}>
                            You are about to send emails to <strong>50 contacts</strong>.
                        </p>
                        <button
                            className="pagination-btn"
                            style={{ padding: '16px 48px', fontSize: '16px' }}
                        >
                            Send Campaign
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
