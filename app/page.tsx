"use client";

import { useState, useRef } from "react";
import { taxonomy, AttributeField } from "@/lib/taxonomy";

type AttributeResult = {
  fields: AttributeField[];
  attributes: Record<string, string | null>;
};

const S = {
  input: {
    width: "100%",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "8px 10px",
    fontSize: "13px",
    color: "var(--text-primary)",
    background: "var(--bg-panel)",
    outline: "none",
  } as React.CSSProperties,
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    color: "var(--text-secondary)",
    marginBottom: "5px",
  } as React.CSSProperties,
};

export default function Home() {
  const [category, setCategory] = useState("dress");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AttributeResult | null>(null);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<File> =>
    new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();
      img.onload = () => {
        const maxDim = 1024;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = Math.round((height * maxDim) / width); width = maxDim; }
          else { width = Math.round((width * maxDim) / height); height = maxDim; }
        }
        canvas.width = width; canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(new File([blob!], file.name, { type: "image/jpeg" })), "image/jpeg", 0.85);
      };
      img.src = URL.createObjectURL(file);
    });

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setImage(compressed);
    setImagePreview(URL.createObjectURL(compressed));
  };

  const handleSubmit = async () => {
    setLoading(true); setError(null); setResult(null); setEdited({});
    const formData = new FormData();
    formData.append("category", category);
    formData.append("description", description);
    if (image) formData.append("image", image);
    try {
      const res = await fetch("/api/attribute", { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setResult(data);
      const initial: Record<string, string> = {};
      data.fields.forEach((f: AttributeField) => { initial[f.key] = data.attributes[f.key] ?? ""; });
      setEdited(initial);
    } catch { setError("Request failed."); }
    finally { setLoading(false); }
  };

  const handleExport = async () => {
    if (!result) return;
    const { utils, writeFile } = await import("xlsx");
    const rows = result.fields.map((f) => ({ Field: f.label, Value: edited[f.key] ?? "" }));
    rows.unshift({ Field: "Category", Value: taxonomy[category].name });
    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Attributes");
    writeFile(wb, `attribution_${category}_${Date.now()}.xlsx`);
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
        Single Item
      </h1>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "28px" }}>
        Upload an image or describe the item — AI populates the attribute set.
      </p>

      {/* Input card */}
      <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>

        {/* Category */}
        <div>
          <label style={S.label}>Category</label>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setResult(null); }} style={S.input}>
            {Object.entries(taxonomy).map(([key, cat]) => (
              <option key={key} value={key}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Image upload */}
        <div>
          <label style={S.label}>Product Image <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span></label>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: "2px dashed var(--border)",
              borderRadius: "8px",
              padding: "16px",
              cursor: "pointer",
              minHeight: "90px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="preview" style={{ maxHeight: "140px", objectFit: "contain", borderRadius: "6px" }} />
            ) : (
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Click to upload image</span>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
        </div>

        {/* Description */}
        <div>
          <label style={S.label}>Description / Notes <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. Floral midi wrap dress in 100% silk, v-neckline, long sleeves"
            style={{ ...S.input, resize: "none", lineHeight: 1.6 }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            background: "var(--accent)",
            color: "var(--accent-text)",
            border: "none",
            borderRadius: "8px",
            padding: "10px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            transition: "opacity 0.15s",
          }}
        >
          {loading ? "Attributing…" : "Generate Attributes"}
        </button>

        {error && <p style={{ fontSize: "13px", color: "#ef4444", margin: 0 }}>{error}</p>}
      </div>

      {/* Results */}
      {result && (
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
              Attributes — <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>{taxonomy[category].name}</span>
            </h2>
            <button
              onClick={handleExport}
              style={{ fontSize: "12px", border: "1px solid var(--border)", borderRadius: "7px", padding: "6px 12px", background: "var(--bg-panel)", color: "var(--text-secondary)", cursor: "pointer" }}
            >
              Export to Excel
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {result.fields.map((field) => (
              <div key={field.key} style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px", alignItems: "center" }}>
                <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)" }}>{field.label}</label>
                <div>
                  {field.type === "select" && field.options ? (
                    <select
                      value={edited[field.key] ?? ""}
                      onChange={(e) => setEdited({ ...edited, [field.key]: e.target.value })}
                      style={S.input}
                    >
                      <option value="">— not set —</option>
                      {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={edited[field.key] ?? ""}
                      onChange={(e) => setEdited({ ...edited, [field.key]: e.target.value })}
                      style={S.input}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
