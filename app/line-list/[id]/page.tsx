"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { mockStyles } from "@/lib/mockData";
import { taxonomy, colorFields, dppFields, AttributeField, Confidence } from "@/lib/taxonomy";

const CATEGORY_LABEL: Record<string, string> = { dress: "Dress", top: "Top", pant: "Pant" };

const CONF_DOT: Record<Confidence, { color: string; label: string }> = {
  high:   { color: "#22c55e", label: "High confidence" },
  medium: { color: "#f59e0b", label: "Medium confidence" },
  low:    { color: "#ef4444", label: "Low confidence — review" },
};

function confidenceScore(fields: AttributeField[], values: Record<string, string>): number | null {
  const scored = fields.filter((f) => f.confidence && values[f.key]);
  if (scored.length === 0) return null;
  const total = scored.reduce((acc, f) => {
    const w = f.confidence === "high" ? 1 : f.confidence === "medium" ? 0.6 : 0.3;
    return acc + w;
  }, 0);
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

function FieldGrid({ fields, values, onChange }: {
  fields: AttributeField[];
  values: Record<string, string>;
  onChange: (key: string, val: string) => void;
}) {
  const inputBase: React.CSSProperties = {
    width: "100%", padding: "5px 8px", borderRadius: "6px",
    border: "1px solid var(--border)", background: "var(--bg)",
    color: "var(--text-primary)", fontSize: "12px", outline: "none",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--border)" }}>
      {fields.map((field) => {
        const val = values[field.key] ?? "";
        const isEmpty = !val;
        const vendorRequired = isEmpty && field.aiInferable === false;
        const conf = field.confidence;
        const dot = conf ? CONF_DOT[conf] : null;

        return (
          <div
            key={field.key}
            style={{ background: "var(--bg-panel)", padding: "12px 14px" }}
          >
            {/* Label row */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
              {dot && !isEmpty && (
                <span
                  title={dot.label}
                  style={{ width: "7px", height: "7px", borderRadius: "50%", background: dot.color, flexShrink: 0, display: "inline-block" }}
                />
              )}
              {vendorRequired && (
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#6b7280", flexShrink: 0, display: "inline-block" }} title="Vendor required" />
              )}
              {isEmpty && !vendorRequired && (
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--border)", flexShrink: 0, display: "inline-block" }} />
              )}
              <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                {field.label}
              </span>
              {vendorRequired && (
                <span style={{ fontSize: "9px", color: "var(--badge-amber-text)", background: "var(--badge-amber-bg)", border: "1px solid var(--badge-amber-border)", borderRadius: "4px", padding: "1px 5px", marginLeft: "auto" }}>
                  Vendor
                </span>
              )}
            </div>

            {/* Value */}
            {field.type === "select" && field.options ? (
              <select
                value={val}
                onChange={(e) => onChange(field.key, e.target.value)}
                style={{ ...inputBase, borderColor: vendorRequired ? "var(--badge-amber-border)" : "var(--border)" }}
              >
                <option value="">—</option>
                {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input
                type="text"
                value={val}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={vendorRequired ? "Awaiting vendor…" : ""}
                style={{ ...inputBase, borderColor: vendorRequired ? "var(--badge-amber-border)" : "var(--border)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Card({ title, fields, values, onChange, alert }: {
  title: string;
  fields: AttributeField[];
  values: Record<string, string>;
  onChange: (key: string, val: string) => void;
  alert?: string;
}) {
  const score = confidenceScore(fields, values);
  const aiFields = fields.filter((f) => f.aiInferable !== false);

  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
      {/* Card header */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{title}</span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            {aiFields.filter((f) => values[f.key]).length}/{aiFields.length} AI-filled
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Legend */}
          <div style={{ display: "flex", gap: "10px", marginRight: "8px" }}>
            {(["high", "medium", "low"] as Confidence[]).map((c) => (
              <span key={c} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "var(--text-muted)" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: CONF_DOT[c].color, display: "inline-block" }} />
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

      <FieldGrid fields={fields} values={values} onChange={onChange} />
    </div>
  );
}

export default function StyleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const style = mockStyles.find((s) => s.id === id);
  const [values, setValues] = useState<Record<string, string>>(style?.attributes ?? {});

  const onChange = (key: string, val: string) => setValues((prev) => ({ ...prev, [key]: val }));

  if (!style) {
    return (
      <div style={{ padding: "60px 32px", textAlign: "center", color: "var(--text-muted)" }}>
        Style not found.{" "}
        <button onClick={() => router.push("/line-list")} style={{ color: "var(--text-primary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Back to line list
        </button>
      </div>
    );
  }

  const cat = taxonomy[style.category];

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
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{ fontSize: "12px", padding: "8px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-panel)", color: "var(--text-secondary)", cursor: "pointer" }}>
            Request vendor input
          </button>
          <button style={{ fontSize: "12px", padding: "8px 14px", borderRadius: "8px", border: "none", background: "var(--accent)", color: "var(--accent-text)", cursor: "pointer", fontWeight: 600 }}>
            Mark reviewed
          </button>
        </div>
      </div>

      {/* 3 cards */}
      <Card
        title="Style Attributes"
        fields={cat?.fields ?? []}
        values={values}
        onChange={onChange}
      />

      <Card
        title="Color & Fabric"
        fields={colorFields}
        values={values}
        onChange={onChange}
      />

      <Card
        title="🇪🇺 DPP Compliance"
        fields={dppFields}
        values={values}
        onChange={onChange}
        alert={!style.dppComplete ? `${style.dppGaps.length} field${style.dppGaps.length !== 1 ? "s" : ""} missing — ${style.dppGaps.map(g => g.field).join(", ")}` : undefined}
      />
    </div>
  );
}
