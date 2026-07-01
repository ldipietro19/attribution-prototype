"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { mockStyles } from "@/lib/mockData";
import { taxonomy, dppFields } from "@/lib/taxonomy";

const CATEGORY_LABEL: Record<string, string> = { dress: "Dress", top: "Top", pant: "Pant" };

export default function StyleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const style = mockStyles.find((s) => s.id === id);

  const [edited, setEdited] = useState<Record<string, string>>(style?.attributes ?? {});

  if (!style) {
    return (
      <div style={{ padding: "60px 32px", textAlign: "center", color: "var(--text-muted)" }}>
        Style not found. <button onClick={() => router.push("/line-list")} style={{ color: "var(--text-primary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Back to line list</button>
      </div>
    );
  }

  const cat = taxonomy[style.category];
  const styleFields = cat?.fields ?? [];

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "7px 10px", borderRadius: "7px",
    border: "1px solid var(--border)", background: "var(--bg)",
    color: "var(--text-primary)", fontSize: "13px", outline: "none",
  };

  const renderField = (field: { label: string; key: string; options?: string[]; type: string; aiInferable?: boolean }) => {
    const val = edited[field.key] ?? "";
    const isEmpty = !val;
    const needsVendor = isEmpty && field.aiInferable === false;

    return (
      <div key={field.key} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "12px", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)" }}>{field.label}</span>
          {needsVendor && (
            <span style={{ display: "block", fontSize: "10px", color: "var(--badge-amber-text)", marginTop: "2px" }}>Vendor required</span>
          )}
        </div>
        <div style={{ position: "relative" }}>
          {field.type === "select" && field.options ? (
            <select
              value={val}
              onChange={(e) => setEdited({ ...edited, [field.key]: e.target.value })}
              style={{ ...inputStyle, borderColor: needsVendor ? "var(--badge-amber-border)" : "var(--border)" }}
            >
              <option value="">— not set —</option>
              {field.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <input
              type="text"
              value={val}
              onChange={(e) => setEdited({ ...edited, [field.key]: e.target.value })}
              placeholder={needsVendor ? "Awaiting vendor data…" : ""}
              style={{ ...inputStyle, borderColor: needsVendor ? "var(--badge-amber-border)" : "var(--border)" }}
            />
          )}
          {!isEmpty && !needsVendor && (
            <span style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "10px", color: "var(--badge-green-text)" }} title="AI attributed">✦</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "820px", margin: "0 auto", padding: "36px 32px" }}>
      {/* Back */}
      <button
        onClick={() => router.push("/line-list")}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: "13px", display: "flex", alignItems: "center", gap: "5px", marginBottom: "20px", padding: 0 }}
      >
        ← Line List
      </button>

      {/* Style header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--text-muted)" }}>{style.styleNumber}</span>
            <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
              {CATEGORY_LABEL[style.category]}
            </span>
            <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
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

      {/* DPP alert if gaps */}
      {!style.dppComplete && (
        <div style={{
          background: "var(--badge-amber-bg)", border: "1px solid var(--badge-amber-border)",
          borderRadius: "10px", padding: "12px 16px", marginBottom: "24px",
          display: "flex", alignItems: "flex-start", gap: "10px",
        }}>
          <span style={{ fontSize: "14px" }}>⚠️</span>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--badge-amber-text)", marginBottom: "4px" }}>
              {style.dppGaps.length} DPP compliance field{style.dppGaps.length !== 1 ? "s" : ""} missing
            </p>
            <p style={{ fontSize: "12px", color: "var(--badge-amber-text)", opacity: 0.8 }}>
              {style.dppGaps.map((g) => g.field).join(" · ")} — vendor input required before EU listing.
            </p>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Style Attributes */}
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
          <div style={{ marginBottom: "14px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>Style Attributes</p>
            <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>✦ = AI attributed</p>
          </div>
          {styleFields.map(renderField)}
        </div>

        {/* DPP Compliance */}
        <div style={{ background: "var(--bg-panel)", border: `1px solid ${style.dppComplete ? "var(--border)" : "var(--badge-amber-border)"}`, borderRadius: "12px", padding: "20px" }}>
          <div style={{ marginBottom: "14px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>
              🇪🇺 DPP Compliance
            </p>
            <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Mandatory for EU sales · Deadline 2027</p>
          </div>
          {dppFields.map(renderField)}
        </div>
      </div>
    </div>
  );
}
