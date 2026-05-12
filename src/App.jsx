import React, { useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
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
  Palette,
  Trophy,
  UserRound,
} from "lucide-react";
import { EMOTION_DATA, toRows } from "./emotionData.js";
import { guidanceFor } from "./prompts.js";

const ATTR_LINE =
  "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/) · Rick Broider · Agent5D.com · HolisticLifeTribe.com";
const CALENDAR_URL = "https://calendar.app.google/NQvsMN7X5evMK9Q1A";

const THEMES = [
  {
    id: "sage",
    label: "Light: Sage Ground",
    mode: "light",
    bg: "bg-[#f7faf7]",
    surface: "bg-white",
    panel: "bg-[#eef6ef]",
    accent: "bg-[#6f9b78]",
    accentText: "text-white",
    text: "text-[#17231b]",
    muted: "text-[#5f6f64]",
    border: "border-[#dce8dd]",
    selected: "bg-[#315c3b] text-white border-[#315c3b]",
    soft: "bg-[#edf6ee] border-[#cfe1d1]",
  },
  {
    id: "sky",
    label: "Light: Clear Sky",
    mode: "light",
    bg: "bg-[#f5f8fb]",
    surface: "bg-white",
    panel: "bg-[#eef5fb]",
    accent: "bg-[#4f83a5]",
    accentText: "text-white",
    text: "text-[#172330]",
    muted: "text-[#607080]",
    border: "border-[#d9e5ef]",
    selected: "bg-[#285a78] text-white border-[#285a78]",
    soft: "bg-[#eef6fb] border-[#cfe0ec]",
  },
  {
    id: "clay",
    label: "Light: Warm Clay",
    mode: "light",
    bg: "bg-[#fbf7f2]",
    surface: "bg-white",
    panel: "bg-[#f7efe5]",
    accent: "bg-[#c57b57]",
    accentText: "text-white",
    text: "text-[#2b211b]",
    muted: "text-[#746457]",
    border: "border-[#eaded1]",
    selected: "bg-[#8c4f35] text-white border-[#8c4f35]",
    soft: "bg-[#fff3e8] border-[#ead5c2]",
  },
  {
    id: "forest",
    label: "Dark: Forest Night",
    mode: "dark",
    bg: "bg-[#111a15]",
    surface: "bg-[#17231b]",
    panel: "bg-[#203427]",
    accent: "bg-[#93c59b]",
    accentText: "text-[#101a13]",
    text: "text-[#eef7ef]",
    muted: "text-[#b8c8bb]",
    border: "border-[#314739]",
    selected: "bg-[#93c59b] text-[#101a13] border-[#93c59b]",
    soft: "bg-[#1c2d22] border-[#3a5642]",
  },
  {
    id: "navy",
    label: "Dark: Harbor Blue",
    mode: "dark",
    bg: "bg-[#101720]",
    surface: "bg-[#172231]",
    panel: "bg-[#1f3347]",
    accent: "bg-[#8ec5dd]",
    accentText: "text-[#0f1720]",
    text: "text-[#eef6fb]",
    muted: "text-[#b8cad8]",
    border: "border-[#31485d]",
    selected: "bg-[#8ec5dd] text-[#0f1720] border-[#8ec5dd]",
    soft: "bg-[#1a2b3d] border-[#38546b]",
  },
  {
    id: "ember",
    label: "Dark: Ember Calm",
    mode: "dark",
    bg: "bg-[#1c1512]",
    surface: "bg-[#271d18]",
    panel: "bg-[#36261f]",
    accent: "bg-[#e2a46f]",
    accentText: "text-[#1d140f]",
    text: "text-[#fff7ef]",
    muted: "text-[#d6c2b2]",
    border: "border-[#4b362b]",
    selected: "bg-[#e2a46f] text-[#1d140f] border-[#e2a46f]",
    soft: "bg-[#33231c] border-[#573c2f]",
  },
];

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

const CHECKIN_GUIDANCE = [
  "You do not need the perfect word yet. Start with the event, then let the body signals narrow the map.",
  "A feeling points to a need. A need points to a clean request, repair, boundary, or pause.",
  "If the moment is intense, use the final script after your body settles enough to speak clearly.",
];

