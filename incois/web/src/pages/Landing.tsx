import { Link } from 'react-router-dom'

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-ocean-900 text-white">
      <header className="w-full px-4 py-3 flex items-center justify-between bg-ocean-900/90 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-teal-500" />
          <span className="font-semibold">INCOIS Ocean Hazards</span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/app" className="hover:underline">Live Map</Link>
          <Link to="/report/new" className="hover:underline">Report Hazard</Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Crowdsourced Ocean Hazard Reporting</h1>
          <p className="text-white/80 mb-6">Submit geotagged reports with photos/videos and track hotspots and alerts in real-time. Built for citizens, volunteers, and officials.</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/app" className="px-4 py-2 rounded bg-teal-500 text-ocean-900 font-semibold">Open Live Map</Link>
            <Link to="/report/new" className="px-4 py-2 rounded border border-white/30">Report Hazard</Link>
          </div>
        </div>
      </main>

      <footer className="px-4 py-3 text-center text-white/70 text-xs">
        For demo only • PWA-enabled • PostGIS backend (planned)
      </footer>
    </div>
  )
}

