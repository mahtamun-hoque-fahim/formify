export default async function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div>
      <h1 className="font-syne text-3xl font-semibold text-text mb-2">Edit form</h1>
      <p className="text-text-muted text-sm font-mono">ID: {id} — Phase 2</p>
    </div>
  )
}
