import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ErrorBoundary>
            <App />
            <Toaster
              position="top-center"
              reverseOrder={false}
              gutter={8}
              containerClassName=""
              containerStyle={{}}
              toastOptions={{
                className: '',
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#363636',
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  maxWidth: '500px',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#10b981',
                    color: '#fff',
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#10b981',
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                    background: '#ef4444',
                    color: '#fff',
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#ef4444',
                  },
                },
                loading: {
                  style: {
                    background: '#3b82f6',
                    color: '#fff',
                  },
                },
              }}
            />
        </ErrorBoundary>
    </StrictMode>,
)