const CORRECTIVE_ACTIONS = [
  {
    title: "Regulate first",
    copy: "Take 90 seconds before the conversation if your body is hot, tight, numb, or ready to attack. Breathe lower, unclench your jaw, relax your hands, and reduce stimulation.",
  },
  {
    title: "Name the need without blaming",
    copy: "Use one need word as the center of the conversation. Try respect, clarity, reassurance, support, safety, rest, connection, or fairness.",
  },
  {
    title: "Make one doable request",
    copy: "Ask for a behavior that can happen today. Good requests are specific, time-bound, and observable.",
  },
  {
    title: "Set a follow-up",
    copy: "Needs get met through repeated action. Choose when you will check whether the request, boundary, or repair actually worked.",
  },
];

const SHADOW_PATTERNS = [
  {
    id: "control",
    label: "Control",
    triggers: ["Anger", "Fear", "autonomy", "safety", "clarity"],
    signal: "The energy may try to force certainty, compliance, or a quick answer.",
    move: "Slow the demand down. Ask for one clear agreement instead of trying to control the whole person or outcome.",
  },
  {
    id: "withdrawal",
    label: "Withdrawal",
    triggers: ["Sadness", "Fear", "rest", "safety", "care", "space"],
    signal: "The energy may pull you into silence, distance, or disappearance.",
    move: "Name that you need space and give a return time. Space works best when it has a responsible re-entry.",
  },
  {
    id: "attack",
    label: "Attack",
    triggers: ["Anger", "Disgust", "respect", "fairness", "dignity"],
    signal: "The energy may push you to win, shame, interrupt, or make the other person pay.",
    move: "Protect the need without attacking. Use a boundary or request that names behavior, not character.",
  },
  {
    id: "approval",
    label: "Approval seeking",
    triggers: ["Sadness", "Happiness", "belonging", "connection", "reassurance"],
    signal: "The energy may make you abandon your own truth to keep closeness.",
    move: "Stay connected without self-erasing. Say what is true and ask for reassurance directly.",
  },
  {
    id: "numbing",
    label: "Numbing",
    triggers: ["Sadness", "Fear", "rest", "support", "overwhelmed"],
    signal: "The energy may try to shut off through scrolling, food, substances, sleep, or avoidance.",
    move: "Choose one low-friction care action first: water, movement, shower, daylight, or a direct check-in with someone safe.",
  },
  {
    id: "story",
    label: "Story spiral",
    triggers: ["Fear", "Surprise", "clarity", "reassurance", "trust"],
    signal: "The mind may start filling gaps with worst-case stories.",
    move: "Separate fact from interpretation. Ask for the missing information before acting on the story.",
  },
];

function getRelevantShadows({ core, needs, bodyLabels, situationLabel }) {
  const signals = [core, situationLabel, ...needs, ...bodyLabels].filter(Boolean).map((item) => item.toLowerCase());
  return SHADOW_PATTERNS.map((shadow) => ({
    ...shadow,
    score: shadow.triggers.reduce((total, trigger) => {
      const q = trigger.toLowerCase();
      return total + (signals.some((signal) => signal.includes(q) || q.includes(signal)) ? 1 : 0);
    }, 0),
  }))
    .filter((shadow) => shadow.score > 0)
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
    .slice(0, 3);
}

const SCRIPT_TYPES = [
  {
    id: "request",
    label: "Clean request",
    icon: MessageSquareText,
    build: ({ emotion, needs, situation }) =>
      `I am feeling ${emotion || "activated"} around ${situation || "this situation"} and I need ${needs.join(", ") || "clarity"}. Could we choose one concrete next step and a time to follow up?`,
  },
  {
    id: "boundary",
    label: "Boundary",
    icon: Shield,
    build: ({ emotion, needs }) =>
      `I want to handle this well. I am feeling ${emotion || "heated"} and need ${needs[0] || "respect"}. If this keeps moving in a way that blocks that need, I am going to pause and come back with a clear request.`,
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
    build: ({ needs, emotion }) =>
      `Try asking: "When ${emotion || "that feeling"} showed up, what did your body do, and which need was asking for attention: ${needs.slice(0, 3).join(", ") || "respect, safety, or support"}?"`,
  },
];

