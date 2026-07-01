"use client";

import { useState, useRef } from "react";
import { taxonomy, AttributeField } from "@/lib/taxonomy";

type AttributeResult = {
  fields: AttributeField[];
  attributes: Record<string, string | null>;
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

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setEdited({});

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
      data.fields.forEach((f: AttributeField) => {
        initial[f.key] = data.attributes[f.key] ?? "";
      });
      setEdited(initial);
    } catch {
      setError("Request failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!result) return;
    const { utils, writeFile } = await import("xlsx");
    const rows = result.fields.map((f) => ({
      Field: f.label,
      Value: edited[f.key] ?? "",
    }));
    rows.unshift({ Field: "Category", Value: taxonomy[category].name });
    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Attributes");
    writeFile(wb, `attribution_${category}_${Date.now()}.xlsx`);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Product Attribution</h1>
        <p className="text-gray-500 mb-8 text-sm">Upload a product image or describe the item — AI populates the attribute set for review.</p>

        {/* Inputs */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-5">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setResult(null); }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {Object.entries(taxonomy).map(([key, cat]) => (
                <option key={key} value={key}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image <span className="text-gray-400 font-normal">(optional)</span></label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-center min-h-[100px]"
            >
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="preview" className="max-h-40 object-contain rounded" />
              ) : (
                <span className="text-sm text-gray-400">Click to upload image</span>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="e.g. Floral midi wrap dress in 100% silk, v-neckline, long sleeves"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Attributing…" : "Generate Attributes"}
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Attributes — <span className="text-gray-500 font-normal">{taxonomy[category].name}</span></h2>
              <button
                onClick={handleExport}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
              >
                Export to Excel
              </button>
            </div>

            <div className="space-y-3">
              {result.fields.map((field) => (
                <div key={field.key} className="grid grid-cols-3 gap-3 items-center">
                  <label className="text-sm text-gray-600 font-medium">{field.label}</label>
                  <div className="col-span-2">
                    {field.type === "select" && field.options ? (
                      <select
                        value={edited[field.key] ?? ""}
                        onChange={(e) => setEdited({ ...edited, [field.key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="">— not set —</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={edited[field.key] ?? ""}
                        onChange={(e) => setEdited({ ...edited, [field.key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
