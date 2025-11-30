function Settings() {
    return (
        <div className="settings-page">
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Manage your account preferences</p>
            </div>

            <div className="card">
                <h3>Email Provider Integration</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: '12px', fontSize: '14px' }}>
                    Currently connected via OAuth. Future settings will appear here.
                </p>
            </div>

            <div className="card">
                <h3>Account Information</h3>
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Email</label>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-neutral)', fontWeight: '500' }}>user@example.com</p>
                    </div>
                    <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Provider</label>
                        <span className="source-badge">Google</span>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Status</label>
                        <span className="source-badge">Connected</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
