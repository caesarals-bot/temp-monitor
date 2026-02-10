import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TempMonitorApp from './TempMonitorApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TempMonitorApp />
  </StrictMode>,
)
