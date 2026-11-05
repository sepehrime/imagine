import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/**
 * Application entry point: mounts <App /> into #root (index.html).
 *
 * StrictMode renders components and runs effects twice in development only,
 * which surfaces effects that forget to clean up (timers, polling, listeners).
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
