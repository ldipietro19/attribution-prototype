"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockStyles } from "@/lib/mockData";
import { taxonomy, colorFields, dppFields, plmFields, AttributeField, Confidence } from "@/lib/taxonomy";
import { getStyleAttributes, saveStyleAttributes, getReviewStatus, saveReviewStatus } from "@/lib/store";

const CATEGORY_LABEL: Record<string, string> = { dress: "Dress", top: "Top", pant: "Pant" };

const CONF: Record<Confidence, { dot: string; pillBg: string; pillBorder: string; pillText: string }> = {
  high:   { dot: "#22c55e", pillBg: "#dcfce7", pillBorder: "#86efac", pillText: "#15803d" },
  medium: { dot: "#f59e0b", pillBg: "#fef9c3", pillBorder: "#fde047", pillText: "#854d0e" },
  low:    { dot: "#ef4444", pillBg: "#fee2e2", pillBorder: "#fca5a5", pillText: "#991b1b" },
};

// Sparkle SVG for AI-attributed fields
function AIBadge() {
  return (
    <span title="AI attributed" style={{ display: "inline-flex", alignItems: "center", gap: "2px", fontSize: "9px", fontWeight: 600, color: "#6366f1", background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: "4px", padding: "1px 5px", marginLeft: "4px", flexShrink: 0 }}>
      ✦ AI
    </span>
  );
}

function LockIcon({ color = "var(--text-muted)" }: { color?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function confidenceScore(fields: AttributeField[], values: Record<string, string>): number | null {
  const scored = fields.filter(f => f.source === "ai" && f.confidence && values[f.key]);
  if (!scored.length) return null;
  const total = scored.reduce((acc, f) => acc + (f.confidence === "high" ? 1 : f.confidence === "medium" ? 0.6 : 0.3), 0);
  return Math.round((total / scored.length) * 100);
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return null;
  const color = score >= 80 ? "#22c55e" : score >= 55 ? "#f59e0b" : "#ef4444";
  return (
    <span style={{ fontSize: "11px", fontWeight: 600, color, background: `${color}18`, border: `1px solid ${color}40`, borderRadius: "99px", padding: "2px 9px" }}>
      {score}% confident
    </span>
  );
}

function PLMStrip({ data }: { data: Record<string, string> }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0", background: "var(--bg-hover)", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)", marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", borderRight: "1px solid var(--border)", flexShrink: 0 }}>
        <LockIcon />
        <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>PLM</span>
      </div>
      {plmFields.map((f, i) => (
        <div key={f.key} style={{ padding: "8px 16px", borderRight: i < plmFields.length - 1 ? "1px solid var(--border)" : "none" }}>
          <div style={{ fontSize: "9px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "2px" }}>{f.label}</div>
          <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)" }}>{data[f.key] ?? "—"}</div>
        </div>
      ))}
    </div>
  );
}

function FieldRow({ field, value, aiValue, onChange }: {
  field: AttributeField;
  value: string;
  aiValue: string;
  onChange: (val: string) => void;
}) {
  const isVendor = field.source === "vendor";
  const isAI = field.source === "ai";
  const hasValue = !!value;
  const isEdited = hasValue && value !== aiValue && !!aiValue;
  const conf = field.confidence;

  const rowBg = isVendor && !hasValue ? "var(--badge-amber-bg)" : "var(--bg-panel)";

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "5px 9px", borderRadius: "6px",
    border: `1px solid ${isVendor && !hasValue ? "var(--badge-amber-border)" : "var(--border)"}`,
    background: "var(--bg)", color: "var(--text-primary)", fontSize: "12px", outline: "none",
    cursor: isVendor && !hasValue ? "not-allowed" : "text",
    opacity: isVendor && !hasValue ? 0.6 : 1,
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "170px 1fr", padding: "10px 16px", borderBottom: "1px solid var(--border-subtle)", alignItems: "flex-start", gap: "16px", background: rowBg }}>
      {/* Label */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingTop: "5px", flexWrap: "wrap" }}>
        {/* Confidence dot */}
        {isAI && conf && (
          <span title={`AI confidence: ${conf}`} style={{ width: "7px", height: "7px", borderRadius: "50%", background: CONF[conf].dot, flexShrink: 0 }} />
        )}
        {isVendor && (
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: hasValue ? "#22c55e" : "var(--badge-amber-border)", flexShrink: 0 }} />
        )}
        <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-secondary)" }}>{field.label}</span>
        {isAI && hasValue && !isEdited && <AIBadge />}
        {isEdited && (
          <span style={{ fontSize: "9px", color: "var(--text-muted)", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "4px", padding: "1px 5px" }}>Edited</span>
        )}
        {isVendor && !hasValue && (
          <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "9px", color: "var(--badge-amber-text)", background: "var(--badge-amber-bg)", border: "1px solid var(--badge-amber-border)", borderRadius: "4px", padding: "1px 5px" }}>
            <LockIcon color="currentColor" /> Vendor
          </span>
        )}
      </div>

      {/* Value */}
      {field.type === "select" && field.options ? (
        isVendor && !hasValue ? (
          // Vendor lock — show disabled pill row
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", opacity: 0.4, pointerEvents: "none" }}>
            {field.options.slice(0, 3).map(opt => (
              <span key={opt} style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "12px", background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>{opt}</span>
            ))}
            <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "12px", color: "var(--text-muted)" }}>…</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {field.options.map(opt => {
              const isSelected = value === opt;
              const isAIPick = aiValue === opt;
              let bg = "var(--bg-hover)", border = "var(--border)", color = "var(--text-secondary)", fw: number | string = 400;
              if (isSelected && isAIPick && conf) {
                bg = CONF[conf].pillBg; border = CONF[conf].pillBorder; color = CONF[conf].pillText; fw = 600;
              } else if (isSelected && !isAIPick) {
                bg = "var(--accent)"; border = "var(--accent)"; color = "var(--accent-text)"; fw = 600;
              }
              return (
                <button key={opt} onClick={() => onChange(isSelected ? "" : opt)}
                  style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "12px", background: bg, border: `1px solid ${border}`, color, fontWeight: fw, cursor: "pointer", transition: "all 0.1s", whiteSpace: "nowrap" }}>
                  {opt}
                </button>
              );
            })}
          </div>
        )
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={isVendor && !hasValue}
          placeholder={isVendor && !hasValue ? "Awaiting vendor submission…" : ""}
          style={inputStyle}
        />
      )}
    </div>
  );
}

