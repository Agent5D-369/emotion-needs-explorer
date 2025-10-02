import React, { useState, useMemo, useEffect } from "react";
import { EMOTION_DATA, toRows } from "./emotionData.js";
import { guidanceFor } from "./prompts.js";

const ATTR_LINE =
  "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/) · Rick Broider · Agent5D.com · HolisticLifeTribe.com";

/* ---------- tiny toast helper (no deps) ---------- */
function showToast(msg) {
  const id = "ene_toast_portal";
  let portal = document.getElementById(id);
  if (!portal) {
    portal = document.createElement("div");
    portal.id = id;
    portal.style.position = "fixed";
    portal.style.left = "50%";
    portal.style.bottom = "18px";
    portal.style.transform = "translateX(-50%)";
    portal.style.zIndex = "9999";
    document.body.appendChild(portal);
  }
  const node = document.createElement("div");
  node.className =
    "px-4 py-2 rounded-xl shadow-md border bg-white text-gray-900 text-sm mb-2 animate-fadein";
  node.textContent = msg;
  portal.appendChild(node);
  setTimeout(() => {
    node.style.opacity = "0";
    node.style.transform = "translateY(6px)";
    setTimeout(() => node.remove(), 220);
  }, 1200);
}

function copyText(text) {
  const doToast = (ok) => showToast(ok ? "✓ Copied" : "Copy failed");
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard
      .writeText(text)
      .then(() => doToast(true))
      .catch(() => {
        fallback();
        doToast(false);
      });
  }
  fallback();
  doToast(true);

  function fallback() {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }
}

/* ---------- UI primitives ---------- */
function Button({ children, onClick, variant = "ghost", className = "" }) {
  const base =
    "btn " +
    (variant === "primary"
      ? "btn-primary"
      : variant === "outline"
      ? "btn-outline"
      : variant === "copy"
      ? "btn-copy"
      : "btn-ghost");
  return (
    <button onClick={onClick} className={base + " " + className}>
      {children}
    </button>
  );
}
const Badge = ({ children }) => <span className="badge">{children}</span>;

