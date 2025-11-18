import './ProviderList.css'

const providerIcons = {
  gmail: 'G',
  outlook: 'O',
  yahoo: 'Y',
}

const providerNames = {
  gmail: 'Gmail',
  outlook: 'Outlook',
  yahoo: 'Yahoo Mail',
}

function ProviderList({ providers, onConnect, loading }) {
  if (providers.length === 0) {
    return (
      <div className="provider-empty">
        <p>No providers available</p>
      </div>
    )
  }

  return (
    <div className="provider-list">
      {providers.map((provider) => (
        <div key={provider} className="provider-card">
          <div className="provider-icon">
            {providerIcons[provider] || provider.charAt(0).toUpperCase()}
          </div>
          <div className="provider-info">
            <h3>{providerNames[provider] || provider.charAt(0).toUpperCase() + provider.slice(1)}</h3>
            <p>Connect your {provider} account to continue</p>
          </div>
          <button
            onClick={() => onConnect(provider)}
            disabled={loading}
            className="connect-button"
          >
            {loading ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      ))}
    </div>
  )
}

export default ProviderList