function Card({ title, fields, values, aiValues, onChange, alert }: {
  title: string; fields: AttributeField[];
  values: Record<string, string>; aiValues: Record<string, string>;
  onChange: (key: string, val: string) => void; alert?: string;
}) {
  const score = confidenceScore(fields, values);
  const aiFilled = fields.filter(f => f.source === "ai" && values[f.key]).length;
  const aiTotal = fields.filter(f => f.source === "ai").length;

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{title}</span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{aiFilled}/{aiTotal} AI-filled</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            {(["high","medium","low"] as Confidence[]).map(c => (
              <span key={c} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "var(--text-muted)" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: CONF[c].dot, display: "inline-block" }} />{c}
              </span>
            ))}
          </div>
          <ScoreBadge score={score} />
        </div>
      </div>
      {alert && (
        <div style={{ padding: "8px 16px", background: "var(--badge-amber-bg)", borderBottom: "1px solid var(--badge-amber-border)" }}>
          <span style={{ fontSize: "12px", color: "var(--badge-amber-text)" }}>⚠ {alert}</span>
        </div>
      )}
      {fields.map(f => (
        <FieldRow key={f.key} field={f} value={values[f.key] ?? ""} aiValue={aiValues[f.key] ?? ""} onChange={val => onChange(f.key, val)} />
      ))}
    </div>
  );
}

