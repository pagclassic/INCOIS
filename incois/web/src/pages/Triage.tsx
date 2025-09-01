import { Link } from 'react-router-dom'

export function Triage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-12 px-4 flex items-center justify-between border-b bg-white">
        <Link to="/app" className="text-sm text-ocean-900">← Back</Link>
        <div className="font-semibold">Verification & Triage</div>
        <div />
      </header>
      <main className="flex-1 p-4 grid md:grid-cols-2 gap-4">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="p-3 border rounded">
            <div className="text-xs text-gray-500 mb-1">Score: {70 + i}</div>
            <div className="font-medium">Unverified report #{i}</div>
            <div className="text-sm text-gray-600">Near Vizag · High waves</div>
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-1 rounded bg-teal-500 text-ocean-900">Verify</button>
              <button className="px-3 py-1 rounded border">False</button>
              <button className="px-3 py-1 rounded border">Assign</button>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

