"use client";

import { useState } from "react";
import { mockStyles, mockRunDate } from "@/lib/mockData";
import Link from "next/link";

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

Action required: reach out to ${[...new Set(flagged.map((s) => s.vendor))].join(" and ")} for the missing data points. See the full report at your attribution dashboard.

2027 EU DPP deadline is ${Math.ceil((new Date("2027-01-01").getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))} months away. Getting suppliers into the habit now matters.

— Attribution System`;

export default function Dashboard() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showEmail, setShowEmail] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-gray-900 text-sm">Attribution Platform</span>
        <div className="flex gap-4 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-900">Single Item</Link>
          <Link href="/dashboard" className="text-gray-900 font-medium border-b-2 border-black pb-0.5">Nightly Run</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-10 px-4">

        {/* Run banner */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Last run</p>
            <p className="font-semibold text-gray-900">{runDateStr} at {runTimeStr}</p>
            <p className="text-sm text-gray-500 mt-0.5">SS25 line list · {mockStyles.length} styles ingested from vendor submissions</p>
          </div>
          <button
            onClick={() => setShowEmail(!showEmail)}
            className="text-sm border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            {showEmail ? "Hide email" : "View draft email"}
          </button>
        </div>

        {/* Email preview */}
        {showEmail && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Draft email sent to team</p>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{MOCK_EMAIL}</pre>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-3xl font-bold text-gray-900">{mockStyles.length}</p>
            <p className="text-sm text-gray-500 mt-1">Styles processed</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-3xl font-bold text-emerald-600">{attributed.length}</p>
            <p className="text-sm text-gray-500 mt-1">DPP-ready</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-3xl font-bold text-amber-500">{flagged.length}</p>
            <p className="text-sm text-gray-500 mt-1">Compliance gaps</p>
          </div>
        </div>

        {/* Flagged section */}
        {flagged.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              Needs vendor input — {flagged.length} styles
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {flagged.map((style, i) => (
                <div key={style.id}>
                  <button
                    onClick={() => setExpanded(expanded === style.id ? null : style.id)}
                    className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-gray-400 w-24">{style.styleNumber}</span>
                      <div>
                        <span className="text-sm font-medium text-gray-900">{style.name}</span>
                        <span className="text-xs text-gray-400 ml-2">{CATEGORY_LABEL[style.category]} · {style.vendor}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5">
                        {style.dppGaps.length} gap{style.dppGaps.length !== 1 ? "s" : ""}
                      </span>
                      <span className="text-gray-400 text-sm">{expanded === style.id ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {expanded === style.id && (
                    <div className="px-5 pb-4 border-t border-gray-100 bg-amber-50/30">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mt-3 mb-2">Missing DPP fields</p>
                      <div className="space-y-2">
                        {style.dppGaps.map((gap, j) => (
                          <div key={j} className="flex items-start gap-3 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                            <div>
                              <span className="font-medium text-gray-800">{gap.field}</span>
                              <span className="text-gray-500"> — {gap.reason}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {i < flagged.length - 1 && <div className="border-t border-gray-100" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full run table */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-300 inline-block"></span>
            All styles — this run
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Style #</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Vendor</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">DPP Status</th>
                </tr>
              </thead>
              <tbody>
                {mockStyles.map((style, i) => (
                  <tr key={style.id} className={`border-b border-gray-100 last:border-0 ${!style.dppComplete ? "bg-amber-50/20" : ""}`}>
                    <td className="px-5 py-3 font-mono text-xs text-gray-400">{style.styleNumber}</td>
                    <td className="px-5 py-3 text-gray-900 font-medium">{style.name}</td>
                    <td className="px-5 py-3 text-gray-500">{CATEGORY_LABEL[style.category]}</td>
                    <td className="px-5 py-3 text-gray-500">{style.vendor}</td>
                    <td className="px-5 py-3">
                      {style.dppComplete ? (
                        <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5">DPP Ready</span>
                      ) : (
                        <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5">
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

        <p className="text-xs text-gray-400 mt-6 text-center">
          EU Digital Product Passport mandatory for all textiles · Deadline 2027 · <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1781" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">ESPR Reg. 2024/1781</a>
        </p>
      </div>
    </main>
  );
}
