"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockStyles } from "@/lib/mockData";
import { getReviewStatus } from "@/lib/store";

const CATEGORY_LABEL: Record<string, string> = { dress: "Dress", top: "Top", pant: "Pant" };
const VENDORS = [...new Set(mockStyles.map((s) => s.vendor))];

type Filter = "all" | "needs_input" | "pending" | "reviewed";
type ReviewStatus = "pending" | "reviewed" | "needs_input";

const REVIEW_BADGE: Record<string, { label: string; bg: string; text: string; border: string }> = {
  reviewed:    { label: "Reviewed",     bg: "var(--badge-green-bg)",  text: "var(--badge-green-text)",  border: "var(--badge-green-border)" },
  pending:     { label: "Pending",      bg: "var(--bg-hover)",        text: "var(--text-secondary)",    border: "var(--border)" },
  needs_input: { label: "Needs Input",  bg: "var(--badge-amber-bg)",  text: "var(--badge-amber-text)",  border: "var(--badge-amber-border)" },
};

export default function LineList() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [vendor, setVendor] = useState("all");
  const [search, setSearch] = useState("");
  // Overlay localStorage review statuses on top of mock defaults
  const [reviewStatuses, setReviewStatuses] = useState<Record<string, ReviewStatus>>({});

  useEffect(() => {
    const overrides: Record<string, ReviewStatus> = {};
    mockStyles.forEach(s => {
      overrides[s.id] = getReviewStatus(s.id, s.reviewStatus) as ReviewStatus;
    });
    setReviewStatuses(overrides);
  }, []);

  const getStatus = (id: string, fallback: string): ReviewStatus =>
    reviewStatuses[id] ?? (fallback as ReviewStatus);

  const filtered = mockStyles.filter((s) => {
    const status = getStatus(s.id, s.reviewStatus);
    if (filter !== "all" && status !== filter) return false;
    if (vendor !== "all" && s.vendor !== vendor) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.styleNumber.toLowerCase().includes(q);
    }
    return true;
  });

  const counts = {
    all: mockStyles.length,
    needs_input: mockStyles.filter((s) => getStatus(s.id, s.reviewStatus) === "needs_input").length,
    pending: mockStyles.filter((s) => getStatus(s.id, s.reviewStatus) === "pending").length,
    reviewed: mockStyles.filter((s) => getStatus(s.id, s.reviewStatus) === "reviewed").length,
  };

  return (
    <div style={{ padding: "40px 32px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>Line List</h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>SS25 · {mockStyles.length} styles · Last synced from Centric 2h ago</p>
        </div>
        <button
          style={{ fontSize: "12px", padding: "8px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-panel)", color: "var(--text-secondary)", cursor: "pointer" }}
        >
          + Manual add
        </button>
      </div>

      {/* Filter tabs + search row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", gap: "12px", flexWrap: "wrap" }}>
        {/* Tab filters */}
        <div style={{ display: "flex", gap: "2px", background: "var(--bg-hover)", padding: "3px", borderRadius: "8px" }}>
          {(["all", "needs_input", "pending", "reviewed"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "5px 12px", borderRadius: "6px", border: "none", cursor: "pointer",
                fontSize: "12px", fontWeight: filter === f ? 600 : 400,
                background: filter === f ? "var(--bg-panel)" : "transparent",
                color: filter === f ? "var(--text-primary)" : "var(--text-secondary)",
                boxShadow: filter === f ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                whiteSpace: "nowrap",
              }}
            >
              {f === "all" ? "All" : f === "needs_input" ? "Needs Input" : f === "pending" ? "Pending" : "Reviewed"}
              <span style={{ marginLeft: "5px", fontSize: "11px", opacity: 0.7 }}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* Search + vendor filter */}
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="Search styles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "6px 12px", borderRadius: "7px", border: "1px solid var(--border)",
              background: "var(--bg-panel)", color: "var(--text-primary)", fontSize: "12px", width: "180px", outline: "none",
            }}
          />
          <select
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            style={{
              padding: "6px 10px", borderRadius: "7px", border: "1px solid var(--border)",
              background: "var(--bg-panel)", color: "var(--text-secondary)", fontSize: "12px", outline: "none",
            }}
          >
            <option value="all">All vendors</option>
            {VENDORS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Style #", "Name", "Category", "Vendor", "Attribution", "DPP", "Review"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                  No styles match this filter
                </td>
              </tr>
            ) : filtered.map((style) => {
              const rb = REVIEW_BADGE[getStatus(style.id, style.reviewStatus)];
              return (
                <tr
                  key={style.id}
                  onClick={() => router.push(`/line-list/${style.id}`)}
                  style={{
                    borderBottom: "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "11px", color: "var(--text-muted)" }}>{style.styleNumber}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 500, color: "var(--text-primary)" }}>{style.name}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{CATEGORY_LABEL[style.category]}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{style.vendor}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "var(--badge-green-bg)", color: "var(--badge-green-text)", border: "1px solid var(--badge-green-border)" }}>
                      AI Complete
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {style.dppComplete ? (
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "var(--badge-green-bg)", color: "var(--badge-green-text)", border: "1px solid var(--badge-green-border)" }}>Ready</span>
                    ) : (
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "var(--badge-amber-bg)", color: "var(--badge-amber-text)", border: "1px solid var(--badge-amber-border)" }}>
                        {style.dppGaps.length} gap{style.dppGaps.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: rb.bg, color: rb.text, border: `1px solid ${rb.border}` }}>
                      {rb.label}
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
