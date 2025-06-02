"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | boolean>(null);
  const [error, setError] = useState("");

  const handleScan = async () => {
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.found);
      } else {
        setError(data.message || "Error scanning the site");
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-3xl font-bold">Consently</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter website URL (e.g. https://example.com)"
        className="p-2 w-full max-w-md border rounded"
      />
      <button
        onClick={handleScan}
        disabled={loading || !url}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        {loading ? "Scanning..." : "Scan"}
      </button>
       {result !== null && (
        <div className="text-xl flex items-center gap-2">
          {result ? (
            <>
              <div className="relative group inline-block cursor-help">
                <span role="img" aria-label="cookie" className="text-blue-700">
                  (i) 🍪
                </span>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-normal w-64 rounded bg-gray-800 px-3 py-2 text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  This site uses cookies and shows a consent banner to inform users about data collection.
                </div>
              </div>{" "}
              This site uses cookies and shows a consent banner.
            </>
          ) : (
            "🚫 No cookie consent banner was detected on this site."
          )}
        </div>
      )}
      {error && <p className="text-red-600">{error}</p>}
    </main>
  );
}
