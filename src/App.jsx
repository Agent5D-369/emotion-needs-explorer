import React, { useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clipboard,
  Compass,
  HeartHandshake,
  Home,
  MessageSquareText,
  RefreshCw,
  Save,
  Search,
  Shield,
  Sparkles,
  UserRound,
} from "lucide-react";
import { EMOTION_DATA, toRows } from "./emotionData.js";
import { guidanceFor } from "./prompts.js";

const ATTR_LINE =
  "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/) · Rick Broider · Agent5D.com · HolisticLifeTribe.com";

const SITUATIONS = [
  {
    id: "disrespected",
    label: "Felt disrespected",
    hint: "tone, dismissal, insult, interruption",
    emotions: ["Anger", "Disgust", "Sadness"],
    needs: ["respect", "dignity", "acknowledgment"],
  },
  {
    id: "rejected",
    label: "Rejected or left out",
    hint: "ignored, excluded, not chosen",
    emotions: ["Sadness", "Fear", "Anger"],
    needs: ["belonging", "connection", "reassurance"],
  },
  {
    id: "pressure",
    label: "Too much pressure",
    hint: "school, work, money, performance",
    emotions: ["Fear", "Anger", "Sadness"],
    needs: ["support", "clarity", "rest"],
  },
  {
    id: "betrayal",
    label: "Trust was broken",
    hint: "lied to, exposed, let down",
    emotions: ["Anger", "Sadness", "Fear"],
    needs: ["honesty", "repair", "safety"],
  },
  {
    id: "failure",
    label: "Failed or fell short",
    hint: "mistake, loss, shame, regret",
    emotions: ["Sadness", "Fear", "Anger"],
    needs: ["encouragement", "forgiveness", "competence"],
  },
  {
    id: "conflict",
    label: "Argument or tension",
    hint: "partner, parent, teammate, friend",
    emotions: ["Anger", "Fear", "Sadness"],
    needs: ["understanding", "respect", "resolution"],
  },
];

const BODY_SIGNALS = [
  { id: "jaw", label: "Jaw tight", emotions: ["Anger"], needs: ["respect", "space"] },
  { id: "heat", label: "Heat in face", emotions: ["Anger", "Disgust"], needs: ["fairness", "dignity"] },
  { id: "chest", label: "Tight chest", emotions: ["Fear", "Sadness"], needs: ["safety", "reassurance"] },
  { id: "stomach", label: "Stomach drop", emotions: ["Fear", "Sadness"], needs: ["stability", "support"] },
  { id: "numb", label: "Numb or shut down", emotions: ["Sadness", "Fear"], needs: ["care", "space"] },
  { id: "restless", label: "Restless energy", emotions: ["Anger", "Surprise"], needs: ["movement", "clarity"] },
  { id: "urge-yell", label: "Want to yell", emotions: ["Anger"], needs: ["to be heard", "respect"] },
  { id: "urge-leave", label: "Want to leave", emotions: ["Fear", "Disgust"], needs: ["safety", "choice"] },
];

const AUDIENCES = [
  { id: "adult", label: "Man", description: "direct, accountable, relationship-ready" },
  { id: "teen", label: "Teen boy", description: "plain language, less pressure, more examples" },
  { id: "coach", label: "Father / coach", description: "questions that guide without cornering" },
];

const NEED_EXPLAINERS = {
  respect: "To be treated with dignity, not talked down to or dismissed.",
  safety: "To know you are not under threat and can slow down.",
  fairness: "To trust that the rules, load, or consequences are balanced.",
  connection: "To feel close, included, and remembered.",
  belonging: "To know there is a place for you with your people.",
  clarity: "To know what is true, what matters, and what happens next.",
  support: "To not have to carry the whole thing alone.",
  autonomy: "To have choice, voice, and room to decide.",
  rest: "To recover before you keep pushing.",
  acknowledgment: "To have your effort, pain, or truth named accurately.",
  reassurance: "To hear enough truth and steadiness to stop guessing.",
};

