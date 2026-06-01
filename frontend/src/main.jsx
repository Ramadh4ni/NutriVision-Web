import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ScanProvider } from './context/ScanContext.jsx'
import { ToastProvider } from './components/ui/Toast.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ScanProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ScanProvider>
  </StrictMode>,
)
