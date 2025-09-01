import { Link, useNavigate } from 'react-router-dom'
import { MapView } from '../shared/MapView'
import { useAppStore } from '../shared/store'

function Header() {
  return (
    <header className="h-12 px-4 flex items-center justify-between border-b bg-white">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded bg-ocean-900" />
        <span className="font-semibold">INCOIS</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <Link to="/analytics" className="hover:underline">Analytics</Link>
        <Link to="/triage" className="hover:underline">Triage</Link>
        <Link to="/admin" className="hover:underline">Admin</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>
      </div>
    </header>
  )
}

function LeftFilters() {
  return (
    <aside className="w-64 p-3 border-r hidden md:block">
      <div className="mb-2 font-semibold">Filters</div>
      <div className="space-y-3 text-sm">
        <div>
          <div className="text-xs text-gray-500 mb-1">Event Types</div>
          <div className="flex flex-wrap gap-2">
            {['Waves','Flood','Debris','Distress'].map(t => (
              <button key={t} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">{t}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Status</div>
          <div className="flex gap-2">
            {['All','Verified','Unverified'].map(s => (
              <button key={s} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">{s}</button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

function MapCanvas() {
  return (
    <div className="flex-1 relative">
      <MapView />
      <div className="absolute bottom-4 right-4">
        <Link to="/report/new" className="px-4 py-2 rounded-full bg-warning-500 text-white shadow-lg">Report Hazard</Link>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <div className="mx-auto max-w-xl w-full bg-white/90 rounded shadow px-3 py-2 text-sm">
          Timeline: <input type="range" className="w-3/4 align-middle" />
        </div>
      </div>
    </div>
  )
}

function RightFeed() {
  const reports = useAppStore(s => s.reports)
  const select = useAppStore(s => s.select)
  const selectedId = useAppStore(s => s.selectedId)
  const navigate = useNavigate()
  return (
    <aside className="w-80 p-3 border-l hidden lg:block">
      <div className="mb-2 font-semibold">Live Feed</div>
      <div className="space-y-2 text-sm overflow-auto max-h-[calc(100vh-5rem)] pr-1">
        {reports.slice(0, 100).map(r => (
          <div key={r.id} className={`p-2 rounded border cursor-pointer ${selectedId===r.id? 'border-ocean-900 bg-ocean-900/5':'hover:bg-gray-50'}`} onClick={() => { select(r.id); }}>
            <div className="text-xs text-gray-500">{new Date(r.timestamp).toLocaleTimeString()}</div>
            <div className="font-medium">{r.title}</div>
            <div className="text-xs capitalize">Severity: {r.severity} <button className="ml-2 underline" onClick={(e)=>{e.stopPropagation(); navigate(`/report/${r.id}`)}}>Open</button></div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex flex-1">
        <LeftFilters />
        <MapCanvas />
        <RightFeed />
      </main>
    </div>
  )
}

