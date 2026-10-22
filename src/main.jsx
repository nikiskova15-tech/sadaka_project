// Entry: mounts the Sadaka SPA (Home shows immediately on npm run dev).
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

