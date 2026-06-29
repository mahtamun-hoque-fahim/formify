export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex">
      <aside className="w-60 bg-surface border-r border-border p-4 shrink-0">
        <p className="font-syne text-lg font-semibold text-text mb-2">Formify</p>
        <p className="text-xs text-danger font-mono mb-8">ADMIN</p>
        <nav className="flex flex-col gap-1">
          <a href="/admin" className="text-text-muted hover:text-text px-3 py-2 rounded-md text-sm transition-colors">Overview</a>
          <a href="/admin/users" className="text-text-muted hover:text-text px-3 py-2 rounded-md text-sm transition-colors">Users</a>
          <a href="/admin/forms" className="text-text-muted hover:text-text px-3 py-2 rounded-md text-sm transition-colors">All forms</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
