import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DealEntry from './pages/DealEntry.jsx'
import Funding from './pages/Funding.jsx'

const qc = new QueryClient()

function Layout() {
  return (
    <div style={{ padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h2>Einstein – Sales Ops</h2>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/">Deal Entry</Link>
        <Link to="/funding">Funding (CIT)</Link>
      </nav>
      <div id="page">
        {/* router outlet */}
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <DealEntry /> },
  { path: '/funding', element: <Funding /> }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
