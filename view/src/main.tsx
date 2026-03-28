import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/authContext.tsx'
import { StreamProvider } from './context/StreamContext.tsx'
import { CoinProvider } from './context/CoinsContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <StreamProvider><CoinProvider><AuthProvider><App /></AuthProvider></CoinProvider></StreamProvider>
    </BrowserRouter>
  </StrictMode>
)
