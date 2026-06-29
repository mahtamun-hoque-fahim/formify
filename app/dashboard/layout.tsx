export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex">
      <aside className="w-60 bg-surface border-r border-border p-4 shrink-0">
        <p className="font-syne text-lg font-semibold text-text mb-8">Formify</p>
        <nav className="flex flex-col gap-1">
          <a href="/dashboard" className="text-text-muted hover:text-text px-3 py-2 rounded-md text-sm transition-colors">Dashboard</a>
          <a href="/dashboard/forms" className="text-text-muted hover:text-text px-3 py-2 rounded-md text-sm transition-colors">Forms</a>
          <a href="/dashboard/templates" className="text-text-muted hover:text-text px-3 py-2 rounded-md text-sm transition-colors">Templates</a>
          <a href="/dashboard/analytics" className="text-text-muted hover:text-text px-3 py-2 rounded-md text-sm transition-colors">Analytics</a>
          <a href="/dashboard/settings" className="text-text-muted hover:text-text px-3 py-2 rounded-md text-sm transition-colors">Settings</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
