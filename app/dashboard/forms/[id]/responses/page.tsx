export default async function ResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div>
      <h1 className="font-syne text-3xl font-semibold text-text mb-2">Responses</h1>
      <p className="text-text-muted text-sm font-mono">Form {id} — Phase 4</p>
    </div>
  )
}
