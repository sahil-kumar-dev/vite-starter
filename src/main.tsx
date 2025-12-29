import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import App from './App.tsx'
import './index.css'
import { QueryProvider } from './provider/queryClient.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryProvider>
      <Toaster richColors />
      <App />
    </QueryProvider>
  </BrowserRouter>
)
