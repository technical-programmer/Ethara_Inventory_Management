import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#FFFFFF',
          color: '#1C2A3A',
          border: '1px solid #E4E0D6',
          borderRadius: '10px',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
          padding: '10px 14px',
        },
        success: {
          iconTheme: { primary: '#5B7A5B', secondary: '#FFFFFF' },
        },
        error: {
          iconTheme: { primary: '#B4453B', secondary: '#FFFFFF' },
        },
      }}
    />
  </StrictMode>,
)