const SCRIPT_TYPES = [
  {
    id: "request",
    label: "Clean request",
    icon: MessageSquareText,
    build: ({ emotion, needs }) =>
      `I am feeling ${emotion || "activated"} and I need ${needs.join(", ") || "clarity"}. Could we choose one concrete next step and a time to follow up?`,
  },
  {
    id: "boundary",
    label: "Boundary",
    icon: Shield,
    build: ({ emotion, needs }) =>
      `I want to handle this well. I am feeling ${emotion || "heated"} and need ${needs[0] || "respect"}. If the tone stays sharp, I am going to pause and come back when we can speak clearly.`,
  },
  {
    id: "repair",
    label: "Repair",
    icon: HeartHandshake,
    build: ({ emotion, needs }) =>
      `I did not handle that the way I want to. Underneath it I was feeling ${emotion || "overwhelmed"} and needing ${needs.join(", ") || "support"}. I am sorry for my part. The repair I can offer now is to slow down and listen.`,
  },
  {
    id: "coach",
    label: "Coach prompt",
    icon: UserRound,
    build: ({ needs }) =>
      `Try asking: "What happened, what did your body do, and what did you need in that moment: ${needs.slice(0, 3).join(", ") || "respect, safety, or support"}?"`,
  },
];

const navItems = [
  { id: "checkin", label: "Check In", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "scripts", label: "Scripts", icon: Clipboard },
  { id: "snapshot", label: "Snapshot", icon: Sparkles },
  { id: "saved", label: "Saved", icon: BookOpen },
];

function showToast(msg) {
  const id = "ene_toast_portal";
  let portal = document.getElementById(id);
  if (!portal) {
    portal = document.createElement("div");
    portal.id = id;
    portal.style.position = "fixed";
    portal.style.left = "50%";
    portal.style.bottom = "84px";
    portal.style.transform = "translateX(-50%)";
    portal.style.zIndex = "9999";
    document.body.appendChild(portal);
  }
  const node = document.createElement("div");
  node.className =
    "rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-950 shadow-lg";
  node.textContent = msg;
  portal.appendChild(node);
  setTimeout(() => node.remove(), 1500);
}

function copyText(text) {
  const fallback = () => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(
      () => showToast("Copied"),
      () => {
        fallback();
        showToast("Copied");
      }
    );
    return;
  }
  fallback();
  showToast("Copied");
}

function cls(...parts) {
  return parts.filter(Boolean).join(" ");
}

