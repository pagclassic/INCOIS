import { useState } from 'react'
import { Link } from 'react-router-dom'

export function ReportForm() {
  const [desc, setDesc] = useState('')
  const [severity, setSeverity] = useState('medium')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="h-12 px-4 flex items-center justify-between border-b bg-white">
        <Link to="/app" className="text-sm text-ocean-900">← Back</Link>
        <div className="font-semibold">Report Hazard</div>
        <div />
      </header>
      <main className="flex-1 px-4 py-3">
        <form className="max-w-xl mx-auto space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event type</label>
            <select className="w-full border rounded px-3 py-2">
              <option>High waves</option>
              <option>Flooding</option>
              <option>Debris</option>
              <option>Distress</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} placeholder="Short description" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Severity</label>
            <div className="flex gap-2">
              {['low','medium','high'].map(s => (
                <button key={s} type="button" onClick={()=>setSeverity(s)} className={`px-3 py-1 rounded border ${severity===s? 'bg-ocean-900 text-white':'bg-white'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Photo / Video</label>
            <input type="file" accept="image/*,video/*" className="block w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <div className="h-40 bg-gray-200 rounded grid place-items-center text-gray-600">Map placeholder (auto-geolocate)</div>
          </div>
          <button type="button" className="w-full px-4 py-2 rounded bg-teal-500 text-ocean-900 font-semibold">Submit</button>
          <div className="text-xs text-gray-500">If offline, will save locally and sync later.</div>
        </form>
      </main>
    </div>
  )
}

