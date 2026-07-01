"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { mockStyles } from "@/lib/mockData";
import { taxonomy, colorFields, dppFields, AttributeField, Confidence } from "@/lib/taxonomy";

const CATEGORY_LABEL: Record<string, string> = { dress: "Dress", top: "Top", pant: "Pant" };

const CONF: Record<Confidence, { bg: string; border: string; text: string }> = {
  high:   { bg: "#dcfce7", border: "#86efac", text: "#15803d" },
  medium: { bg: "#fef9c3", border: "#fde047", text: "#854d0e" },
  low:    { bg: "#fee2e2", border: "#fca5a5", text: "#991b1b" },
};

// Dark-mode-aware selected pill uses CSS vars, fallback for unselected
const CONF_DARK: Record<Confidence, { bg: string; border: string; text: string }> = {
  high:   { bg: "#14532d", border: "#16a34a", text: "#4ade80" },
  medium: { bg: "#713f12", border: "#ca8a04", text: "#fde047" },
  low:    { bg: "#7f1d1d", border: "#dc2626", text: "#fca5a5" },
};

function confidenceScore(fields: AttributeField[], values: Record<string, string>): number | null {
  const scored = fields.filter((f) => f.confidence && values[f.key]);
  if (scored.length === 0) return null;
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

function FieldRow({ field, value, aiValue, onChange }: {
  field: AttributeField;
  value: string;
  aiValue: string;
  onChange: (val: string) => void;
}) {
  const vendorRequired = !field.aiInferable && field.aiInferable !== undefined;
  const conf = field.confidence;
  const dot = conf ? CONF[conf] : null;
  const isOverridden = value && value !== aiValue && aiValue;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "5px 9px", borderRadius: "6px",
    border: `1px solid ${vendorRequired ? "var(--badge-amber-border)" : "var(--border)"}`,
    background: "var(--bg)", color: "var(--text-primary)", fontSize: "12px", outline: "none",
  };

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "160px 1fr",
      padding: "10px 16px", borderBottom: "1px solid var(--border-subtle)",
      alignItems: "flex-start", gap: "16px",
    }}>
      {/* Label */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingTop: "4px" }}>
        {dot && !vendorRequired ? (
          <span title={`${conf} confidence`} style={{ width: "6px", height: "6px", borderRadius: "50%", background: dot.border, flexShrink: 0 }} />
        ) : (
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: vendorRequired ? "var(--badge-amber-border)" : "var(--border)", flexShrink: 0 }} />
        )}
        <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-secondary)" }}>{field.label}</span>
        {vendorRequired && (
          <span style={{ fontSize: "9px", color: "var(--badge-amber-text)", background: "var(--badge-amber-bg)", border: "1px solid var(--badge-amber-border)", borderRadius: "4px", padding: "1px 5px" }}>
            Vendor
          </span>
        )}
        {isOverridden && (
          <span title="Manually overridden" style={{ fontSize: "9px", color: "var(--text-muted)", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "4px", padding: "1px 5px" }}>
            Edited
          </span>
        )}
      </div>

      {/* Value — pills for select, input for text */}
      {field.type === "select" && field.options ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {field.options.map((opt) => {
            const isSelected = value === opt;
            const isAiPick = aiValue === opt;
            const c = conf ? CONF[conf] : null;

            let bg = "var(--bg-hover)";
            let border = "var(--border)";
            let color = "var(--text-secondary)";
            let fontWeight: number | string = 400;

            if (isSelected && isAiPick && c) {
              bg = c.bg; border = c.border; color = c.text; fontWeight = 600;
            } else if (isSelected && !isAiPick) {
              bg = "var(--accent)"; border = "var(--accent)"; color = "var(--accent-text)"; fontWeight = 600;
            }

            return (
              <button
                key={opt}
                onClick={() => onChange(isSelected ? "" : opt)}
                style={{
                  padding: "3px 10px", borderRadius: "99px", fontSize: "12px",
                  background: bg, border: `1px solid ${border}`, color, fontWeight,
                  cursor: "pointer", transition: "all 0.1s", whiteSpace: "nowrap",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={vendorRequired ? "Awaiting vendor…" : ""}
          style={inputStyle}
        />
      )}
    </div>
  );
}

function Card({ title, fields, values, aiValues, onChange, alert }: {
  title: string;
  fields: AttributeField[];
  values: Record<string, string>;
  aiValues: Record<string, string>;
  onChange: (key: string, val: string) => void;
  alert?: string;
}) {
  const score = confidenceScore(fields, values);
  const aiFields = fields.filter((f) => f.aiInferable !== false);

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{title}</span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            {aiFields.filter((f) => values[f.key]).length}/{aiFields.length} filled
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            {(["high", "medium", "low"] as Confidence[]).map((c) => (
              <span key={c} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "var(--text-muted)" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: CONF[c].border, display: "inline-block" }} />
                {c}
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

      <div>
        {fields.map((f) => (
          <FieldRow
            key={f.key}
            field={f}
            value={values[f.key] ?? ""}
            aiValue={aiValues[f.key] ?? ""}
            onChange={(val) => onChange(f.key, val)}
          />
        ))}
      </div>
    </div>
  );
}

export default function StyleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const style = mockStyles.find((s) => s.id === id);

  // aiValues = original AI output; values = current (possibly edited) state
  const [values, setValues] = useState<Record<string, string>>(style?.attributes ?? {});
  const [showCopy, setShowCopy] = useState(false);
  const [copyConfirm, setCopyConfirm] = useState<string | null>(null);

  const onChange = (key: string, val: string) => setValues((prev) => ({ ...prev, [key]: val }));

  const handleCopy = (sourceId: string) => {
    const source = mockStyles.find((s) => s.id === sourceId);
    if (!source) return;
    setValues((prev) => ({ ...prev, ...source.attributes }));
    setShowCopy(false);
    setCopyConfirm(source.name);
    setTimeout(() => setCopyConfirm(null), 3000);
  };

  if (!style) return (
    <div style={{ padding: "60px 32px", textAlign: "center", color: "var(--text-muted)" }}>
      Style not found.{" "}
      <button onClick={() => router.push("/line-list")} style={{ color: "var(--text-primary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
        Back
      </button>
    </div>
  );

  const cat = taxonomy[style.category];
  const otherStyles = mockStyles.filter((s) => s.id !== style.id);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px" }}>
      {/* Back */}
      <button
        onClick={() => router.push("/line-list")}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: "13px", display: "flex", alignItems: "center", gap: "5px", marginBottom: "20px", padding: 0 }}
      >
        ← Line List
      </button>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px" }}>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--text-muted)" }}>{style.styleNumber}</span>
            <span style={{ fontSize: "11px", padding: "1px 8px", borderRadius: "99px", background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
              {CATEGORY_LABEL[style.category]}
            </span>
            <span style={{ fontSize: "11px", padding: "1px 8px", borderRadius: "99px", background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
              {style.vendor}
            </span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{style.name}</h1>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center", position: "relative" }}>
          {/* Copy confirmation toast */}
          {copyConfirm && (
            <span style={{ fontSize: "12px", color: "var(--badge-green-text)", background: "var(--badge-green-bg)", border: "1px solid var(--badge-green-border)", borderRadius: "8px", padding: "6px 12px" }}>
              ✓ Copied from {copyConfirm}
            </span>
          )}

          {/* Copy from style */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowCopy(!showCopy)}
              style={{ fontSize: "12px", padding: "8px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-panel)", color: "var(--text-secondary)", cursor: "pointer" }}
            >
              Copy from style ▾
            </button>
            {showCopy && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 100,
                background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "10px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: "260px", overflow: "hidden",
              }}>
                <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Copy all attributes from</span>
                </div>
                {otherStyles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleCopy(s.id)}
                    style={{
                      width: "100%", textAlign: "left", padding: "9px 14px", background: "none",
                      border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: "1px",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-primary)" }}>{s.name}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{s.styleNumber} · {CATEGORY_LABEL[s.category]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowCopy(false)}
            style={{ fontSize: "12px", padding: "8px 14px", borderRadius: "8px", border: "none", background: "var(--accent)", color: "var(--accent-text)", cursor: "pointer", fontWeight: 600 }}
          >
            Mark reviewed
          </button>
        </div>
      </div>

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