export default function StyleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const style = mockStyles.find(s => s.id === id);

  const [values, setValues] = useState<Record<string, string>>(style?.attributes ?? {});
  const [reviewStatus, setReviewStatusState] = useState(style?.reviewStatus ?? "pending");
  const [showCopy, setShowCopy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state from localStorage after mount
  useEffect(() => {
    if (!style) return;
    setValues(getStyleAttributes(id, style.attributes));
    setReviewStatusState(getReviewStatus(id, style.reviewStatus) as "pending" | "reviewed" | "needs_input");
    setHydrated(true);
  }, [id, style]);

  const onChange = (key: string, val: string) => {
    const next = { ...values, [key]: val };
    setValues(next);
    saveStyleAttributes(id, next);
  };

  const handleCopy = (sourceId: string) => {
    const source = mockStyles.find(s => s.id === sourceId);
    if (!source) return;
    const next = { ...values, ...source.attributes };
    setValues(next);
    saveStyleAttributes(id, next);
    setShowCopy(false);
    showToast(`Copied from ${source.name}`);
  };

  const handleMarkReviewed = () => {
    const next = "reviewed";
    setReviewStatusState(next);
    saveReviewStatus(id, next);
    showToast("Marked as reviewed");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  if (!style) return (
    <div style={{ padding: "60px 32px", textAlign: "center", color: "var(--text-muted)" }}>
      Style not found. <button onClick={() => router.push("/line-list")} style={{ color: "var(--text-primary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Back</button>
    </div>
  );

  const cat = taxonomy[style.category];
  const otherStyles = mockStyles.filter(s => s.id !== style.id);

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    reviewed:    { bg: "var(--badge-green-bg)",  text: "var(--badge-green-text)",  border: "var(--badge-green-border)" },
    pending:     { bg: "var(--bg-hover)",         text: "var(--text-secondary)",    border: "var(--border)" },
    needs_input: { bg: "var(--badge-amber-bg)",   text: "var(--badge-amber-text)",  border: "var(--badge-amber-border)" },
  };
  const sc = statusColors[reviewStatus];

  if (!hydrated) return null;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px" }}>
      {/* Back */}
      <button onClick={() => router.push("/line-list")}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: "13px", display: "flex", alignItems: "center", gap: "5px", marginBottom: "20px", padding: 0 }}>
        ← Line List
      </button>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px" }}>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--text-muted)" }}>{style.styleNumber}</span>
            <span style={{ fontSize: "11px", padding: "1px 8px", borderRadius: "99px", background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>{CATEGORY_LABEL[style.category]}</span>
            <span style={{ fontSize: "11px", padding: "1px 8px", borderRadius: "99px", background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>{style.vendor}</span>
            <span style={{ fontSize: "11px", padding: "1px 8px", borderRadius: "99px", background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
              {reviewStatus === "reviewed" ? "✓ Reviewed" : reviewStatus === "needs_input" ? "⚠ Needs Input" : "Pending"}
            </span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{style.name}</h1>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center", position: "relative" }}>
          {toast && (
            <span style={{ fontSize: "12px", color: "var(--badge-green-text)", background: "var(--badge-green-bg)", border: "1px solid var(--badge-green-border)", borderRadius: "8px", padding: "6px 12px", whiteSpace: "nowrap" }}>
              ✓ {toast}
            </span>
          )}

          {/* Copy from style */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowCopy(!showCopy)}
              style={{ fontSize: "12px", padding: "8px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-panel)", color: "var(--text-secondary)", cursor: "pointer" }}>
              Copy from style ▾
            </button>
            {showCopy && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 100, background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: "260px", overflow: "hidden" }}>
                <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Copy all attributes from</span>
                </div>
                {otherStyles.map(s => (
                  <button key={s.id} onClick={() => handleCopy(s.id)}
                    style={{ width: "100%", textAlign: "left", padding: "9px 14px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: "1px", borderBottom: "1px solid var(--border-subtle)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                    <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-primary)" }}>{s.name}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{s.styleNumber} · {CATEGORY_LABEL[s.category]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleMarkReviewed}
            style={{ fontSize: "12px", padding: "8px 14px", borderRadius: "8px", border: "none", background: reviewStatus === "reviewed" ? "var(--bg-hover)" : "var(--accent)", color: reviewStatus === "reviewed" ? "var(--text-secondary)" : "var(--accent-text)", cursor: "pointer", fontWeight: 600 }}>
            {reviewStatus === "reviewed" ? "✓ Reviewed" : "Mark reviewed"}
          </button>
        </div>
      </div>

      {/* PLM read-only strip */}
      <PLMStrip data={style.plmData} />

      {/* 3 cards */}
      <Card title="Style Attributes" fields={cat?.fields ?? []} values={values} aiValues={style.attributes} onChange={onChange} />
      <Card title="Color & Fabric" fields={colorFields} values={values} aiValues={style.attributes} onChange={onChange} />
      <Card
        title="🇪🇺 DPP Compliance"
        fields={dppFields}
        values={values}
        aiValues={style.attributes}
        onChange={onChange}
        alert={!style.dppComplete ? `${style.dppGaps.length} field${style.dppGaps.length !== 1 ? "s" : ""} missing — ${style.dppGaps.map(g => g.field).join(", ")}` : undefined}
      />
    </div>
  );
}
