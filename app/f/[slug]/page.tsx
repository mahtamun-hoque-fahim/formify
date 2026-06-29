export default async function FormFillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-xl p-8 w-full max-w-2xl">
        <h1 className="font-syne text-2xl font-semibold text-text mb-2">Form: {slug}</h1>
        <p className="text-text-muted text-sm">Public form fill — Phase 3</p>
      </div>
    </main>
  )
}
