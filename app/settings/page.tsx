"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
        Settings
      </h1>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "32px" }}>
        Configure your attribution platform preferences.
      </p>

      {/* Section */}
      <div style={{
        background: "var(--bg-panel)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        overflow: "hidden",
      }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Appearance
          </p>
        </div>

        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "2px" }}>Theme</p>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Choose between light and dark interface</p>
            </div>
          </div>

          {/* Toggle cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {(["light", "dark"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  border: `2px solid ${theme === t ? "var(--text-primary)" : "var(--border)"}`,
                  background: theme === t ? "var(--bg-hover)" : "var(--bg-panel)",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.15s",
                }}
              >
                {/* Preview swatch */}
                <div style={{
                  width: "36px",
                  height: "28px",
                  borderRadius: "6px",
                  background: t === "light" ? "#f9fafb" : "#0f1117",
                  border: "1px solid #e5e7eb",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "3px",
                }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "1px", background: t === "light" ? "#d1d5db" : "#2a3142" }} />
                  <div style={{ width: "10px", height: "4px", borderRadius: "1px", background: t === "light" ? "#e5e7eb" : "#1a1f2e" }} />
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: theme === t ? 600 : 400, color: "var(--text-primary)", textTransform: "capitalize", marginBottom: "1px" }}>{t}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t === "light" ? "Default" : "Easy on the eyes"}</p>
                </div>
                {theme === t && (
                  <span style={{ marginLeft: "auto", color: "var(--text-primary)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
