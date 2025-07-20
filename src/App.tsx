import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider'
import { Navigation } from './components/Navigation'
import { LandingPage } from './pages/LandingPage'
import { Dashboard } from './pages/Dashboard'
import { ScrapingProject } from './pages/ScrapingProject'
import { DataPreview } from './pages/DataPreview'
import { ExportCenter } from './pages/ExportCenter'
import { ScrapingHistory } from './pages/ScrapingHistory'
import { Toaster } from './components/ui/sonner'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scrape" element={<ScrapingProject />} />
              <Route path="/preview/:projectId" element={<DataPreview />} />
              <Route path="/export" element={<ExportCenter />} />
              <Route path="/history" element={<ScrapingHistory />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App