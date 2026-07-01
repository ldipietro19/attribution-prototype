"use client";

import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { taxonomy, colorFields, dppFields, AttributeField, FieldSource } from "@/lib/taxonomy";

type Tab = "appearance" | "taxonomy";

const SOURCE_BADGE: Record<FieldSource, { label: string; bg: string; text: string; border: string }> = {
  ai:     { label: "AI",     bg: "#eef2ff", text: "#4f46e5", border: "#c7d2fe" },
  vendor: { label: "Vendor", bg: "var(--badge-amber-bg)", text: "var(--badge-amber-text)", border: "var(--badge-amber-border)" },
  plm:    { label: "PLM",    bg: "var(--bg-hover)",        text: "var(--text-muted)",       border: "var(--border)" },
};

function SourceBadge({ source }: { source: FieldSource }) {
  const s = SOURCE_BADGE[source];
  return (
    <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 7px", borderRadius: "4px", background: s.bg, color: s.text, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

function FieldTable({ fields, title }: { fields: AttributeField[]; title: string }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>{title}</p>
      <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Field", "Key", "Type", "Source", "Options"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 14px", fontSize: "10px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map(f => (
              <tr key={f.key} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <td style={{ padding: "9px 14px", fontWeight: 500, color: "var(--text-primary)" }}>{f.label}</td>
                <td style={{ padding: "9px 14px", fontFamily: "monospace", fontSize: "11px", color: "var(--text-muted)" }}>{f.key}</td>
                <td style={{ padding: "9px 14px", color: "var(--text-secondary)" }}>{f.type}</td>
                <td style={{ padding: "9px 14px" }}><SourceBadge source={f.source} /></td>
                <td style={{ padding: "9px 14px", color: "var(--text-muted)", fontSize: "11px" }}>
                  {f.options ? f.options.join(", ") : <span style={{ fontStyle: "italic" }}>free text</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState<Tab>("appearance");
  const [category, setCategory] = useState("dress");

  const tabStyle = (t: Tab): React.CSSProperties => ({
    padding: "7px 16px", borderRadius: "7px", border: "none", cursor: "pointer", fontSize: "13px",
    fontWeight: tab === t ? 600 : 400,
    background: tab === t ? "var(--bg-panel)" : "transparent",
    color: tab === t ? "var(--text-primary)" : "var(--text-secondary)",
    boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
  });

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 32px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>Settings</h1>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "28px" }}>Configure your attribution platform.</p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "2px", background: "var(--bg-hover)", padding: "3px", borderRadius: "9px", width: "fit-content", marginBottom: "28px" }}>
        <button style={tabStyle("appearance")} onClick={() => setTab("appearance")}>Appearance</button>
        <button style={tabStyle("taxonomy")} onClick={() => setTab("taxonomy")}>Taxonomy</button>
      </div>

      {/* Appearance */}
      {tab === "appearance" && (
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Theme</p>
          </div>
          <div style={{ padding: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {(["light", "dark"] as const).map(t => (
                <button key={t} onClick={() => setTheme(t)}
                  style={{ padding: "14px 16px", borderRadius: "10px", border: `2px solid ${theme === t ? "var(--text-primary)" : "var(--border)"}`, background: theme === t ? "var(--bg-hover)" : "var(--bg-panel)", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "28px", borderRadius: "6px", background: t === "light" ? "#f9fafb" : "#0f1117", border: "1px solid #e5e7eb", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: theme === t ? 600 : 400, color: "var(--text-primary)", textTransform: "capitalize", marginBottom: "1px" }}>{t}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t === "light" ? "Default" : "Easy on the eyes"}</p>
                  </div>
                  {theme === t && <span style={{ marginLeft: "auto", color: "var(--text-primary)", fontSize: "14px" }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Taxonomy */}
      {tab === "taxonomy" && (
        <div>
          <div style={{ background: "var(--badge-green-bg)", border: "1px solid var(--badge-green-border)", borderRadius: "10px", padding: "12px 16px", marginBottom: "24px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--badge-green-text)", marginBottom: "2px" }}>Category Pack — SS25 · Vertical Retail (Women's RTW)</p>
            <p style={{ fontSize: "12px", color: "var(--badge-green-text)", opacity: 0.8 }}>
              Configured at implementation. This taxonomy drives all AI attribution and DPP compliance checks. Changes require re-running attribution on affected styles.
            </p>
          </div>

          {/* Source legend */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
            {(["ai", "vendor", "plm"] as FieldSource[]).map(s => {
              const b = SOURCE_BADGE[s];
              const desc = s === "ai" ? "AI attributes from image/description" : s === "vendor" ? "Must be submitted by vendor" : "Read-only from PLM";
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "var(--text-secondary)" }}>
                  <SourceBadge source={s} />
                  <span>{desc}</span>
                </div>
              );
            })}
          </div>

          {/* Category selector */}
          <div style={{ display: "flex", gap: "2px", background: "var(--bg-hover)", padding: "3px", borderRadius: "8px", width: "fit-content", marginBottom: "20px" }}>
            {Object.entries(taxonomy).map(([key, cat]) => (
              <button key={key} onClick={() => setCategory(key)}
                style={{ padding: "5px 14px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: category === key ? 600 : 400, background: category === key ? "var(--bg-panel)" : "transparent", color: category === key ? "var(--text-primary)" : "var(--text-secondary)", boxShadow: category === key ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
                {cat.name}
              </button>
            ))}
          </div>

          <FieldTable fields={taxonomy[category].fields} title={`${taxonomy[category].name} — Style Attributes`} />
          <FieldTable fields={colorFields} title="Color & Fabric — shared across all categories" />
          <FieldTable fields={dppFields} title="DPP Compliance — shared across all categories · EU Mandatory 2027" />

          <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>Adding or modifying fields</p>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Field changes are made during implementation by your Attribution Platform team. Each field requires an AI prompt update and re-attribution of existing styles. Contact your account manager to request taxonomy changes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
