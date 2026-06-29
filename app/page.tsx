export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-syne text-6xl font-bold text-text mb-4">Formify</h1>
        <p className="text-text-muted text-lg mb-8">Beautiful forms. Real integrity.</p>
        <a href="/signup" className="bg-accent text-white px-6 py-3 rounded-md font-semibold hover:bg-accent-hover transition-colors duration-150 inline-block">
          Get started
        </a>
      </div>
    </main>
  )
}