const navItems = [
  { id: "checkin", label: "Check In", icon: Home },
  { id: "explore", label: "Feelings", icon: Compass },
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
    primary: "bg-emerald-800 text-white hover:bg-emerald-700",
    secondary: "border border-stone-200 bg-white text-stone-950 hover:bg-stone-50",
    ghost: "text-stone-700 hover:bg-stone-100",
    amber: "bg-teal-700 text-white hover:bg-teal-600",
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
          ? "border-emerald-800 bg-emerald-800 text-white shadow-sm"
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

function ThemePicker({ themeId, setThemeId, compact = false }) {
  return (
    <div className={cls("grid gap-2", compact ? "grid-cols-2" : "grid-cols-1")}>
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          onClick={() => setThemeId(theme.id)}
          className={cls(
            "flex min-h-10 items-center gap-2 rounded-lg border px-3 text-left text-xs font-bold transition",
            themeId === theme.id ? "border-emerald-700 bg-emerald-50 text-emerald-950" : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
          )}
        >
          <span className={cls("h-4 w-4 rounded-full", theme.accent)} />
          <span>{theme.label}</span>
        </button>
      ))}
    </div>
  );
}

function AppShell({ tab, setTab, onNewCheckIn, themeId, setThemeId, children }) {
  const theme = THEMES.find((item) => item.id === themeId) || THEMES[0];
  return (
    <div className={cls("min-h-screen overflow-x-hidden", `theme-${theme.mode}`, theme.bg, theme.text)}>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
        <aside className={cls("hidden w-64 shrink-0 border-r px-5 py-6 md:block", theme.surface, theme.border)}>
          <div className="mb-8 flex items-center gap-3">
            <div className={cls("flex h-10 w-10 items-center justify-center rounded-lg", theme.accent, theme.accentText)}>
              <Activity size={20} />
            </div>
            <div>
              <div className="text-sm font-black uppercase tracking-wide">NeedCompass</div>
              <div className={cls("text-xs", theme.muted)}>Name it. Decode it. Move well.</div>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cls(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition",
                  tab === id ? theme.selected : cls(theme.muted, "hover:bg-white/60")
                )}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
          <div className="mt-8 border-t border-stone-200 pt-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide">
              <Palette size={14} />
              Themes
            </div>
            <ThemePicker themeId={themeId} setThemeId={setThemeId} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden pb-24 md:pb-0">
          <header className={cls("sticky top-0 z-20 border-b px-4 py-3 backdrop-blur md:px-8", theme.surface, theme.border)}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="max-w-[19rem] text-base font-black tracking-normal sm:max-w-none sm:text-lg md:text-2xl">
                  Emotion → Unmet Needs Explorer
                </h1>
                <p className={cls("hidden text-sm md:block", theme.muted)}>
                  A practical emotional intelligence tool for men, boys, fathers, coaches, and mentors.
                </p>
              </div>
              <Button variant="secondary" className="hidden md:inline-flex" onClick={onNewCheckIn}>
                <RefreshCw size={16} />
                New check-in
              </Button>
            </div>
          </header>
          <div className="min-w-0 px-4 py-5 md:px-8 md:py-8">{children}</div>
        </main>
      </div>

      <nav className={cls("fixed inset-x-0 bottom-0 z-30 border-t md:hidden", theme.surface, theme.border)}>
        <div className="grid w-full max-w-full" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cls(
                "flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-bold min-[360px]:text-[11px]",
                tab === id ? "text-emerald-800" : theme.muted
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
  const steps = ["Context", "Body", "Emotion", "Need", "Frame"];
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
                  ? "bg-emerald-800 text-white"
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
        <span key={need} className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-950">
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
  const [selectedShadowId, setSelectedShadowId] = useState(null);

  const situation = SITUATIONS.find((item) => item.id === situationId) || SITUATIONS[0];
  const selectedBody = BODY_SIGNALS.filter((item) => bodyIds.includes(item.id));

  const suggestions = useMemo(() => {
    const emotionScores = new Map();
    situation.emotions.forEach((emotion, idx) => emotionScores.set(emotion, 5 - idx));
    selectedBody.forEach((signal) =>
      signal.emotions.forEach((emotion) => emotionScores.set(emotion, (emotionScores.get(emotion) || 0) + 3))
    );
    const scored = rows
      .map((row) => ({
        ...row,
        score:
          (emotionScores.get(row.core) || 0) +
          row.needs.reduce((score, need) => score + (situation.needs.includes(need) ? 2 : 0), 0),
      }))
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score || a.specific.localeCompare(b.specific));
    const unique = new Map();
    scored.forEach((row) => {
      const key = row.specific.toLowerCase();
      if (!unique.has(key)) unique.set(key, row);
    });
    return Array.from(unique.values()).slice(0, 8);
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
    situation: situation.label,
  };
  const resultScripts = SCRIPT_TYPES.map((script) => ({
    ...script,
    text: script.build(scriptContext),
  }));
  const primaryScript = resultScripts[0].text;
  const guidedPrompt = guidanceFor({ ...activePath, needs: inferredNeeds });
  const audienceCopy = {
    adult: "This is not about being soft. It is about reading the signal before it drives your next move.",
    teen: "You do not have to explain it perfectly. Pick the closest answer and keep going.",
    coach: "Guide with curiosity. The goal is to help him name the signal without cornering him.",
  }[audience];
  const actionFrame = [
    `You are not just ${activePath?.specific?.toLowerCase() || "activated"}. Your system is signaling a need for ${inferredNeeds.slice(0, 3).join(", ")}.`,
    "Move the energy by regulating first, naming the need cleanly, and making one request that can be answered today.",
  ].join(" ");
  const relevantShadows = useMemo(
    () =>
      getRelevantShadows({
        core: activePath?.core,
        needs: inferredNeeds,
        bodyLabels: selectedBody.map((item) => item.label),
        situationLabel: situation.label,
      }),
    [activePath?.core, inferredNeeds, selectedBody, situation.label]
  );
  const selectedShadow = relevantShadows.find((shadow) => shadow.id === selectedShadowId) || relevantShadows[0];

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
    "Frame:",
    actionFrame,
    "",
    "Likely shadow patterns:",
    ...relevantShadows.map((shadow) => `- ${shadow.label}: ${shadow.move}`),
    "",
    "Corrective action plan:",
    ...CORRECTIVE_ACTIONS.map((item) => `- ${item.title}: ${item.copy}`),
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
              title="Start the check-in"
              copy="This takes you from a charged moment to a clear next move. Move one screen at a time and choose the closest fit."
            />
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="text-sm font-black text-stone-950">How to use this</div>
              <div className="mt-3 grid gap-2">
                {CHECKIN_GUIDANCE.map((item, index) => (
                  <div key={item} className="flex gap-3 text-sm leading-6 text-stone-800">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-stone-950">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <SectionTitle
              title="What happened?"
              copy="Start with the situation, not the perfect emotion word. The next steps will translate the signal into needs and action."
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
                      active ? "border-emerald-800 bg-emerald-800 text-white" : "border-stone-200 bg-white hover:border-stone-400"
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
              title="Frame and act"
              copy="This is the point of the check-in. Turn the emotional energy into one clear, practical move."
            />
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-950">
                <Trophy size={16} />
                The frame
              </div>
              <p className="mt-3 text-lg font-semibold leading-8 text-emerald-950">{actionFrame}</p>
            </div>
            {relevantShadows.length ? (
              <div className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="text-sm font-black text-stone-950">Common shadows to watch</div>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  These are not labels. They are common ways emotional energy can move off target.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {relevantShadows.map((shadow) => (
                    <button
                      key={shadow.id}
                      onClick={() => setSelectedShadowId(shadow.id)}
                      className={cls(
                        "rounded-full border px-3 py-2 text-sm font-semibold transition",
                        selectedShadow?.id === shadow.id
                          ? "border-emerald-800 bg-emerald-800 text-white"
                          : "border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-400"
                      )}
                    >
                      {shadow.label}
                    </button>
                  ))}
                </div>
                {selectedShadow ? (
                  <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-3">
                    <div className="text-sm font-black text-stone-950">{selectedShadow.label}</div>
                    <p className="mt-2 text-sm leading-6 text-stone-700">{selectedShadow.signal}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-700">
                      <strong>Best move:</strong> {selectedShadow.move}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="text-sm font-black text-stone-950">Do this now</div>
                <ol className="mt-3 space-y-3 text-sm leading-6 text-stone-700">
                  <li><strong>1. Settle:</strong> take 90 seconds and reduce heat in the body.</li>
                  <li><strong>2. Name:</strong> choose the top need, usually {inferredNeeds[0] || "clarity"}.</li>
                  <li><strong>3. Ask:</strong> make one request that can happen today.</li>
                </ol>
              </div>
              <div className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="text-sm font-black text-stone-950">Avoid this now</div>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-stone-700">
                  <li>Do not argue for your whole history.</li>
                  <li>Do not punish with silence.</li>
                  <li>Do not demand mind-reading. Make the need visible.</li>
                </ul>
              </div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="text-sm font-black text-stone-950">Context-sensitive scripts</div>
              <p className="mt-1 text-sm leading-6 text-stone-700">
                Pick the words that match the move you need: request, boundary, repair, or coaching conversation.
              </p>
              <div className="mt-3 grid gap-3">
                {resultScripts.map(({ id, label, icon: Icon, text }) => (
                  <div key={id} className="rounded-lg border border-amber-200 bg-white p-3">
                    <div className="flex items-center gap-2 text-sm font-black text-stone-950">
                      <Icon size={16} />
                      {label}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-stone-800">{text}</p>
                    <Button variant="secondary" className="mt-3 w-full" onClick={() => copyText(`${text}\n\n${ATTR_LINE}`)}>
                      <Clipboard size={16} />
                      Copy this script
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <details className="rounded-lg border border-stone-200 bg-white p-4">
              <summary className="cursor-pointer text-sm font-black text-stone-950">Optional deeper guidance</summary>
              <p className="mt-2 text-sm leading-6 text-stone-700">{guidedPrompt}</p>
            </details>
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
                Script library
                <ArrowRight size={16} />
              </Button>
            </div>
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-950 transition hover:bg-stone-50"
            >
              <CalendarDays size={16} />
              Book coaching support
            </a>
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
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide">
            <Trophy size={16} />
            Frame
          </div>
          <p className="mt-3 text-base font-semibold leading-7">{actionFrame}</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="text-sm font-black">Current read</div>
          <div className="mt-3 text-2xl font-black">{activePath?.specific}</div>
          <div className="text-sm text-stone-600">
            {activePath?.core} / {activePath?.sub}
          </div>
          <div className="mt-4">
            <NeedBadges needs={inferredNeeds.slice(0, 5)} />
          </div>
        </div>
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <div className="text-sm font-black text-stone-950">Mindset</div>
          <p className="mt-2 text-sm leading-6 text-stone-700">{audienceCopy}</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="text-sm font-black text-stone-950">Snapshot count</div>
          <div className="mt-1 text-3xl font-black text-stone-950">{snapshot.length}</div>
          <p className="text-sm text-stone-600">
            Snapshots help you see repeated emotions, repeated needs, and the patterns that need action instead of more guessing.
          </p>
        </div>
        <a
          href={CALENDAR_URL}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
        >
          <CalendarDays size={16} />
          Book a session
        </a>
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
  const filtered = useMemo(() => {
    const matches = rows.filter((row) =>
      [row.core, row.sub, row.specific, row.needs.join(" ")].join(" ").toLowerCase().includes(query.toLowerCase())
    );
    const unique = new Map();
    matches.forEach((row) => {
      const key = `${row.specific.toLowerCase()}|${row.needs.join(",").toLowerCase()}`;
      if (!unique.has(key)) unique.set(key, row);
    });
    return Array.from(unique.values());
  }, [query, rows]);

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
        <SectionTitle title="Feelings Library" copy="Browse feelings directly or search by emotion, need, or situation." />
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
        title="Script Library"
        copy="Use this as a backup library. The strongest scripts are now generated inside the Check In result based on the selected feeling, need, body signal, and situation."
      />
      <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
        <div className="text-sm font-black text-stone-950">Before you send the script</div>
        <div className="mt-3 grid gap-2 md:grid-cols-4">
          {CORRECTIVE_ACTIONS.map((item) => (
            <div key={item.title} className="rounded-lg border border-stone-200 bg-white p-3">
              <div className="text-sm font-black text-stone-950">{item.title}</div>
              <p className="mt-1 text-sm leading-6 text-stone-600">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {SCRIPT_TYPES.map(({ id, label, icon: Icon, build }) => {
          const script = build(context);
          return (
            <div key={id} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-800 text-white">
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
      <a
        href={CALENDAR_URL}
        target="_blank"
        rel="noreferrer"
        className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
      >
        <CalendarDays size={16} />
        Book coaching support
      </a>
    </div>
  );
}

function Snapshot({ snapshot, setSnapshot, setSaved }) {
  const needs = Array.from(new Set(snapshot.flatMap((item) => item.needs || [])));
  const topNeed = needs[0] || "clarity";
  const payload = [
    "Emotional snapshot",
    ...snapshot.map((item) => `- ${item.core} / ${item.sub} / ${item.specific}: ${item.needs.join(", ")}`),
    "",
    `Converging needs: ${needs.join(", ")}`,
    "",
    "How to use this:",
    "1. Look for repeated needs across different emotions.",
    "2. Pick one need to act on today.",
    "3. Turn that need into one clear request, boundary, repair, or recovery plan.",
    "4. Set a follow-up so the need is not forgotten after the emotion cools down.",
    "",
    ATTR_LINE,
  ].join("\n");

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Snapshot"
        copy="A snapshot is a pattern reader. It gathers the emotions and needs from this session so you can see what is underneath the surface and decide what needs action."
      />
      <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
        <div className="text-sm font-black text-stone-950">What snapshots are for</div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-stone-200 bg-white p-3">
            <div className="text-sm font-black text-stone-950">Pattern</div>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              Notice repeated emotions, repeated situations, and repeated unmet needs.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-3">
            <div className="text-sm font-black text-stone-950">Priority</div>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              Choose the need that would create the most relief or repair if it was addressed first.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-3">
            <div className="text-sm font-black text-stone-950">Action</div>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              Convert the need into a request, boundary, apology, rest plan, or coaching conversation.
            </p>
          </div>
        </div>
      </div>
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
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="text-sm font-black">Converging unmet needs</div>
            <div className="mt-3"><NeedBadges needs={needs} /></div>
            <p className="mt-3 text-sm leading-6 text-stone-700">
              Start with {topNeed}. Ask: what would it look like to protect or meet this need in the next 24 hours?
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="text-sm font-black text-stone-950">Corrective action</div>
            <p className="mt-2 text-sm leading-6 text-stone-700">
              Pick one next step: make a request, set a boundary, repair your part, take recovery time, or book support if the pattern keeps repeating.
            </p>
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
            >
              <CalendarDays size={16} />
              Book support
            </a>
          </div>
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
        {!snapshot.length ? <p className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">No snapshot items yet. Run Check In or save from Feelings Library.</p> : null}
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
  const [checkInKey, setCheckInKey] = useState(0);
  const [themeId, setThemeId] = useState("sage");
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

  const startNewCheckIn = () => {
    setTab("checkin");
    setCheckInKey((value) => value + 1);
  };

  return (
    <AppShell tab={tab} setTab={setTab} onNewCheckIn={startNewCheckIn} themeId={themeId} setThemeId={setThemeId}>
      {tab === "checkin" && <GuidedCheckIn key={checkInKey} rows={rows} snapshot={snapshot} setSnapshot={setSnapshot} setTab={setTab} />}
      {tab === "explore" && <Explore rows={rows} setSnapshot={setSnapshot} />}
      {tab === "scripts" && <Scripts latest={snapshot[0]} />}
      {tab === "snapshot" && <Snapshot snapshot={snapshot} setSnapshot={setSnapshot} setSaved={setSaved} />}
      {tab === "saved" && <Saved saved={saved} setSaved={setSaved} />}
    </AppShell>
  );
}
