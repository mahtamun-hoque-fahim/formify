export default async function SubmittedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-xl p-8 w-full max-w-md text-center">
        <h1 className="font-syne text-2xl font-semibold text-text mb-2">Response submitted</h1>
        <p className="text-text-muted text-sm">Thank you — {slug}</p>
      </div>
    </main>
  )
}
