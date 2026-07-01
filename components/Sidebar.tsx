"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    href: "/taxonomy",
    label: "Taxonomy",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    href: "/run-log",
    label: "Run Log",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    href: "/line-list",
    label: "Line List",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const navItemStyle = (href: string): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: collapsed ? "10px 0" : "8px 10px",
    justifyContent: collapsed ? "center" : "flex-start",
    borderRadius: "8px",
    marginBottom: "2px",
    fontSize: "13px",
    fontWeight: isActive(href) ? 600 : 400,
    color: isActive(href) ? "var(--text-primary)" : "var(--text-secondary)",
    background: isActive(href) ? "var(--bg-hover)" : "transparent",
    textDecoration: "none",
    whiteSpace: "nowrap",
    transition: "background 0.12s, color 0.12s",
  });

  return (
    <aside style={{
      width: collapsed ? "56px" : "210px",
      minWidth: collapsed ? "56px" : "210px",
      background: "var(--bg-sidebar)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.2s ease, min-width 0.2s ease",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        padding: collapsed ? "16px 0" : "16px 14px",
        borderBottom: "1px solid var(--border)",
        minHeight: "53px",
      }}>
        {!collapsed && (
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Attribution
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px", borderRadius: "5px", display: "flex" }}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
            </svg>
          )}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px" }}>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            style={navItemStyle(item.href)}
            onMouseEnter={(e) => { if (!isActive(item.href)) (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
            onMouseLeave={(e) => { if (!isActive(item.href)) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <span style={{ flexShrink: 0, opacity: isActive(item.href) ? 1 : 0.65 }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Settings */}
      <div style={{ padding: "8px", borderTop: "1px solid var(--border)" }}>
        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          style={navItemStyle("/settings")}
          onMouseEnter={(e) => { if (!isActive("/settings")) (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
          onMouseLeave={(e) => { if (!isActive("/settings")) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <span style={{ flexShrink: 0, opacity: isActive("/settings") ? 1 : 0.65 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </span>
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
