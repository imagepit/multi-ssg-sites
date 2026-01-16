'use client'

export function AdminSidebarHeader() {
  return (
    <div className="admin-sidebar-header">
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-badge">TD</div>
        <div>
          <div className="admin-sidebar-title">Techdoc Admin</div>
          <div className="admin-sidebar-meta">Control center</div>
        </div>
      </div>
      <input
        className="admin-sidebar-search"
        placeholder="Search or go to..."
        aria-label="Search"
      />
    </div>
  )
}
