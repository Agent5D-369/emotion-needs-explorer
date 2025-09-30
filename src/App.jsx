import React, { useMemo, useState, useEffect } from 'react'
import { EMOTION_DATA, toRows } from './emotionData.js'
import './index.css'

const ATTR_LINE = "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/) · Rick Broider · Agent5D.com · HolisticLifeTribe.com";

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => fallback());
  }
  return fallback();
  function fallback() {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      document.body.removeChild(ta);
      return false;
    }
  }
}

function Button({ children, onClick, variant='ghost', className='' }) {
  const base = 'btn ' + (variant === 'primary' ? 'btn-primary' : variant === 'outline' ? 'btn-outline' : 'btn-ghost');
  return <button onClick={onClick} className={`${base} ${className}`}>{children}</button>
}
const Badge = ({ children }) => <span className="badge">{children}</span>;

function Column({ title, items, selected, onSelect }) {
  return (
    <div className="card h-full">
      <div className="card-header">
        <div className="card-title">{title}</div>
      </div>
      <div className="card-content space-y-2 max-h-[56vh] overflow-auto pr-2">
        {items.map((item) => (
          <Button
            key={item}
            variant={selected === item ? 'primary' : 'ghost'}
            className="w-full justify-between text-left"
            onClick={() => onSelect(item)}
          >
            <span>{item}</span>
            <span className="opacity-60">›</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

function NeedsPanel({ core, sub, specific, needs }) {
  const [copied, setCopied] = React.useState(false);
  const path = [core, sub, specific].filter(Boolean).join(' / ');

  const doCopy = async () => {
    const payload = `${specific}: ${needs.join(', ')}\n\n${ATTR_LINE}`;
    const ok = await copyText(payload);
    setCopied(!!ok);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="card h-full">
      <div className="card-header">
        <div className="card-title">Unmet Needs</div>
        <p className="text-sm muted">{path || 'Select an emotion to view its needs.'}</p>
      </div>
      <div className="card-content space-y-3">
        {needs?.length ? (
          <>
            <div className="flex flex-wrap gap-2">
              {needs.map((n) => <span key={n} className="badge">{n}</span>)}
            </div>
            <div className="flex gap-2 pt-2 items-center">
              <button className="btn btn-outline" onClick={doCopy}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </>
        ) : (
          <p className="muted">No needs selected yet.</p>
        )}
      </div>
    </div>
  )
}

function downloadCSV(rows) {
  const header = ['Core Emotion','Sub-Emotion','Specific Emotion','Unmet Needs'].join(',');
  const lines = rows.map(r => [r.core, r.sub, r.specific, r.needs.join('; ')].map(v => `"${v}"`).join(','));
  const csv = [header, ...lines, '', ATTR_LINE].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'emotion_needs.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const rows = useMemo(() => toRows(), [])
  const cores = useMemo(() => Object.keys(EMOTION_DATA), [])

  const [tab, setTab] = useState('explore')
  const [search, setSearch] = useState('')
  const [core, setCore] = useState('Anger')
  const [sub, setSub] = useState('Rage')
  const [specific, setSpecific] = useState('Hateful')

  const subs = useMemo(() => Object.keys(EMOTION_DATA[core] || {}), [core])
  const specifics = useMemo(() => Object.keys(EMOTION_DATA[core]?.[sub] || {}), [core, sub])
  const needs = useMemo(() => EMOTION_DATA[core]?.[sub]?.[specific] || [], [core, sub, specific])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(r => [r.core, r.sub, r.specific, r.needs.join(' ')].join(' ').toLowerCase().includes(q))
  }, [rows, search])

  useEffect(() => { setSub(Object.keys(EMOTION_DATA[core] || {})[0]) }, [core])
  useEffect(() => { setSpecific(Object.keys(EMOTION_DATA[core]?.[sub] || {})[0]) }, [core, sub])

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8 space-y-4">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Emotion → Unmet Needs Explorer</h1>
          <p className="text-sm muted mt-1">Select an emotion, then drill down to reveal the hidden unmet needs. Built for self-awareness, coaching, and conflict repair.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setCore('Anger'); setSub('Rage'); setSpecific('Hateful'); }}>Reset</Button>
          <Button variant="primary" onClick={() => downloadCSV(filtered)}>Export CSV</Button>
        </div>
      </header>

      <div className="card">
        <div className="card-content">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button className={`btn ${tab==='explore' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('explore')}>Explore</button>
            <button className={`btn ${tab==='search' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('search')}>Search</button>
          </div>

          {tab === 'explore' and (
            <>
              {/* Mobile selectors */}
              <div className="block md:hidden space-y-3">
                <div>
                  <label className="text-xs uppercase tracking-wide muted">Core Emotion</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-3 text-base"
                    value={core}
                    onChange={(e) => setCore(e.target.value)}
                  >
                    {cores.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide muted">Sub-Emotion</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-3 text-base"
                    value={sub}
                    onChange={(e) => setSub(e.target.value)}
                  >
                    {subs.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide muted">Specific Emotion</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-3 text-base"
                    value={specific}
                    onChange={(e) => setSpecific(e.target.value)}
                  >
                    {specifics.map(sp => <option key={sp} value={sp}>{sp}</option>)}
                  </select>
                </div>
                <div className="sticky bottom-3 z-10"><NeedsPanel core={core} sub={sub} specific={specific} needs={needs} /></div>
              </div>

              {/* Desktop columns */}
              <div className="hidden md:grid grid-cols-4 gap-4">
                <Column title="Core Emotions" items={cores} selected={core} onSelect={setCore} />
                <Column title="Sub-Emotions" items={subs} selected={sub} onSelect={setSub} />
                <Column title="Specific Emotions" items={specifics} selected={specific} onSelect={setSpecific} />
                <NeedsPanel core={core} sub={sub} specific={specific} needs={needs} />
              </div>
            </>
          )}

          {tab === 'search' and (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base"
                  placeholder="Type an emotion or need…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="outline" onClick={() => setSearch('')}>Clear</Button>
              </div>

              <div className="max-h-[60vh] overflow-auto pr-2 space-y-2">
                {filtered.map((r) => (
                  <div key={`${r.core}-${r.sub}-${r.specific}`} className="p-3 rounded-xl border hover:bg-gray-50 transition">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge>{r.core}</Badge>
                      <span className="opacity-60">›</span>
                      <span className="font-medium">{r.sub}</span>
                      <span className="opacity-60">›</span>
                      <span className="italic">{r.specific}</span>
                    </div>
                    <div className="my-2 h-px bg-gray-200" />
                    <div className="flex flex-wrap gap-2">
                      {r.needs.map((n) => <Badge key={n}>{n}</Badge>)}
                    </div>
                    <div className="pt-2">
                      <Button variant="ghost" onClick={() => { setCore(r.core); setSub(r.sub); setSpecific(r.specific); setTab('explore'); }}>View in Explorer</Button>
                      <Button variant="outline" onClick={() => copyText(`${r.specific}: ${r.needs.join(', ')}\n\n${ATTR_LINE}`)} className="ml-2">Copy</Button>
                    </div>
                  </div>
                ))}
                {!filtered.length && (
                  <p className="text-sm muted">No matches yet. Try a simpler term (e.g., "lonely", "respect").</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="text-xs muted pt-2">
        <p>Tip: When you locate an unmet need, translate it into a doable request (e.g., “I’m feeling irritable and need more rest. Can we end by 9pm tonight?”).</p>
      </footer>
    </div>
  )
}
