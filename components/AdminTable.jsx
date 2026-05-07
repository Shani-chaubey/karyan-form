"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

const PAGE_SIZE = 10;

const COLUMNS = [
  { key: "#", label: "#", width: "w-10" },
  { key: "employeeName", label: "Employee", width: "w-32" },
  { key: "channelPartnerName", label: "Channel Partner", width: "w-36" },
  { key: "mobileNumber", label: "Mobile", width: "w-28" },
  { key: "whatsappNumber", label: "WhatsApp", width: "w-28" },
  { key: "firmName", label: "Firm", width: "w-32" },
  { key: "officeLocation", label: "Office Location", width: "w-32" },
  { key: "place", label: "Place", width: "w-24" },
  { key: "createdAt", label: "Registered At", width: "w-36" },
];

export default function AdminTable({ data, token }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [downloading, setDownloading] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return data;
    return data.filter(
      (r) =>
        r.employeeName.toLowerCase().includes(q) ||
        r.channelPartnerName.toLowerCase().includes(q)
    );
  }, [data, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(e) {
    setQuery(e.target.value);
    setPage(1);
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch("/api/export", {
        headers: { "x-admin-token": token },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `registrations_${new Date().toISOString().split("T")[0]}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Search + Export bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="search"
            value={query}
            onChange={handleSearch}
            placeholder="Search by employee or channel partner…"
            aria-label="Search registrations"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500
            text-white font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {downloading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Exporting…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Excel
            </>
          )}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-800 border-b border-slate-700">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-3 text-left font-semibold text-slate-300 ${col.width} whitespace-nowrap`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-slate-500">
                  {query ? "No results match your search." : "No registrations yet."}
                </td>
              </tr>
            ) : (
              slice.map((row, i) => (
                <motion.tr
                  key={row._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-slate-800 hover:bg-slate-800/60 transition-colors"
                >
                  <td className="px-3 py-3 text-slate-400">{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td className="px-3 py-3 text-white font-medium">{row.employeeName}</td>
                  <td className="px-3 py-3 text-slate-300">{row.channelPartnerName}</td>
                  <td className="px-3 py-3 text-slate-300 font-mono">{row.mobileNumber}</td>
                  <td className="px-3 py-3 text-slate-300 font-mono">{row.whatsappNumber}</td>
                  <td className="px-3 py-3 text-slate-300">{row.firmName}</td>
                  <td className="px-3 py-3 text-slate-300">{row.officeLocation}</td>
                  <td className="px-3 py-3 text-slate-300">{row.place}</td>
                  <td className="px-3 py-3 text-slate-400 text-xs whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs border border-slate-700 text-slate-300 hover:bg-slate-800
                disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-slate-600">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors
                      ${page === p
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-slate-700 text-slate-300 hover:bg-slate-800"
                      }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs border border-slate-700 text-slate-300 hover:bg-slate-800
                disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
