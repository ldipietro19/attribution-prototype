"use client";

import { useState } from "react";
import { mockStyles, mockRunDate } from "@/lib/mockData";

const CATEGORY_LABEL: Record<string, string> = { dress: "Dress", top: "Top", pant: "Pant" };

const flagged = mockStyles.filter((s) => !s.dppComplete);
const attributed = mockStyles.filter((s) => s.attributed && s.dppComplete);

const runDate = new Date(mockRunDate);
const runDateStr = runDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
const runTimeStr = runDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const MOCK_EMAIL = `Subject: Attribution Run Complete · ${mockStyles.length} styles processed · ${flagged.length} need your attention

Hi team,

Last night's run processed ${mockStyles.length} new styles from your SS25 line list.

${attributed.length} styles are fully attributed and DPP-ready.
${flagged.length} styles have compliance gaps that need vendor input before EU listing:

${flagged.map((s) => `  · ${s.styleNumber} ${s.name} — missing: ${s.dppGaps.map((g) => g.field).join(", ")}`).join("\n")}

Action required: reach out to ${[...new Set(flagged.map((s) => s.vendor))].join(" and ")} for the missing data points.

2027 EU DPP deadline is ${Math.ceil((new Date("2027-01-01").getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))} months away. Getting suppliers into the habit now matters.

— Attribution System`;

export default function Dashboard() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showEmail, setShowEmail] = useState(false);

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>

      {/* Page header */}
      <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
        Nightly Run
      </h1>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "28px" }}>
        Automated attribution + DPP compliance check across your line list.
      </p>

      {/* Run banner */}
      <div style={{
        background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "12px",
        padding: "18px 22px", marginBottom: "20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>Last run</p>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>{runDateStr} at {runTimeStr}</p>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>SS25 line list · {mockStyles.length} styles ingested</p>
        </div>
        <button
          onClick={() => setShowEmail(!showEmail)}
          style={{
            fontSize: "12px", border: "1px solid var(--border)", borderRadius: "8px",
            padding: "8px 14px", background: "var(--bg-panel)", color: "var(--text-secondary)",
            cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          {showEmail ? "Hide email" : "View draft email"}
        </button>
      </div>

      {/* Email preview */}
      {showEmail && (
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 22px", marginBottom: "20px" }}>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Draft email sent to team</p>
          <pre style={{ fontSize: "12px", color: "var(--text-secondary)", whiteSpace: "pre-wrap", fontFamily: "monospace", lineHeight: 1.7, margin: 0 }}>{MOCK_EMAIL}</pre>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "24px" }}>
        {[
          { value: mockStyles.length, label: "Styles processed", color: "var(--text-primary)" },
          { value: attributed.length, label: "DPP-ready", color: "#16a34a" },
          { value: flagged.length, label: "Compliance gaps", color: "#d97706" },
        ].map((card) => (
          <div key={card.label} style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "12px", padding: "18px 20px" }}>
            <p style={{ fontSize: "28px", fontWeight: 700, color: card.color, marginBottom: "4px" }}>{card.value}</p>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Flagged section */}
      {flagged.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "7px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
            Needs vendor input — {flagged.length} styles
          </p>
          <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
            {flagged.map((style, i) => (
              <div key={style.id}>
                <button
                  onClick={() => setExpanded(expanded === style.id ? null : style.id)}
                  style={{
                    width: "100%", textAlign: "left", padding: "14px 18px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "none", border: "none", cursor: "pointer",
                    borderBottom: expanded === style.id ? `1px solid var(--border)` : "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--text-muted)", width: "96px", flexShrink: 0 }}>{style.styleNumber}</span>
                    <div style={{ textAlign: "left" }}>
                      <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>{style.name}</span>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "8px" }}>{CATEGORY_LABEL[style.category]} · {style.vendor}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      fontSize: "11px", padding: "2px 10px", borderRadius: "99px",
                      background: "var(--badge-amber-bg)", color: "var(--badge-amber-text)",
                      border: "1px solid var(--badge-amber-border)",
                    }}>
                      {style.dppGaps.length} gap{style.dppGaps.length !== 1 ? "s" : ""}
                    </span>
                    <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>{expanded === style.id ? "▲" : "▼"}</span>
                  </div>
                </button>

                {expanded === style.id && (
                  <div style={{ padding: "14px 18px 16px", background: "var(--row-flag)" }}>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Missing DPP fields</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {style.dppGaps.map((gap, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px" }}>
                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#f59e0b", flexShrink: 0, marginTop: "5px" }} />
                          <span>
                            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>{gap.field}</strong>
                            <span style={{ color: "var(--text-secondary)" }}> — {gap.reason}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {i < flagged.length - 1 && <div style={{ borderTop: "1px solid var(--border-subtle)" }} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full run table */}
      <div>
        <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "7px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--border)", display: "inline-block" }} />
          All styles — this run
        </p>
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Style #", "Name", "Category", "Vendor", "DPP Status"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockStyles.map((style) => (
                <tr key={style.id} style={{ borderBottom: "1px solid var(--border-subtle)", background: !style.dppComplete ? "var(--row-flag)" : "transparent" }}>
                  <td style={{ padding: "11px 16px", fontFamily: "monospace", fontSize: "11px", color: "var(--text-muted)" }}>{style.styleNumber}</td>
                  <td style={{ padding: "11px 16px", fontWeight: 500, color: "var(--text-primary)" }}>{style.name}</td>
                  <td style={{ padding: "11px 16px", color: "var(--text-secondary)" }}>{CATEGORY_LABEL[style.category]}</td>
                  <td style={{ padding: "11px 16px", color: "var(--text-secondary)" }}>{style.vendor}</td>
                  <td style={{ padding: "11px 16px" }}>
                    {style.dppComplete ? (
                      <span style={{ fontSize: "11px", padding: "2px 10px", borderRadius: "99px", background: "var(--badge-green-bg)", color: "var(--badge-green-text)", border: "1px solid var(--badge-green-border)" }}>
                        DPP Ready
                      </span>
                    ) : (
                      <span style={{ fontSize: "11px", padding: "2px 10px", borderRadius: "99px", background: "var(--badge-amber-bg)", color: "var(--badge-amber-text)", border: "1px solid var(--badge-amber-border)" }}>
                        {style.dppGaps.length} gap{style.dppGaps.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "24px", textAlign: "center" }}>
        EU Digital Product Passport mandatory for all textiles · Deadline 2027 ·{" "}
        <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1781" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)", textDecoration: "underline" }}>ESPR Reg. 2024/1781</a>
      </p>
    </div>
  );
}
