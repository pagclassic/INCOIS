import { Link } from 'react-router-dom'

export function Analytics() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-12 px-4 flex items-center justify-between border-b bg-white">
        <Link to="/app" className="text-sm text-ocean-900">← Back</Link>
        <div className="font-semibold">Analytics & Social Feed</div>
        <div />
      </header>
      <main className="flex-1 p-4 grid md:grid-cols-3 gap-4">
        <div className="p-3 border rounded">Trending keywords (placeholder)</div>
        <div className="p-3 border rounded">Sentiment over time (placeholder)</div>
        <div className="p-3 border rounded">Source breakdown (placeholder)</div>
        <div className="md:col-span-3 p-3 border rounded">Social feed list (placeholder)</div>
      </main>
    </div>
  )
}