function Column({ title, items, selected, onSelect }) {
  return (
    <div className="card h-full">
      <div className="card-header"><div className="card-title">{title}</div></div>
      <div className="card-content space-y-2 max-h-[56vh] overflow-auto pr-2">
        {items.map((item) => (
          <Button key={item} variant={selected === item ? "primary" : "ghost"} className="w-full justify-between text-left" onClick={() => onSelect(item)}>
            <span>{item}</span><span className="opacity-60">›</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Needs panel ---------- */
function NeedsPanel({ core, sub, specific, needs, onAddToSnapshot }) {
  const path = [core, sub, specific].filter(Boolean).join(" / ");
  const guidance = guidanceFor({ core, sub, specific, needs });

  // Short now INCLUDES Guided Next Step
  const shortPayload = [
    `Feeling ${core} → ${sub} → ${specific}. Needs: ${needs.join(", ")}.`,
    "",
    "Guided Next Step:",
    guidance,
    "",
    ATTR_LINE,
  ].join("\n");

  // Long also includes Guided Next Step (unchanged)
  const longPayload = [
    `I am currently feeling ${core}, ${sub}, and ${specific}.`,
    `My current related emotional needs are ${needs.join(", ")}.`,
    "",
    "Guided Next Step:",
    guidance,
    "",
    ATTR_LINE,
  ].join("\n");

  return (
    <div className="card h-full">
      <div className="card-header">
        <div className="card-title">Unmet Needs</div>
        <p className="text-sm muted">{path || "Select an emotion to view its needs."}</p>
      </div>
      <div className="card-content space-y-3">
        {needs?.length ? (
          <>
            <div className="flex flex-wrap gap-2">{needs.map((n) => <span key={n} className="badge">{n}</span>)}</div>
            <div className="flex gap-2 pt-2 items-center flex-wrap">
              <Button variant="copy" onClick={() => copyText(shortPayload)}>
                Copy (Short)
              </Button>
              <Button variant="outline" onClick={() => copyText(longPayload)}>
                Copy for Chat/Email
              </Button>
              {/* Outline + toast feedback */}
              <Button
                variant="outline"
                onClick={() => {
                  onAddToSnapshot();
                  showToast("✓ Added to Snapshot");
                }}
              >
                Add to Snapshot
              </Button>
            </div>

            <div className="mt-2 p-3 rounded-xl border bg-white/60">
              <div className="text-sm font-semibold mb-1">Guided Next Step</div>
              <p className="text-sm">{guidance}</p>
            </div>
          </>
        ) : (
          <p className="muted">No needs selected yet.</p>
        )}
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */
function highlight(text, q) {
  if (!q) return text;
  const parts = String(text).split(
    new RegExp(`(${q.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")})`, "ig")
  );
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="hl">
        {part}
      </mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

/* ---------- App ---------- */
export default function App() {
  const rows = useMemo(() => toRows(), []);
  const cores = useMemo(() => Object.keys(EMOTION_DATA), []);

  const [tab, setTab] = useState("explore"); // explore | search | snapshot | saved
  const [search, setSearch] = useState("");
  const [core, setCore] = useState("Anger");
  const [sub, setSub] = useState(Object.keys(EMOTION_DATA["Anger"] || {})[0]);
  const [specific, setSpecific] = useState(
    Object.keys(
      EMOTION_DATA["Anger"]?.[Object.keys(EMOTION_DATA["Anger"] || {})[0]] || {}
    )[0] || ""
  );

  const subs = useMemo(() => Object.keys(EMOTION_DATA[core] || {}), [core]);
  const specifics = useMemo(
    () => Object.keys(EMOTION_DATA[core]?.[sub] || {}),
    [core, sub]
  );
  const needs = useMemo(
    () => EMOTION_DATA[core]?.[sub]?.[specific] || [],
    [core, sub, specific]
  );

  // Snapshot (multi-select)
  const [snapshot, setSnapshot] = useState([]); // [{core, sub, specific, needs[]}]
  const clearSnapshot = () => setSnapshot([]);
  const addToSnapshot = () => {
    setSnapshot((prev) => {
      const exists = prev.some(
        (p) => p.core === core && p.sub === sub && p.specific === specific
      );
      if (exists) return prev;
      return [...prev, { core, sub, specific, needs }];
    });
  };

  // Saved snapshots (localStorage)
  const STORAGE_KEY = "ene_saved_snapshots_v1";
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const saveSnapshot = (title = "Session") => {
    const entry = {
      id: Date.now(),
      title,
      items: snapshot,
      createdAt: new Date().toISOString(),
    };
    const next = [entry, ...saved];
    setSaved(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    showToast("✓ Saved");
  };
  const removeSaved = (id) => {
    const next = saved.filter((s) => s.id !== id);
    setSaved(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    showToast("✓ Deleted");
  };

  const snapshotNeeds = useMemo(() => {
    const all = new Set();
    snapshot.forEach((s) => s.needs.forEach((n) => all.add(n)));
    return Array.from(all);
  }, [snapshot]);

  // Snapshot SHORT now includes per-item Next Steps
  const snapshotShort = useMemo(() => {
    const lines = snapshot.map(
      (s) => `• ${s.core} / ${s.sub} / ${s.specific}: needs ${s.needs.join(", ")}`
    );
    const steps = snapshot.map(
      (s) => `• ${s.core} / ${s.sub} / ${s.specific}: ${guidanceFor(s)}`
    );
    return [
      "Emotional snapshot",
      ...lines,
      "",
      `Converging unmet needs: ${snapshotNeeds.join(", ")}`,
      "",
      "Next Steps:",
      ...steps,
      "",
      ATTR_LINE,
    ].join("\n");
  }, [snapshot, snapshotNeeds]);

  // Snapshot REFLECTION: same as before (also includes steps)
  const snapshotLong = snapshotShort;

  // Search filter
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.core, r.sub, r.specific, r.needs.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, search]);

  useEffect(() => {
    setSub(Object.keys(EMOTION_DATA[core] || {})[0]);
  }, [core]);
  useEffect(() => {
    setSpecific(Object.keys(EMOTION_DATA[core]?.[sub] || {})[0]);
  }, [core, sub]);

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8 space-y-4">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Emotion → Unmet Needs Explorer
          </h1>
          <p className="text-sm muted mt-1">
            Select an emotion, then drill down to reveal unmet needs. Built for
            self-awareness, coaching, and conflict repair.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-outline"
            onClick={() => {
              setCore("Anger");
              setSub(Object.keys(EMOTION_DATA["Anger"] || {})[0]);
              setSpecific(
                Object.keys(
                  EMOTION_DATA["Anger"]?.[
                    Object.keys(EMOTION_DATA["Anger"] || {})[0]
                  ] || {}
                )[0] || ""
              );
              showToast("✓ Reset");
            }}
          >
            Reset
          </button>
        </div>
      </header>

      <div className="card">
        <div className="card-content">
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              className={`btn ${tab === "explore" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setTab("explore")}
            >
              Explore
            </button>
            <button
              className={`btn ${tab === "search" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setTab("search")}
            >
              Search
            </button>
            <button
              className={`btn ${tab === "snapshot" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setTab("snapshot")}
            >
              Snapshot
            </button>
            <button
              className={`btn ${tab === "saved" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setTab("saved")}
            >
              Saved
            </button>
          </div>

          {tab === "explore" && (
            <>
              {/* Mobile pickers */}
              <div className="block md:hidden space-y-3">
                <div>
                  <label className="text-xs uppercase tracking-wide muted">
                    Core Emotion
                  </label>
                  <select
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-3 text-base"
                    value={core}
                    onChange={(e) => setCore(e.target.value)}
                  >
                    {cores.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide muted">
                    Sub-Emotion
                  </label>
                  <select
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-3 text-base"
                    value={sub}
                    onChange={(e) => setSub(e.target.value)}
                  >
                    {subs.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide muted">
                    Specific Emotion
                  </label>
                  <select
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-3 text-base"
                    value={specific}
                    onChange={(e) => setSpecific(e.target.value)}
                  >
                    {specifics.map((sp) => (
                      <option key={sp} value={sp}>
                        {sp}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sticky bottom-3 z-10">
                  <NeedsPanel
                    core={core}
                    sub={sub}
                    specific={specific}
                    needs={needs}
                    onAddToSnapshot={addToSnapshot}
                  />
                </div>
              </div>

              {/* Desktop columns */}
              <div className="hidden md:grid grid-cols-4 gap-4">
                <Column
                  title="Core Emotions"
                  items={cores}
                  selected={core}
                  onSelect={setCore}
                />
                <Column
                  title="Sub-Emotions"
                  items={subs}
                  selected={sub}
                  onSelect={setSub}
                />
                <Column
                  title="Specific Emotions"
                  items={specifics}
                  selected={specific}
                  onSelect={setSpecific}
                />
                <NeedsPanel
                  core={core}
                  sub={sub}
                  specific={specific}
                  needs={needs}
                  onAddToSnapshot={addToSnapshot}
                />
              </div>
            </>
          )}

          {tab === "search" && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base"
                  placeholder="Type an emotion or need…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setSearch("");
                    showToast("✓ Cleared");
                  }}
                >
                  Clear
                </button>
              </div>

              <div className="max-h-[60vh] overflow-auto pr-2 space-y-2">
                {filtered.map((r) => {
                  const path = `${r.core} › ${r.sub} › ${r.specific}`;
                  const guidance = guidanceFor({
                    core: r.core,
                    sub: r.sub,
                    specific: r.specific,
                    needs: r.needs,
                  });

                  const short = [
                    `Feeling ${r.core} → ${r.sub} → ${r.specific}. Needs: ${r.needs.join(", ")}.`,
                    "",
                    "Guided Next Step:",
                    guidance,
                    "",
                    ATTR_LINE,
                  ].join("\n");

                  const long = [
                    `I am currently feeling ${r.core}, ${r.sub}, and ${r.specific}.`,
                    `My current related emotional needs are ${r.needs.join(", ")}.`,
                    "",
                    "Guided Next Step:",
                    guidance,
                    "",
                    ATTR_LINE,
                  ].join("\n");

                  return (
                    <div
                      key={path}
                      className="p-3 rounded-xl border hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Badge>{highlight(r.core, search)}</Badge>
                        <span className="opacity-60">›</span>
                        <span className="font-medium">{highlight(r.sub, search)}</span>
                        <span className="opacity-60">›</span>
                        <span className="italic">{highlight(r.specific, search)}</span>
                      </div>
                      <div className="my-2 h-px bg-gray-200" />
                      <div className="flex flex-wrap gap-2">
                        {r.needs.map((n) => (
                          <Badge key={n}>{highlight(n, search)}</Badge>
                        ))}
                      </div>
                      <div className="pt-2 flex gap-2 flex-wrap">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setCore(r.core);
                            setSub(r.sub);
                            setSpecific(r.specific);
                            setTab("explore");
                            showToast("→ Explorer");
                          }}
                        >
                          View in Explorer
                        </button>
                        <button
                          className="btn btn-copy"
                          onClick={() => copyText(short)}
                        >
                          Copy (Short)
                        </button>
                        <button
                          className="btn btn-outline"
                          onClick={() => copyText(long)}
                        >
                          Copy for Chat/Email
                        </button>
                        <button
                          className="btn btn-outline"
                          onClick={() => {
                            setSnapshot((prev) =>
                              prev.some(
                                (p) =>
                                  p.core === r.core &&
                                  p.sub === r.sub &&
                                  p.specific === r.specific
                              )
                                ? prev
                                : [...prev, r]
                            );
                            showToast("✓ Added to Snapshot");
                          }}
                        >
                          Add to Snapshot
                        </button>
                      </div>
                    </div>
                  );
                })}
                {!filtered.length && (
                  <p className="text-sm muted">
                    No matches yet. Try a simpler term (e.g., "lonely", "respect").
                  </p>
                )}
              </div>
            </div>
          )}

          {tab === "snapshot" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <button className="btn btn-ghost" onClick={() => { clearSnapshot(); showToast("✓ Cleared"); }}>
                  Clear Snapshot
                </button>
                <button className="btn btn-copy" onClick={() => copyText(snapshotShort)}>
                  Copy Snapshot (Short)
                </button>
                <button className="btn btn-outline" onClick={() => copyText(snapshotLong)}>
                  Copy Snapshot (Reflection)
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => saveSnapshot(prompt("Title for this snapshot?") || "Session")}
                >
                  Save
                </button>
              </div>
              <div className="grid gap-2">
                {snapshot.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-xl border">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge>{s.core}</Badge>
                      <span className="opacity-60">›</span>
                      <span className="font-medium">{s.sub}</span>
                      <span className="opacity-60">›</span>
                      <span className="italic">{s.specific}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {s.needs.map((n) => (
                        <Badge key={n}>{n}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
                {!snapshot.length && (
                  <p className="muted">
                    Use “Add to Snapshot” from Explore or Search to build a
                    multi-emotion view.
                  </p>
                )}
              </div>
            </div>
          )}

          {tab === "saved" && (
            <div className="space-y-3">
              {!saved.length && <p className="muted">No saved snapshots yet.</p>}
              <div className="grid gap-3">
                {saved.map((s) => (
                  <div key={s.id} className="p-3 rounded-xl border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{s.title}</div>
                        <div className="text-xs muted">
                          {new Date(s.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-outline"
                          onClick={() => copyText(JSON.stringify(s, null, 2))}
                        >
                          Copy JSON
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={() => removeSaved(s.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 space-y-2">
                      {s.items.map((it, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Badge>{it.core}</Badge>
                          <span className="opacity-60">›</span>
                          <span className="font-medium">{it.sub}</span>
                          <span className="opacity-60">›</span>
                          <span className="italic">{it.specific}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="text-xs muted pt-2">
        <p>
          Tip: When you locate an unmet need, translate it into a doable request
          (e.g., “I’m feeling irritable and need more rest. Can we end by 9pm
          tonight?”).
        </p>
      </footer>
    </div>
  );
}
