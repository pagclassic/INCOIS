import { Link, useParams } from 'react-router-dom'

export function ReportDetail() {
  const { id } = useParams()
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="h-12 px-4 flex items-center justify-between border-b">
        <Link to="/app" className="text-sm text-ocean-900">← Back</Link>
        <div className="font-semibold">Report #{id}</div>
        <div />
      </header>
      <main className="flex-1 p-4 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          <div className="aspect-video bg-gray-100 rounded grid place-items-center">Media placeholder</div>
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-600">Timestamp · GPS · Language</div>
            <div className="mt-2">Short description goes here...</div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="p-3 border rounded">
            <div className="font-medium mb-2">Verification</div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded bg-teal-500 text-ocean-900">Verify</button>
              <button className="px-3 py-1 rounded border">Request Info</button>
              <button className="px-3 py-1 rounded border">Flag False</button>
            </div>
          </div>
          <div className="p-3 border rounded">
            <div className="font-medium mb-2">Actions</div>
            <button className="px-3 py-1 rounded bg-warning-500 text-white">Escalate Alert</button>
          </div>
        </div>
      </main>
    </div>
  )
}

