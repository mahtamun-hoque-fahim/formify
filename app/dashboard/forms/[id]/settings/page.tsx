export default async function FormSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div>
      <h1 className="font-syne text-3xl font-semibold text-text mb-2">Form settings</h1>
      <p className="text-text-muted text-sm font-mono">Form {id} — Phase 5</p>
    </div>
  )
}
