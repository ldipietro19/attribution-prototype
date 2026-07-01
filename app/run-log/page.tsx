"use client";

import { mockRuns, mockStyles } from "@/lib/mockData";

const flagged = mockStyles.filter((s) => !s.dppComplete);

const MOCK_EMAIL = `Subject: Attribution Run Complete · ${mockStyles.length} styles processed · ${flagged.length} need your attention

Hi team,

Last night's run processed ${mockStyles.length} new styles from your SS25 line list.

${mockStyles.filter(s => s.dppComplete).length} styles are fully attributed and DPP-ready.
${flagged.length} styles have compliance gaps that need vendor input before EU listing:

${flagged.map((s) => `  · ${s.styleNumber} ${s.name} — missing: ${s.dppGaps.map((g) => g.field).join(", ")}`).join("\n")}

— Attribution System`;

function fmt(ts: string) {
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

export default function RunLog() {
  const latest = mockRuns[0];
  const { date: latestDate, time: latestTime } = fmt(latest.timestamp);

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 32px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>Run Log</h1>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "32px" }}>
        History of PLM syncs and attribution runs.
      </p>

      {/* Latest run summary */}
      <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 22px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>Latest run</p>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>{latestDate} at {latestTime}</p>
          </div>
          <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "99px", background: "var(--badge-green-bg)", color: "var(--badge-green-text)", border: "1px solid var(--badge-green-border)" }}>
            Completed
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {[
            { label: "Processed", value: latest.stylesProcessed },
            { label: "Attributed", value: latest.attributed },
            { label: "DPP gaps", value: latest.dppGaps },
            { label: "New styles", value: latest.newStyles },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center", padding: "12px", background: "var(--bg)", borderRadius: "8px" }}>
              <p style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>{s.value}</p>
              <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Draft email */}
      <details style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "12px", marginBottom: "24px", overflow: "hidden" }}>
        <summary style={{ padding: "14px 20px", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Team email sent after latest run</span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Click to expand ▾</span>
        </summary>
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
          <pre style={{ fontSize: "12px", color: "var(--text-secondary)", whiteSpace: "pre-wrap", fontFamily: "monospace", lineHeight: 1.7, margin: 0 }}>
            {MOCK_EMAIL}
          </pre>
        </div>
      </details>

      {/* All runs */}
      <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>All runs — last 7 days</p>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Date", "Source", "Processed", "Attributed", "DPP Gaps", "Status"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "9px 16px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockRuns.map((run) => {
              const { date, time } = fmt(run.timestamp);
              const isEmpty = run.stylesProcessed === 0;
              return (
                <tr key={run.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "11px 16px", color: "var(--text-primary)", fontWeight: 500 }}>
                    {date}
                    <span style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>{time}</span>
                  </td>
                  <td style={{ padding: "11px 16px", color: "var(--text-secondary)" }}>{run.source}</td>
                  <td style={{ padding: "11px 16px", color: "var(--text-primary)", fontWeight: 500 }}>{run.stylesProcessed}</td>
                  <td style={{ padding: "11px 16px", color: "var(--text-secondary)" }}>{run.attributed || "—"}</td>
                  <td style={{ padding: "11px 16px" }}>
                    {run.dppGaps > 0 ? (
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "var(--badge-amber-bg)", color: "var(--badge-amber-text)", border: "1px solid var(--badge-amber-border)" }}>
                        {run.dppGaps}
                      </span>
                    ) : <span style={{ color: "var(--text-muted)" }}>—</span>}
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: isEmpty ? "var(--bg-hover)" : "var(--badge-green-bg)", color: isEmpty ? "var(--text-muted)" : "var(--badge-green-text)", border: `1px solid ${isEmpty ? "var(--border)" : "var(--badge-green-border)"}` }}>
                      {isEmpty ? "No changes" : "Completed"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
