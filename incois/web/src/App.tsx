import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { ReportForm } from './pages/ReportForm'
import { ReportDetail } from './pages/ReportDetail'
import { Triage } from './pages/Triage'
import { Analytics } from './pages/Analytics'
import { Admin } from './pages/Admin'
import { Profile } from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Dashboard />} />
        <Route path="/report/new" element={<ReportForm />} />
        <Route path="/report/:id" element={<ReportDetail />} />
        <Route path="/triage" element={<Triage />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
