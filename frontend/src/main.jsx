import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ScanProvider } from './context/ScanContext.jsx'
import { ToastProvider } from './components/ui/Toast.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ScanProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ScanProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
