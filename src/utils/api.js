/**
 * Get the base API URL
 * In development, uses relative paths (proxied by Vite)
 * In production, uses the VITE_BACKEND_URL environment variable
 */
const getApiUrl = () => {
  // In production, use the backend URL from environment variables
  if (import.meta.env.PROD && import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL
  }
  // In development, use relative paths (Vite proxy handles it)
  return ''
}

/**
 * Constructs a full API URL
 * @param {string} endpoint - API endpoint (e.g., '/providers' or 'providers')
 * @returns {string} Full API URL
 */
export const apiUrl = (endpoint) => {
  const baseUrl = getApiUrl()
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  
  // If we have a base URL, append the endpoint
  // Otherwise, return the endpoint as-is (for Vite proxy)
  return baseUrl ? `${baseUrl}${cleanEndpoint}` : cleanEndpoint
}

/**
 * Fetch wrapper that automatically uses the correct API URL
 * @param {string} endpoint - API endpoint
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = apiUrl(endpoint)
  return fetch(url, options)
}