function Button({ children, onClick, variant = "primary", className = "", disabled = false, type = "button" }) {
  const variants = {
    primary: "bg-stone-950 text-white hover:bg-stone-800",
    secondary: "border border-stone-200 bg-white text-stone-950 hover:bg-stone-50",
    ghost: "text-stone-700 hover:bg-stone-100",
    amber: "bg-amber-500 text-stone-950 hover:bg-amber-400",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cls(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

function Chip({ children, active, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cls(
        "min-h-11 min-w-0 max-w-full rounded-lg border px-3 py-2 text-left text-sm font-semibold transition",
        active
          ? "border-stone-950 bg-stone-950 text-white shadow-sm"
          : "border-stone-200 bg-white text-stone-800 hover:border-stone-400",
        className
      )}
    >
      {children}
    </button>
  );
}

function SectionTitle({ title, copy }) {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-bold tracking-normal text-stone-950 md:text-2xl">{title}</h2>
      {copy ? <p className="text-sm leading-6 text-stone-600">{copy}</p> : null}
    </div>
  );
}

function AppShell({ tab, setTab, children }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-stone-950">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
        <aside className="hidden w-64 shrink-0 border-r border-stone-200 px-5 py-6 md:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-950 text-white">
              <Activity size={20} />
            </div>
            <div>
              <div className="text-sm font-black uppercase tracking-wide">NeedCompass</div>
              <div className="text-xs text-stone-500">Name it. Decode it. Move well.</div>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cls(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition",
                  tab === id ? "bg-stone-950 text-white" : "text-stone-700 hover:bg-stone-100"
                )}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden pb-24 md:pb-0">
          <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="max-w-[19rem] text-base font-black tracking-normal sm:max-w-none sm:text-lg md:text-2xl">
                  Emotion → Unmet Needs Explorer
                </h1>
                <p className="hidden text-sm text-stone-600 md:block">
                  A practical emotional intelligence tool for men, boys, fathers, coaches, and mentors.
                </p>
              </div>
              <Button variant="secondary" className="hidden md:inline-flex" onClick={() => setTab("checkin")}>
                <RefreshCw size={16} />
                New check-in
              </Button>
            </div>
          </header>
          <div className="min-w-0 px-4 py-5 md:px-8 md:py-8">{children}</div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white md:hidden">
        <div className="grid w-full max-w-full" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cls(
                "flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-bold min-[360px]:text-[11px]",
                tab === id ? "text-stone-950" : "text-stone-500"
              )}
            >
              <Icon size={20} strokeWidth={tab === id ? 2.6 : 2} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function ProgressRail({ step }) {
  const steps = ["Context", "Body", "Emotion", "Need", "Move"];
  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-stone-50 p-3 md:p-4">
      <div className="grid grid-cols-5 gap-1 md:block md:space-y-2">
        {steps.map((label, idx) => (
          <div key={label} className="flex items-center gap-2 md:gap-3">
            <div
              className={cls(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black",
                idx < step
                  ? "bg-emerald-600 text-white"
                  : idx === step
                  ? "bg-stone-950 text-white"
                  : "bg-white text-stone-500 ring-1 ring-stone-200"
              )}
            >
              {idx < step ? <Check size={14} /> : idx + 1}
            </div>
            <span className={cls("hidden text-sm font-semibold md:inline", idx <= step ? "text-stone-950" : "text-stone-500")}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NeedBadges({ needs }) {
  return (
    <div className="flex flex-wrap gap-2">
      {needs.map((need) => (
        <span key={need} className="rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-800">
          {need}
        </span>
      ))}
    </div>
  );
}

function GuidedCheckIn({ rows, snapshot, setSnapshot, setTab }) {
  const [step, setStep] = useState(0);
  const [audience, setAudience] = useState("adult");
  const [situationId, setSituationId] = useState(SITUATIONS[0].id);
  const [bodyIds, setBodyIds] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);

  const situation = SITUATIONS.find((item) => item.id === situationId) || SITUATIONS[0];
  const selectedBody = BODY_SIGNALS.filter((item) => bodyIds.includes(item.id));

  const suggestions = useMemo(() => {
    const emotionScores = new Map();
    situation.emotions.forEach((emotion, idx) => emotionScores.set(emotion, 5 - idx));
    selectedBody.forEach((signal) =>
      signal.emotions.forEach((emotion) => emotionScores.set(emotion, (emotionScores.get(emotion) || 0) + 3))
    );
    return rows
      .map((row) => ({
        ...row,
        score:
          (emotionScores.get(row.core) || 0) +
          row.needs.reduce((score, need) => score + (situation.needs.includes(need) ? 2 : 0), 0),
      }))
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score || a.specific.localeCompare(b.specific))
      .slice(0, 8);
  }, [rows, selectedBody, situation]);

  const activePath = selectedPath || suggestions[0] || rows[0];
  const inferredNeeds = useMemo(() => {
    const all = new Set([...(activePath?.needs || []), ...situation.needs]);
    selectedBody.forEach((signal) => signal.needs.forEach((need) => all.add(need)));
    return Array.from(all).slice(0, 7);
  }, [activePath, selectedBody, situation]);

  const scriptContext = {
    emotion: activePath?.specific || activePath?.sub || activePath?.core,
    needs: inferredNeeds,
  };
  const primaryScript = SCRIPT_TYPES[0].build(scriptContext);
  const guidedPrompt = guidanceFor({ ...activePath, needs: inferredNeeds });
  const audienceCopy = {
    adult: "This is not about being soft. It is about reading the signal before it drives your next move.",
    teen: "You do not have to explain it perfectly. Pick the closest answer and keep going.",
    coach: "Guide with curiosity. The goal is to help him name the signal without cornering him.",
  }[audience];

  const toggleBody = (id) => {
    setBodyIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const addCurrentToSnapshot = () => {
    const entry = {
      core: activePath.core,
      sub: activePath.sub,
      specific: activePath.specific,
      needs: inferredNeeds,
      situation: situation.label,
      script: primaryScript,
      createdAt: new Date().toISOString(),
    };
    setSnapshot((prev) =>
      prev.some((item) => item.core === entry.core && item.sub === entry.sub && item.specific === entry.specific)
        ? prev
        : [entry, ...prev]
    );
    showToast("Added to snapshot");
  };

  const summary = [
    `Situation: ${situation.label}`,
    `Body signals: ${selectedBody.map((item) => item.label).join(", ") || "not selected"}`,
    `Likely emotion: ${activePath.core} / ${activePath.sub} / ${activePath.specific}`,
    `Unmet needs: ${inferredNeeds.join(", ")}`,
    "",
    "Next move:",
    primaryScript,
    "",
    "Guided next step:",
    guidedPrompt,
    "",
    ATTR_LINE,
  ].join("\n");

  return (
    <div className="grid min-w-0 max-w-full gap-4 overflow-hidden lg:grid-cols-[220px_minmax(0,1fr)_340px] lg:overflow-visible">
      <ProgressRail step={step} />

      <section className="min-w-0 max-w-full overflow-hidden rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-6">
        {step === 0 && (
          <div className="space-y-5">
            <SectionTitle
              title="What happened?"
              copy="Start with the situation, not the perfect emotion word. The app will help translate the signal."
            />
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              {SITUATIONS.map((item) => (
                <Chip key={item.id} active={situationId === item.id} onClick={() => setSituationId(item.id)}>
                  <span className="block">{item.label}</span>
                  <span className={cls("mt-1 block text-xs font-medium", situationId === item.id ? "text-stone-300" : "text-stone-500")}>
                    {item.hint}
                  </span>
                </Chip>
              ))}
            </div>
            <div className="border-t border-stone-200 pt-4">
              <div className="mb-2 text-sm font-bold text-stone-950">Who is using this?</div>
              <div className="grid min-w-0 gap-2 sm:grid-cols-3">
                {AUDIENCES.map((item) => (
                  <Chip key={item.id} active={audience === item.id} onClick={() => setAudience(item.id)}>
                    <span className="block">{item.label}</span>
                    <span className={cls("mt-1 block text-xs font-medium", audience === item.id ? "text-stone-300" : "text-stone-500")}>
                      {item.description}
                    </span>
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <SectionTitle
              title="What did your body do?"
              copy="The body often tells the truth before language catches up. Pick every signal that fits."
            />
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              {BODY_SIGNALS.map((item) => (
                <Chip key={item.id} active={bodyIds.includes(item.id)} onClick={() => toggleBody(item.id)}>
                  {item.label}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <SectionTitle
              title="What word is closest?"
              copy="Do not force certainty. Choose the closest match, then adjust if another word lands better."
            />
            <div className="grid gap-2">
              {suggestions.map((row) => {
                const active = activePath && row.core === activePath.core && row.sub === activePath.sub && row.specific === activePath.specific;
                return (
                  <button
                    key={`${row.core}-${row.sub}-${row.specific}`}
                    onClick={() => setSelectedPath(row)}
                    className={cls(
                      "rounded-lg border p-3 text-left transition",
                      active ? "border-stone-950 bg-stone-950 text-white" : "border-stone-200 bg-white hover:border-stone-400"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-black">{row.specific}</div>
                        <div className={cls("text-xs font-semibold", active ? "text-stone-300" : "text-stone-500")}>
                          {row.core} / {row.sub}
                        </div>
                      </div>
                      <NeedBadges needs={row.needs.slice(0, 3)} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <SectionTitle
              title="What need is underneath?"
              copy="A need is not an excuse. It is the signal that tells you what kind of repair, request, or boundary matters."
            />
            <NeedBadges needs={inferredNeeds} />
            <div className="grid gap-2">
              {inferredNeeds.slice(0, 6).map((need) => (
                <div key={need} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
                  <div className="text-sm font-black capitalize text-stone-950">{need}</div>
                  <div className="mt-1 text-sm leading-6 text-stone-600">
                    {NEED_EXPLAINERS[need] || "Something important was asking to be named, protected, or requested clearly."}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <SectionTitle
              title="Choose the next strong move"
              copy="The goal is not to suppress the emotion. The goal is to act with enough clarity that you respect yourself afterward."
            />
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="text-sm font-black text-stone-950">Recommended script</div>
              <p className="mt-2 text-base leading-7 text-stone-800">{primaryScript}</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-4">
              <div className="text-sm font-black text-stone-950">Guided next step</div>
              <p className="mt-2 text-sm leading-6 text-stone-700">{guidedPrompt}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <Button variant="amber" onClick={() => copyText(summary)}>
                <Clipboard size={16} />
                Copy
              </Button>
              <Button variant="secondary" onClick={addCurrentToSnapshot}>
                <Save size={16} />
                Save
              </Button>
              <Button variant="secondary" onClick={() => setTab("scripts")}>
                More scripts
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>
            <ArrowLeft size={16} />
            Back
          </Button>
          <Button variant="primary" disabled={step === 4} onClick={() => setStep((value) => Math.min(4, value + 1))}>
            Next
            <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      <aside className="min-w-0 max-w-full space-y-4">
        <div className="rounded-lg border border-stone-200 bg-stone-950 p-4 text-white">
          <div className="text-sm font-black">Current read</div>
          <div className="mt-3 text-2xl font-black">{activePath?.specific}</div>
          <div className="text-sm text-stone-300">
            {activePath?.core} / {activePath?.sub}
          </div>
          <div className="mt-4">
            <NeedBadges needs={inferredNeeds.slice(0, 5)} />
          </div>
        </div>
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <div className="text-sm font-black text-stone-950">Frame</div>
          <p className="mt-2 text-sm leading-6 text-stone-700">{audienceCopy}</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="text-sm font-black text-stone-950">Snapshot count</div>
          <div className="mt-1 text-3xl font-black text-stone-950">{snapshot.length}</div>
          <p className="text-sm text-stone-600">Saved signals from this session.</p>
        </div>
      </aside>
    </div>
  );
}

function Explore({ rows, setSnapshot }) {
  const [query, setQuery] = useState("");
  const [core, setCore] = useState("Anger");
  const [sub, setSub] = useState(Object.keys(EMOTION_DATA.Anger || {})[0]);
  const [specific, setSpecific] = useState(Object.keys(EMOTION_DATA.Anger?.[sub] || {})[0]);

  const cores = Object.keys(EMOTION_DATA);
  const subs = Object.keys(EMOTION_DATA[core] || {});
  const specifics = Object.keys(EMOTION_DATA[core]?.[sub] || {});
  const needs = EMOTION_DATA[core]?.[sub]?.[specific] || [];
  const filtered = rows.filter((row) =>
    [row.core, row.sub, row.specific, row.needs.join(" ")].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  const chooseCore = (nextCore) => {
    const nextSub = Object.keys(EMOTION_DATA[nextCore] || {})[0] || "";
    const nextSpecific = Object.keys(EMOTION_DATA[nextCore]?.[nextSub] || {})[0] || "";
    setCore(nextCore);
    setSub(nextSub);
    setSpecific(nextSpecific);
  };
  const chooseSub = (nextSub) => {
    setSub(nextSub);
    setSpecific(Object.keys(EMOTION_DATA[core]?.[nextSub] || {})[0] || "");
  };

  const payload = [
    `Feeling ${core} / ${sub} / ${specific}.`,
    `Unmet needs: ${needs.join(", ")}`,
    "",
    "Guided next step:",
    guidanceFor({ core, sub, specific, needs }),
    "",
    ATTR_LINE,
  ].join("\n");

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <SectionTitle title="Explore the map" copy="Browse emotions directly or search by word, need, or situation." />
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-stone-400" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lonely, respect, anxious..."
              className="h-11 w-full rounded-lg border border-stone-200 pl-10 pr-3 text-sm outline-none focus:border-stone-950"
            />
          </div>
          <Button variant="secondary" onClick={() => setQuery("")}>Clear</Button>
        </div>

        {query ? (
          <div className="grid gap-2">
            {filtered.slice(0, 40).map((row) => (
              <button
                key={`${row.core}-${row.sub}-${row.specific}`}
                onClick={() => {
                  setCore(row.core);
                  setSub(row.sub);
                  setSpecific(row.specific);
                  setQuery("");
                }}
                className="rounded-lg border border-stone-200 bg-white p-3 text-left hover:border-stone-400"
              >
                <div className="font-black text-stone-950">{row.specific}</div>
                <div className="text-sm text-stone-500">{row.core} / {row.sub}</div>
                <div className="mt-2"><NeedBadges needs={row.needs} /></div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-black">Core</div>
              {cores.map((item) => <Chip key={item} active={core === item} onClick={() => chooseCore(item)} className="w-full">{item}</Chip>)}
            </div>
            <div className="space-y-2">
              <div className="text-sm font-black">Sub-emotion</div>
              {subs.map((item) => <Chip key={item} active={sub === item} onClick={() => chooseSub(item)} className="w-full">{item}</Chip>)}
            </div>
            <div className="space-y-2">
              <div className="text-sm font-black">Specific</div>
              {specifics.map((item) => <Chip key={item} active={specific === item} onClick={() => setSpecific(item)} className="w-full">{item}</Chip>)}
            </div>
          </div>
        )}
      </section>

      <aside className="rounded-lg border border-stone-200 bg-stone-50 p-4">
        <div className="text-sm font-black">Selected signal</div>
        <div className="mt-2 text-2xl font-black">{specific}</div>
        <div className="text-sm text-stone-500">{core} / {sub}</div>
        <div className="mt-4"><NeedBadges needs={needs} /></div>
        <div className="mt-4 rounded-lg border border-stone-200 bg-white p-3">
          <div className="text-sm font-black">Next step</div>
          <p className="mt-1 text-sm leading-6 text-stone-700">{guidanceFor({ core, sub, specific, needs })}</p>
        </div>
        <div className="mt-4 grid gap-2">
          <Button variant="amber" onClick={() => copyText(payload)}><Clipboard size={16} />Copy</Button>
          <Button
            variant="secondary"
            onClick={() => {
              setSnapshot((prev) => [{ core, sub, specific, needs, createdAt: new Date().toISOString() }, ...prev]);
              showToast("Added to snapshot");
            }}
          >
            <Save size={16} />Save to snapshot
          </Button>
        </div>
      </aside>
    </div>
  );
}

function Scripts({ latest }) {
  const context = {
    emotion: latest?.specific || "activated",
    needs: latest?.needs || ["respect", "clarity", "support"],
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Scripts that turn insight into action"
        copy="Use these when you need words for a request, a boundary, a repair, or a coaching conversation."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {SCRIPT_TYPES.map(({ id, label, icon: Icon, build }) => {
          const script = build(context);
          return (
            <div key={id} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-950 text-white">
                  <Icon size={18} />
                </div>
                <div className="font-black">{label}</div>
              </div>
              <p className="mt-4 min-h-28 text-sm leading-6 text-stone-700">{script}</p>
              <Button variant="secondary" className="mt-4 w-full" onClick={() => copyText(`${script}\n\n${ATTR_LINE}`)}>
                <Clipboard size={16} />
                Copy script
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Snapshot({ snapshot, setSnapshot, setSaved }) {
  const needs = Array.from(new Set(snapshot.flatMap((item) => item.needs || [])));
  const payload = [
    "Emotional snapshot",
    ...snapshot.map((item) => `- ${item.core} / ${item.sub} / ${item.specific}: ${item.needs.join(", ")}`),
    "",
    `Converging needs: ${needs.join(", ")}`,
    "",
    ATTR_LINE,
  ].join("\n");

  return (
    <div className="space-y-4">
      <SectionTitle title="Snapshot" copy="A saved view of what keeps showing up in this session." />
      <div className="grid gap-2 sm:grid-cols-3">
        <Button variant="amber" disabled={!snapshot.length} onClick={() => copyText(payload)}><Clipboard size={16} />Copy</Button>
        <Button
          variant="secondary"
          disabled={!snapshot.length}
          onClick={() => {
            const entry = { id: Date.now(), createdAt: new Date().toISOString(), items: snapshot };
            setSaved((prev) => [entry, ...prev]);
            showToast("Saved");
          }}
        >
          <Save size={16} />Save
        </Button>
        <Button variant="ghost" disabled={!snapshot.length} onClick={() => setSnapshot([])}>Clear</Button>
      </div>
      {needs.length ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="text-sm font-black">Converging unmet needs</div>
          <div className="mt-3"><NeedBadges needs={needs} /></div>
        </div>
      ) : null}
      <div className="grid gap-3">
        {snapshot.map((item, index) => (
          <div key={`${item.core}-${item.sub}-${item.specific}-${index}`} className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="font-black">{item.specific}</div>
            <div className="text-sm text-stone-500">{item.core} / {item.sub}</div>
            {item.situation ? <div className="mt-1 text-sm text-stone-600">{item.situation}</div> : null}
            <div className="mt-3"><NeedBadges needs={item.needs} /></div>
          </div>
        ))}
        {!snapshot.length ? <p className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">No snapshot items yet. Run Check In or save from Explore.</p> : null}
      </div>
    </div>
  );
}

function Saved({ saved, setSaved }) {
  return (
    <div className="space-y-4">
      <SectionTitle title="Saved history" copy="A private local timeline of sessions. This stays in this browser." />
      <div className="grid gap-3">
        {saved.map((entry) => (
          <div key={entry.id} className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-black">{new Date(entry.createdAt).toLocaleString()}</div>
                <div className="text-sm text-stone-500">{entry.items.length} saved signals</div>
              </div>
              <Button variant="ghost" onClick={() => setSaved((prev) => prev.filter((item) => item.id !== entry.id))}>Delete</Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {entry.items.map((item, index) => (
                <span key={`${item.specific}-${index}`} className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold">
                  {item.specific}
                </span>
              ))}
            </div>
          </div>
        ))}
        {!saved.length ? <p className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">No saved sessions yet.</p> : null}
      </div>
    </div>
  );
}

export default function App() {
  const rows = useMemo(() => toRows(), []);
  const [tab, setTab] = useState("checkin");
  const [snapshot, setSnapshot] = useState([]);
  const [saved, setSavedState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ene_saved_sessions_v2") || "[]");
    } catch {
      return [];
    }
  });

  const setSaved = (nextOrFn) => {
    setSavedState((prev) => {
      const next = typeof nextOrFn === "function" ? nextOrFn(prev) : nextOrFn;
      localStorage.setItem("ene_saved_sessions_v2", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AppShell tab={tab} setTab={setTab}>
      {tab === "checkin" && <GuidedCheckIn rows={rows} snapshot={snapshot} setSnapshot={setSnapshot} setTab={setTab} />}
      {tab === "explore" && <Explore rows={rows} setSnapshot={setSnapshot} />}
      {tab === "scripts" && <Scripts latest={snapshot[0]} />}
      {tab === "snapshot" && <Snapshot snapshot={snapshot} setSnapshot={setSnapshot} setSaved={setSaved} />}
      {tab === "saved" && <Saved saved={saved} setSaved={setSaved} />}
    </AppShell>
  );
}
