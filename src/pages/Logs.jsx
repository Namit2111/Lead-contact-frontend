function Logs() {
    return (
        <div className="logs-page">
            <div className="page-header">
                <h1 className="page-title">Email Logs</h1>
                <p className="page-subtitle">Track sent emails and delivery status</p>
            </div>

            <div className="card">
                <div className="contacts-table-container">
                    <table className="contacts-table">
                        <thead>
                            <tr>
                                <th>Recipient</th>
                                <th>Template</th>
                                <th>Status</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="email-cell">john@example.com</td>
                                <td>Welcome Email</td>
                                <td>
                                    <span className="source-badge">Sent</span>
                                </td>
                                <td className="date-cell">2 mins ago</td>
                            </tr>
                            {/* Placeholder rows */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Logs
