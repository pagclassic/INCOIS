import { Link } from 'react-router-dom'

export function Admin() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-12 px-4 flex items-center justify-between border-b bg-white">
        <Link to="/app" className="text-sm text-ocean-900">← Back</Link>
        <div className="font-semibold">Admin / Settings</div>
        <div />
      </header>
      <main className="flex-1 p-4 grid md:grid-cols-3 gap-4">
        <div className="p-3 border rounded">User & role management (placeholder)</div>
        <div className="p-3 border rounded">Alert thresholds (placeholder)</div>
        <div className="p-3 border rounded">Integrations (SMS/WhatsApp/EWS) (placeholder)</div>
      </main>
    </div>
  )
}

