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
  HelpCircle,
  Home,
  MessageSquareText,
  PlayCircle,
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

const APP_NAME = "ExploringNeeds.com";
const APP_TITLE = "Exploring Needs";
const APP_TAGLINE = "Name the feeling. Find the need. Choose the next right move.";
const APP_SUBTITLE =
  "A practical emotional intelligence and shadow work tool for men, boys, families, partners, coaches, and mentors.";
const ATTR_LINE =
  "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/) | ExploringNeeds.com | Rick Broider | Agent5D.com | HolisticLifeTribe.com";
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
    label: "Felt disrespected or talked down to",
    hint: "tone, dismissal, insult, interruption",
    emotions: ["Anger", "Disgust", "Sadness"],
    needs: ["respect", "dignity", "acknowledgment"],
  },
  {
    id: "criticized",
    label: "Felt criticized or corrected",
    hint: "feedback, blame, being called out",
    emotions: ["Anger", "Fear", "Sadness"],
    needs: ["respect", "fairness", "clarity", "repair"],
  },
  {
    id: "unseen",
    label: "Felt unseen or unappreciated",
    hint: "effort missed, invisible labor, no thanks",
    emotions: ["Sadness", "Anger"],
    needs: ["acknowledgment", "connection", "support"],
  },
  {
    id: "rejected",
    label: "Rejected or left out",
    hint: "ignored, excluded, not chosen",
    emotions: ["Sadness", "Fear", "Anger"],
    needs: ["belonging", "connection", "reassurance"],
  },
  {
    id: "sexual-rejection",
    label: "Sexually rejected or unwanted",
    hint: "desire, touch, intimacy, shame",
    emotions: ["Sadness", "Fear", "Anger"],
    needs: ["connection", "reassurance", "dignity", "safety"],
  },
  {
    id: "abandoned",
    label: "Emotionally abandoned",
    hint: "alone in the moment, not responded to",
    emotions: ["Sadness", "Fear", "Anger"],
    needs: ["connection", "support", "reassurance"],
  },
  {
    id: "controlled",
    label: "Controlled, trapped, or cornered",
    hint: "rules, pressure, no room to choose",
    emotions: ["Anger", "Fear", "Disgust"],
    needs: ["autonomy", "respect", "safety"],
  },
  {
    id: "exposed",
    label: "Exposed, ashamed, or found out",
    hint: "mistake, vulnerability, embarrassment",
    emotions: ["Fear", "Sadness", "Anger"],
    needs: ["dignity", "safety", "forgiveness", "repair"],
  },
  {
    id: "pressure",
    label: "Too much pressure",
    hint: "school, work, money, performance",
    emotions: ["Fear", "Anger", "Sadness"],
    needs: ["support", "clarity", "rest"],
  },
  {
    id: "accountability",
    label: "Asked to take accountability",
    hint: "impact named, apology needed, defensiveness rising",
    emotions: ["Fear", "Anger", "Sadness"],
    needs: ["dignity", "honesty", "repair", "clarity"],
  },
  {
    id: "partner-upset",
    label: "Partner is upset and I feel blamed",
    hint: "relationship tension, conflict, defensiveness",
    emotions: ["Fear", "Anger", "Sadness"],
    needs: ["understanding", "respect", "repair", "safety"],
  },
  {
    id: "shutdown",
    label: "I want to shut down",
    hint: "silent, numb, overloaded, gone inside",
    emotions: ["Fear", "Sadness"],
    needs: ["space", "rest", "safety", "support"],
  },
  {
    id: "prove-right",
    label: "I want to prove I am right",
    hint: "debate, facts, winning, court-room energy",
    emotions: ["Anger", "Fear"],
    needs: ["respect", "clarity", "acknowledgment"],
  },
  {
    id: "victim-loop",
    label: "I feel like the victim",
    hint: "unfairness, resentment, helplessness",
    emotions: ["Sadness", "Anger", "Fear"],
    needs: ["fairness", "support", "agency", "acknowledgment"],
  },
  {
    id: "overgiving",
    label: "Used, drained, or over-giving",
    hint: "codependent pull, resentment, rescuing",
    emotions: ["Sadness", "Anger"],
    needs: ["reciprocity", "support", "autonomy", "rest"],
  },
  {
    id: "jealous",
    label: "Jealous, replaced, or compared",
    hint: "competition, fear of losing place",
    emotions: ["Fear", "Anger", "Sadness"],
    needs: ["reassurance", "belonging", "security"],
  },
  {
    id: "woman-disrespect",
    label: "Disrespected by a woman",
    hint: "mother wound, partner conflict, feminine mirror",
    emotions: ["Anger", "Disgust", "Sadness"],
    needs: ["respect", "dignity", "understanding", "repair"],
  },
  {
    id: "purpose-power",
    label: "Powerless with money, work, or purpose",
    hint: "provider pressure, direction, status, stress",
    emotions: ["Fear", "Sadness", "Anger"],
    needs: ["competence", "support", "clarity", "stability"],
  },
  {
    id: "crossed-line",
    label: "I crossed a line and need repair",
    hint: "hurt someone, broke trust, need clean ownership",
    emotions: ["Sadness", "Fear"],
    needs: ["honesty", "repair", "forgiveness", "accountability"],
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
  { id: "man", label: "Man", description: "direct, accountable, relationship-ready" },
  { id: "woman", label: "Woman", description: "clear needs, clean boundaries, grounded repair" },
  { id: "teen-boy", label: "Teen boy", description: "plain language, less pressure, more examples" },
  { id: "teen-girl", label: "Teen girl", description: "clear language, safety, confidence, support" },
  { id: "father", label: "Father", description: "leadership without control or shutdown" },
  { id: "mother", label: "Mother", description: "care without over-functioning or self-erasing" },
  { id: "coach", label: "Coach / mentor", description: "questions that guide without cornering" },
  { id: "partner", label: "Partner", description: "repair, accountability, and connection" },
];

const CHECKIN_MODES = [
  {
    id: "quick",
    label: "Quick Check In",
    description: "Name the signal and get one clean next move.",
    situationIds: ["disrespected", "rejected", "pressure", "conflict", "shutdown", "prove-right"],
    lens: "Move from activation to one clear action.",
  },
  {
    id: "repair",
    label: "Relationship Repair",
    description: "Use when closeness, trust, or communication is strained.",
    situationIds: ["partner-upset", "betrayal", "criticized", "abandoned", "sexual-rejection", "crossed-line"],
    lens: "Protect dignity, reduce the Four Horsemen, and choose a repair move.",
  },
  {
    id: "shadow",
    label: "Shadow Work",
    description: "Find the protective pattern underneath the reaction.",
    situationIds: ["controlled", "exposed", "victim-loop", "prove-right", "overgiving", "jealous", "woman-disrespect"],
    lens: "Study the pattern without shame and choose the cleaner expression of the need.",
  },
  {
    id: "accountability",
    label: "Accountability",
    description: "Own impact without collapsing into shame or flipping blame.",
    situationIds: ["accountability", "crossed-line", "criticized", "betrayal", "conflict"],
    lens: "Separate dignity from defensiveness, then make repair observable.",
  },
  {
    id: "support",
    label: "Support Someone",
    description: "Use this when you are helping a son, partner, client, or friend.",
    situationIds: ["abandoned", "pressure", "unseen", "shutdown", "conflict", "purpose-power"],
    lens: "Guide with curiosity, not control. Help them name the signal and choose one next step.",
  },
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
  dignity: "To stay human and worthy even when something hard is being named.",
  repair: "To make the harm specific and restore trust through action.",
  honesty: "To work with what is real instead of managing image or avoiding impact.",
  forgiveness: "To be allowed to learn, repair, and return to integrity.",
  space: "To have enough room to regulate before responding.",
  care: "To receive tenderness, attention, and protection where you are hurting.",
  competence: "To feel capable and supported in meeting the challenge.",
  agency: "To remember you still have a next move even when the situation is unfair.",
  reciprocity: "To have effort, care, and responsibility move both ways.",
  security: "To feel chosen, steady, and not easily replaced.",
  stability: "To have enough predictability to settle and act clearly.",
  accountability: "To own impact without losing dignity or flipping blame.",
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
    label: "Shadow of Control",
    triggers: ["Anger", "Fear", "autonomy", "safety", "clarity"],
    signal: "The energy may try to force certainty, compliance, or a quick answer.",
    tactic: "Can look like pressure, interrogation, monitoring, moving the goal posts, or making someone prove loyalty.",
    horseman: "Often pairs with criticism or defensiveness.",
    move: "Slow the demand down. Ask for one clear agreement instead of trying to control the whole person or outcome.",
  },
  {
    id: "withdrawal",
    label: "Shadow of Withdrawal",
    triggers: ["Sadness", "Fear", "rest", "safety", "care", "space"],
    signal: "The energy may pull you into silence, distance, or disappearance.",
    tactic: "Can look like stonewalling, disappearing, acting busy, emotional shutdown, or the silent treatment.",
    horseman: "Connects directly to stonewalling.",
    move: "Name that you need space and give a return time. Space works best when it has a responsible re-entry.",
  },
  {
    id: "attack",
    label: "Shadow of Attack",
    triggers: ["Anger", "Disgust", "respect", "fairness", "dignity"],
    signal: "The energy may push you to win, shame, interrupt, or make the other person pay.",
    tactic: "Can look like insults, character attacks, contempt, sarcasm, threats, or public humiliation.",
    horseman: "Often shows up as criticism or contempt.",
    move: "Protect the need without attacking. Use a boundary or request that names behavior, not character.",
  },
  {
    id: "approval",
    label: "Shadow of Approval Seeking",
    triggers: ["Sadness", "Happiness", "belonging", "connection", "reassurance"],
    signal: "The energy may make you abandon your own truth to keep closeness.",
    tactic: "Can look like fawning, over-apologizing, people pleasing, rescuing, or agreeing while resentment grows.",
    horseman: "Often leads to later criticism or stonewalling when hidden resentment builds.",
    move: "Stay connected without self-erasing. Say what is true and ask for reassurance directly.",
  },
  {
    id: "numbing",
    label: "Shadow of Numbing",
    triggers: ["Sadness", "Fear", "rest", "support", "overwhelmed"],
    signal: "The energy may try to shut off through scrolling, food, substances, sleep, or avoidance.",
    tactic: "Can look like avoidance, dissociation, delay, disappearing into screens, or refusing to feel anything.",
    horseman: "Can become stonewalling when another person needs engagement.",
    move: "Choose one low-friction care action first: water, movement, shower, daylight, or a direct check-in with someone safe.",
  },
  {
    id: "story",
    label: "Shadow of Story Spiral",
    triggers: ["Fear", "Surprise", "clarity", "reassurance", "trust"],
    signal: "The mind may start filling gaps with worst-case stories.",
    tactic: "Can look like mind reading, catastrophizing, suspicion loops, collecting evidence, or assuming motives.",
    horseman: "Can feed defensiveness, criticism, and contempt.",
    move: "Separate fact from interpretation. Ask for the missing information before acting on the story.",
  },
  {
    id: "darvo",
    label: "Shadow of DARVO",
    triggers: ["Anger", "Fear", "shame", "accountability", "repair", "honesty", "respect"],
    signal: "Accountability feels threatening, so the energy denies, attacks, and flips the roles of harmed person and harmful actor.",
    tactic: "Deny, attack, reverse victim and offender. This can confuse the conversation and pressure the harmed person to defend their reality.",
    horseman: "Combines defensiveness, criticism, and often contempt.",
    move: "Return to the specific behavior and impact. Say: I am not debating my character or yours. I am naming what happened, how it landed, and what repair requires.",
  },
  {
    id: "jade",
    label: "Shadow of JADE",
    triggers: ["Fear", "Sadness", "belonging", "reassurance", "approval", "connection", "safety"],
    signal: "The body tries to earn safety by over-explaining, defending, and proving that your needs are allowed.",
    tactic: "Justify, argue, defend, explain. This can keep codependent loops alive when a simple boundary is needed.",
    horseman: "Can invite more defensiveness and criticism because the conversation becomes a trial.",
    move: "State the boundary once, briefly. Say: I understand you disagree. My decision is still the same.",
  },
  {
    id: "victim",
    label: "Shadow of Victim Identity",
    triggers: ["Sadness", "Fear", "helpless", "support", "care", "fairness", "acknowledgment"],
    signal: "Pain becomes identity, and the next move becomes proving injury instead of choosing agency.",
    tactic: "Can look like helplessness, martyrdom, covert blame, passive punishment, or refusing workable repair.",
    horseman: "Often feeds criticism and stonewalling.",
    move: "Validate the pain without surrendering agency. Ask: what is one action I can take that protects my dignity today?",
  },
  {
    id: "grandiosity",
    label: "Shadow of Grandiosity",
    triggers: ["Happiness", "Anger", "pride", "recognition", "respect", "control", "value"],
    signal: "The ego tries to escape vulnerability by becoming superior, special, above feedback, or entitled to exceptions.",
    tactic: "Can look like superiority, entitlement, name-dropping, rule-breaking, contempt, or refusing accountability.",
    horseman: "Strongly linked to contempt.",
    move: "Trade superiority for specificity. Ask: what part of the feedback is true enough to act on?",
  },
  {
    id: "gaslight",
    label: "Shadow of Reality Distortion",
    triggers: ["Fear", "Anger", "trust", "honesty", "clarity", "safety"],
    signal: "The conversation shifts away from what happened and toward whether the other person can trust their own perception.",
    tactic: "Can look like minimizing, rewriting events, selective memory, moving the standard of proof, or calling the other person too sensitive.",
    horseman: "Often uses defensiveness and contempt.",
    move: "Anchor to observable facts. Use dates, words, actions, and impact. If reality keeps getting distorted, stop debating and seek outside support.",
  },
  {
    id: "rescue",
    label: "Shadow of Rescue",
    triggers: ["Sadness", "Happiness", "connection", "support", "belonging", "care"],
    signal: "Care becomes control because helping is used to earn worth, avoid abandonment, or manage another adult's consequences.",
    tactic: "Can look like over-functioning, fixing, unsolicited advice, tolerating harm, or confusing responsibility with love.",
    horseman: "Can lead to criticism when the rescue is not appreciated.",
    move: "Offer support without taking ownership. Ask: what is mine to carry, and what belongs to them?",
  },
];

const SHADOW_HEALING = {
  control: {
    wound: "Fear that uncertainty means danger, disrespect, abandonment, or loss of power.",
    need: "Safety, clarity, autonomy, and trust that does not require domination.",
    practice: "Pause before pressing. Name the exact fear, then ask for one agreement instead of demanding total certainty.",
    repair: "Own the pressure directly: I tried to control the outcome instead of making a clean request. The repair is that I will ask once and respect your answer.",
    doNot: "Do not interrogate, monitor, threaten, test loyalty, or move the standard after the other person answers.",
  },
  withdrawal: {
    wound: "Fear that staying present will lead to shame, attack, failure, or emotional flooding.",
    need: "Space, safety, rest, and a responsible way back into connection.",
    practice: "Use a timed pause. Regulate your body, then return with one sentence about what you can handle now.",
    repair: "Name the disappearance: I shut down and left you alone with the tension. I need space, and I will come back at a specific time.",
    doNot: "Do not use silence as punishment, disappear without a return time, or call avoidance peace.",
  },
  attack: {
    wound: "Fear that dignity will only be protected if someone else is defeated first.",
    need: "Respect, fairness, dignity, and a boundary that does not require contempt.",
    practice: "Drop character attacks. Describe the behavior, the impact, and the request in plain language.",
    repair: "Own the sharpness: I attacked your character instead of naming my need. The repair is to restart with the behavior and my request.",
    doNot: "Do not insult, mock, threaten, humiliate, diagnose, or use contempt to feel powerful.",
  },
  approval: {
    wound: "Fear that truth will cost belonging, affection, approval, or protection.",
    need: "Connection that can survive honesty, difference, and clear boundaries.",
    practice: "Tell the smallest complete truth. Let someone respond before you rescue them from discomfort.",
    repair: "Name the self-abandonment: I said yes when I meant no. I am correcting that now so resentment does not build.",
    doNot: "Do not fawn, over-apologize, over-explain, rescue, or trade your truth for temporary closeness.",
  },
  numbing: {
    wound: "Fear that feeling the truth will be too much to survive or too hard to change.",
    need: "Care, rest, support, and one small embodied action.",
    practice: "Choose one recovery behavior for five minutes: water, walk, shower, breath, sunlight, or a direct check-in.",
    repair: "Own the avoidance: I checked out instead of staying connected to what matters. I am taking one care action and one honest next step.",
    doNot: "Do not use screens, food, sex, substances, sleep, or work to avoid every honest signal.",
  },
  story: {
    wound: "Fear that missing information means betrayal, rejection, danger, or humiliation is coming.",
    need: "Clarity, reassurance, truth, and grounded reality testing.",
    practice: "Write two columns: facts I know and story I am adding. Ask one clean question before acting.",
    repair: "Name the assumption: I filled in the gap with a story and reacted to it as fact. I want to check what is true.",
    doNot: "Do not mind-read, collect evidence for a verdict, catastrophize, or punish someone for a story you have not verified.",
  },
  darvo: {
    wound: "Shame becomes so threatening that accountability feels like annihilation.",
    need: "Dignity, repair, honesty, and the ability to own impact without becoming worthless.",
    practice: "Use the ownership sequence: behavior, impact, apology, repair, changed action.",
    repair: "Say: I shifted the focus away from my impact. I am returning to what I did, how it landed, and what repair requires.",
    doNot: "Do not deny, attack, reverse roles, call the harmed person abusive for naming harm, or make your shame the main emergency.",
  },
  jade: {
    wound: "Fear that your boundary is not valid unless the other person agrees with every reason.",
    need: "Safety, autonomy, clarity, and permission to stop auditioning for basic respect.",
    practice: "State the boundary in one sentence. Repeat it once if needed. Then act on it without a debate.",
    repair: "Say: I got pulled into proving my boundary. I am returning to the decision and the behavior I will take.",
    doNot: "Do not justify, argue, defend, or explain past the point where the boundary is already clear.",
  },
  victim: {
    wound: "Pain has been ignored so long that being injured can feel like the only available identity.",
    need: "Acknowledgment, fairness, support, and agency that does not deny the wound.",
    practice: "Validate the hurt, then choose one action that protects dignity today.",
    repair: "Say: My pain is real, and I also have a next move. I am choosing the action that helps me heal instead of only proving I was hurt.",
    doNot: "Do not use helplessness, martyrdom, passive punishment, or covert blame to avoid agency.",
  },
  grandiosity: {
    wound: "Fear that being ordinary, wrong, or accountable means losing worth.",
    need: "Respect, recognition, humility, and secure worth that can receive feedback.",
    practice: "Ask what part of the feedback is true enough to act on, even if the delivery was imperfect.",
    repair: "Say: I acted above feedback. I am willing to name the part that is mine and change that behavior.",
    doNot: "Do not use superiority, contempt, credentials, charm, or spiritual language to dodge impact.",
  },
  gaslight: {
    wound: "Fear that reality will expose harm, loss of control, or an identity you do not want to face.",
    need: "Honesty, clarity, safety, and reality sturdy enough for repair.",
    practice: "Anchor to observable facts: date, words, behavior, impact, and needed repair.",
    repair: "Say: I minimized or distorted what happened. I am willing to work from the observable facts and your impact.",
    doNot: "Do not rewrite events, minimize, mock sensitivity, demand impossible proof, or make someone doubt their perception.",
  },
  rescue: {
    wound: "Fear that love must be earned by carrying what belongs to someone else.",
    need: "Reciprocity, boundaries, connection, and worth that is not dependent on fixing.",
    practice: "Ask what is mine, what is theirs, and what support I can offer without taking ownership.",
    repair: "Say: I stepped into fixing instead of respecting your agency and mine. I can support without taking over.",
    doNot: "Do not over-function, tolerate harm, give unsolicited solutions, or call control care.",
  },
};

function enrichShadow(shadow) {
  return { ...shadow, ...(SHADOW_HEALING[shadow.id] || {}) };
}

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
    .slice(0, 3)
    .map(enrichShadow);
}

const SCRIPT_TYPES = [
  {
    id: "request",
    label: "Clean request",
    icon: MessageSquareText,
    build: ({ emotion, needs, situation, mode }) =>
      `I am feeling ${emotion || "activated"} around ${situation || "this situation"} and I need ${needs.join(", ") || "clarity"}. In ${mode || "this conversation"}, could we choose one concrete next step and a time to follow up?`,
  },
  {
    id: "boundary",
    label: "Boundary",
    icon: Shield,
    build: ({ emotion, needs }) =>
      `I want to handle this well. I am feeling ${emotion || "heated"} and need ${needs[0] || "respect"}. If this keeps moving in a way that blocks that need, I am going to pause and come back with a clear request and a return time.`,
  },
  {
    id: "repair",
    label: "Repair",
    icon: HeartHandshake,
    build: ({ emotion, needs }) =>
      `I did not handle that the way I want to. Underneath it I was feeling ${emotion || "overwhelmed"} and needing ${needs.join(", ") || "support"}. I am sorry for my part. The repair I can offer now is to name my impact, slow down, and listen before asking to be understood.`,
  },
  {
    id: "coach",
    label: "Coach prompt",
    icon: UserRound,
    build: ({ needs, emotion, audience }) =>
      `Try asking the ${audience || "person"}: "When ${emotion || "that feeling"} showed up, what did your body do, and which need was asking for attention: ${needs.slice(0, 3).join(", ") || "respect, safety, or support"}?"`,
  },
];

const navItems = [
  { id: "intro", label: "Start", icon: PlayCircle },
  { id: "checkin", label: "Check In", icon: Home },
  { id: "report", label: "Report", icon: Sparkles },
  { id: "explore", label: "Feelings", icon: Compass },
  { id: "shadows", label: "Shadows", icon: BookOpen },
  { id: "scripts", label: "Scripts", icon: Clipboard },
  { id: "help", label: "Help", icon: HelpCircle },
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
              <div className="text-sm font-black uppercase tracking-wide">{APP_NAME}</div>
              <div className={cls("text-xs", theme.muted)}>{APP_TAGLINE}</div>
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
                  {APP_TITLE}
                </h1>
                <p className={cls("hidden text-sm md:block", theme.muted)}>
                  {APP_SUBTITLE}
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
        <div className="flex w-full max-w-full overflow-x-auto px-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cls(
                "flex min-h-16 min-w-[72px] flex-col items-center justify-center gap-1 text-[10px] font-bold min-[360px]:text-[11px]",
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
  const steps = ["Who", "Mode", "Event", "Body", "Feeling", "Need", "Report"];
  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-stone-50 p-3 md:p-4">
      <div className="grid grid-cols-7 gap-1">
        {steps.map((label, idx) => (
          <div key={label} className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
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
            <span className={cls("hidden text-xs font-semibold sm:inline", idx <= step ? "text-stone-950" : "text-stone-500")}>
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

function Intro({ setTab }) {
  const steps = [
    {
      title: "Start with who is using it",
      copy: "The app adapts its language for a man, woman, teen, parent, partner, coach, or mentor.",
    },
    {
      title: "Choose the kind of work",
      copy: "Use Quick Check In for speed, Relationship Repair for conflict, Shadow Work for patterns, Accountability for ownership, or Support Someone when guiding another person.",
    },
    {
      title: "Let the body narrow the map",
      copy: "Body signals help translate a charged moment into a likely feeling and need without forcing perfect words too early.",
    },
    {
      title: "Use the report",
      copy: "The final report gives the frame, needs, shadows to watch, scripts, repair language, and one practical next move.",
    },
  ];
  const taglines = [
    "From reaction to repair.",
    "Decode the emotion. Meet the need. Move with integrity.",
    "A practical map from charged emotion to clear action.",
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 md:p-6">
        <div className="text-sm font-black uppercase tracking-wide text-emerald-950">{APP_NAME}</div>
        <h2 className="mt-2 text-2xl font-black tracking-normal text-emerald-950 md:text-4xl">{APP_TAGLINE}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-950 md:text-base">
          {APP_SUBTITLE} It helps turn emotional charge into a usable need, a practical request, a repair move, or a cleaner boundary.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button variant="primary" onClick={() => setTab("checkin")}>
            <PlayCircle size={16} />
            Start guided check-in
          </Button>
          <Button variant="secondary" onClick={() => setTab("help")}>
            <HelpCircle size={16} />
            Read help wiki
          </Button>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {taglines.map((tagline) => (
          <div key={tagline} className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="text-sm font-black text-stone-950">{tagline}</div>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-4 md:p-5">
        <SectionTitle
          title="How to use it"
          copy="Move one screen at a time. Choose the closest fit. The goal is not a perfect label. The goal is a better next move."
        />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-sm font-black text-white">
                  {index + 1}
                </span>
                <div className="text-sm font-black text-stone-950">{step.title}</div>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-700">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 md:p-5">
        <div className="text-sm font-black text-stone-950">Best use case</div>
        <p className="mt-2 text-sm leading-6 text-stone-700">
          Use it before a hard conversation, after a triggering moment, when you feel stuck in blame or shutdown, or when you want to support someone without controlling them.
        </p>
      </section>
    </div>
  );
}

function GuidedCheckIn({ rows, setLatestReport, setTab }) {
  const [step, setStep] = useState(0);
  const [audience, setAudience] = useState("man");
  const [modeId, setModeId] = useState("quick");
  const [situationId, setSituationId] = useState(SITUATIONS[0].id);
  const [bodyIds, setBodyIds] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedShadowId, setSelectedShadowId] = useState(null);

  const maxStep = 6;
  const mode = CHECKIN_MODES.find((item) => item.id === modeId) || CHECKIN_MODES[0];
  const audienceData = AUDIENCES.find((item) => item.id === audience) || AUDIENCES[0];
  const situationOptions = SITUATIONS.filter((item) => mode.situationIds.includes(item.id));
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
    audience: audienceData.label,
    mode: mode.label,
  };
  const resultScripts = SCRIPT_TYPES.map((script) => ({
    ...script,
    text: script.build(scriptContext),
  }));
  const primaryScript = resultScripts[0].text;
  const guidedPrompt = guidanceFor({ ...activePath, needs: inferredNeeds });
  const audienceCopy = {
    man: "This is not about being soft. It is about reading the signal before it drives your next move.",
    woman: "This is about naming the signal, honoring your body, and choosing clear action without self-abandonment.",
    "teen-boy": "You do not have to explain it perfectly. Pick the closest answer and keep going.",
    "teen-girl": "You do not need the perfect words. Pick what fits and let the tool help you name the need.",
    father: "Lead without control. Your calm clarity teaches more than pressure does.",
    mother: "Care without carrying everything. The goal is truth, boundaries, and repair.",
    coach: "Guide with curiosity. The goal is to help them name the signal without cornering them.",
    partner: "Stay close to impact, need, and repair. Do not turn the conversation into a trial.",
  }[audience];
  const actionFrame = [
    `You are not just ${activePath?.specific?.toLowerCase() || "activated"}. As a ${audienceData.label.toLowerCase()}, your system is signaling a need for ${inferredNeeds.slice(0, 3).join(", ")}.`,
    `${mode.lens} Regulate first, name the need cleanly, and make one request or repair action that can happen today.`,
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

  const report = {
    core: activePath.core,
    sub: activePath.sub,
    specific: activePath.specific,
    needs: inferredNeeds,
    situation: situation.label,
    bodySignals: selectedBody.map((item) => item.label),
    audience: audienceData.label,
    mode: mode.label,
    mindset: audienceCopy,
    frame: actionFrame,
    scripts: resultScripts,
    shadows: relevantShadows,
    guidance: guidedPrompt,
    createdAt: new Date().toISOString(),
  };

  const saveReport = () => {
    setLatestReport(report);
    showToast("Report saved");
  };

  const saveCurrentReport = () => {
    const entry = {
      core: activePath.core,
      sub: activePath.sub,
      specific: activePath.specific,
      needs: inferredNeeds,
      situation: situation.label,
      audience: audienceData.label,
      mode: mode.label,
      script: primaryScript,
      createdAt: new Date().toISOString(),
    };
    setLatestReport({ ...report, ...entry });
    showToast("Report saved");
  };

  const summary = [
    `Situation: ${situation.label}`,
    `Who: ${audienceData.label}`,
    `Mode: ${mode.label}`,
    `Body signals: ${selectedBody.map((item) => item.label).join(", ") || "not selected"}`,
    `Likely emotion: ${activePath.core} / ${activePath.sub} / ${activePath.specific}`,
    `Unmet needs: ${inferredNeeds.join(", ")}`,
    "",
    "Frame:",
    actionFrame,
    "",
    "Mindset:",
    audienceCopy,
    "",
    "Likely shadow patterns:",
    ...relevantShadows.map((shadow) => `- ${shadow.label}: ${shadow.move} Practice: ${shadow.practice}`),
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
    <div className="mx-auto grid min-w-0 max-w-3xl gap-4 overflow-hidden">
      <ProgressRail step={step} />

      <section className="min-w-0 max-w-full overflow-hidden rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-6">
        {step === 0 && (
          <div className="space-y-5">
            <SectionTitle
              title="Who is using this?"
              copy="Choose the lens first so the check-in can shape the language, report, and repair guidance around the person using it."
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
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
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
        )}

        {step === 1 && (
          <div className="space-y-5">
            <SectionTitle
              title="Choose the work"
              copy="This keeps the flow focused. A quick check-in, a repair conversation, shadow work, accountability, and support all need different guidance."
            />
            <div className="grid min-w-0 gap-2">
              {CHECKIN_MODES.map((item) => (
                <Chip
                  key={item.id}
                  active={modeId === item.id}
                  onClick={() => {
                    setModeId(item.id);
                    const nextSituation = SITUATIONS.find((situationItem) => item.situationIds.includes(situationItem.id));
                    if (nextSituation) setSituationId(nextSituation.id);
                    setSelectedPath(null);
                    setSelectedShadowId(null);
                  }}
                >
                  <span className="block">{item.label}</span>
                  <span className={cls("mt-1 block text-xs font-medium", modeId === item.id ? "text-stone-300" : "text-stone-500")}>
                    {item.description}
                  </span>
                </Chip>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <SectionTitle
              title="What happened?"
              copy="Start with the situation, not the perfect emotion word. The next steps translate the signal into needs, shadow patterns, and action."
            />
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              {situationOptions.map((item) => (
                <Chip key={item.id} active={situationId === item.id} onClick={() => { setSituationId(item.id); setSelectedPath(null); setSelectedShadowId(null); }}>
                  <span className="block">{item.label}</span>
                  <span className={cls("mt-1 block text-xs font-medium", situationId === item.id ? "text-stone-300" : "text-stone-500")}>
                    {item.hint}
                  </span>
                </Chip>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
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

        {step === 4 && (
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

        {step === 5 && (
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

        {step === 6 && (
          <div className="space-y-5">
            <SectionTitle
              title="Your report"
              copy="This is the output of the check-in. Copy it, share it, or use it as the next conversation script."
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
                      <strong>Pattern:</strong> {selectedShadow.tactic}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-700">
                      <strong>Four Horsemen link:</strong> {selectedShadow.horseman}
                    </p>
                    {selectedShadow.wound ? (
                      <p className="mt-2 text-sm leading-6 text-stone-700">
                        <strong>Core wound:</strong> {selectedShadow.wound}
                      </p>
                    ) : null}
                    {selectedShadow.need ? (
                      <p className="mt-2 text-sm leading-6 text-stone-700">
                        <strong>Healing need:</strong> {selectedShadow.need}
                      </p>
                    ) : null}
                    {selectedShadow.practice ? (
                      <p className="mt-2 text-sm leading-6 text-stone-700">
                        <strong>Practice:</strong> {selectedShadow.practice}
                      </p>
                    ) : null}
                    {selectedShadow.repair ? (
                      <p className="mt-2 text-sm leading-6 text-stone-700">
                        <strong>Repair:</strong> {selectedShadow.repair}
                      </p>
                    ) : null}
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
              <Button variant="secondary" onClick={saveCurrentReport}>
                <Save size={16} />
                Save report
              </Button>
              <Button variant="secondary" onClick={() => { saveReport(); setTab("report"); }}>
                View report
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
          <Button variant="primary" disabled={step === maxStep} onClick={() => setStep((value) => Math.min(maxStep, value + 1))}>
            Next
            <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </div>
  );
}

function Explore({ rows, setLatestReport }) {
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
  const libraryReport = {
    core,
    sub,
    specific,
    needs,
    situation: "Feelings Library",
    bodySignals: [],
    frame: `You are noticing ${specific.toLowerCase()}. The needs underneath may include ${needs.join(", ")}. Use that signal to make one clean request or choose one recovery action.`,
    scripts: SCRIPT_TYPES.map((script) => script.build({ emotion: specific, needs, situation: "Feelings Library", audience: "person", mode: "Feelings Library" })),
    shadows: getRelevantShadows({ core, needs, bodyLabels: [], situationLabel: "Feelings Library" }),
    guidance: guidanceFor({ core, sub, specific, needs }),
    createdAt: new Date().toISOString(),
  };

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
              setLatestReport(libraryReport);
              showToast("Report created");
            }}
          >
            <Save size={16} />Create report
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
    situation: latest?.situation || "this situation",
    audience: latest?.audience || "person",
    mode: latest?.mode || "this conversation",
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

function Report({ report }) {
  const payload = report
    ? [
        `${APP_TITLE} check-in report`,
        "",
        `Who: ${report.audience || "Not selected"}`,
        `Mode: ${report.mode || "Check In"}`,
        `Situation: ${report.situation}`,
        `Body signals: ${report.bodySignals?.join(", ") || "not selected"}`,
        `Feeling: ${report.core} / ${report.sub} / ${report.specific}`,
        `Needs: ${report.needs?.join(", ")}`,
        "",
        "Frame:",
        report.frame,
        "",
        "Mindset:",
        report.mindset || "",
        "",
        "Shadow patterns:",
        ...(report.shadows || []).map((shadow) => `- ${shadow.label}: ${shadow.signal} Pattern: ${shadow.tactic} Four Horsemen link: ${shadow.horseman} Practice: ${shadow.practice || ""} Repair: ${shadow.repair || ""} Move: ${shadow.move}`),
        "",
        "Scripts:",
        ...(report.scripts || []).map((script) => {
          if (typeof script === "string") return `- ${script}`;
          return `- ${script.label}: ${script.text}`;
        }),
        "",
        "Guidance:",
        report.guidance,
        "",
        ATTR_LINE,
      ].join("\n")
    : "";

  if (!report) {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border border-stone-200 bg-white p-6">
        <SectionTitle
          title="Report"
          copy="Complete a Check In to generate a focused Exploring Needs report with the frame, needs, shadow patterns, and scripts."
        />
        <Button className="mt-4" variant="primary" onClick={() => copyText("Run a Check In to create your Exploring Needs report.")}>
          <Clipboard size={16} />
          Copy placeholder
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <SectionTitle
        title="Report"
        copy="A focused result from the check-in. Use this to copy, share, reflect, or prepare for a conversation."
      />
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-950">
          <Trophy size={16} />
          Frame
        </div>
        <p className="mt-3 text-lg font-semibold leading-8 text-emerald-950">{report.frame}</p>
      </div>
      {report.mindset ? (
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="text-sm font-black text-stone-950">Mindset</div>
          <p className="mt-2 text-sm leading-6 text-stone-700">{report.mindset}</p>
        </div>
      ) : null}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="text-sm font-black text-stone-950">Feeling and needs</div>
          <div className="mt-2 text-2xl font-black">{report.specific}</div>
          <div className="text-sm text-stone-600">{report.core} / {report.sub}</div>
          <div className="mt-3"><NeedBadges needs={report.needs || []} /></div>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="text-sm font-black text-stone-950">Context</div>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            {report.audience || "Person"} using {report.mode || "Check In"}
          </p>
          <div className="mt-3 text-sm font-black text-stone-950">Situation</div>
          <p className="mt-2 text-sm leading-6 text-stone-700">{report.situation}</p>
          <div className="mt-3 text-sm font-black text-stone-950">Body signals</div>
          <p className="mt-1 text-sm leading-6 text-stone-700">{report.bodySignals?.join(", ") || "Not selected"}</p>
        </div>
      </div>
      <div className="rounded-lg border border-stone-200 bg-white p-4">
        <div className="text-sm font-black text-stone-950">Shadow work</div>
        <div className="mt-3 grid gap-3">
          {(report.shadows || []).map((shadow) => (
            <div key={shadow.id} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="text-sm font-black text-stone-950">{shadow.label}</div>
              <p className="mt-1 text-sm leading-6 text-stone-700">{shadow.signal}</p>
              <p className="mt-1 text-sm leading-6 text-stone-700"><strong>Pattern:</strong> {shadow.tactic}</p>
              <p className="mt-1 text-sm leading-6 text-stone-700"><strong>Four Horsemen link:</strong> {shadow.horseman}</p>
              {shadow.practice ? <p className="mt-1 text-sm leading-6 text-stone-700"><strong>Practice:</strong> {shadow.practice}</p> : null}
              {shadow.repair ? <p className="mt-1 text-sm leading-6 text-stone-700"><strong>Repair:</strong> {shadow.repair}</p> : null}
              <p className="mt-1 text-sm leading-6 text-stone-700"><strong>Move:</strong> {shadow.move}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="text-sm font-black text-stone-950">Scripts</div>
        <div className="mt-3 grid gap-3">
          {(report.scripts || []).map((script, index) => {
            const label = typeof script === "string" ? `Script ${index + 1}` : script.label;
            const text = typeof script === "string" ? script : script.text;
            return (
              <div key={`${label}-${index}`} className="rounded-lg border border-amber-200 bg-white p-3">
                <div className="text-sm font-black text-stone-950">{label}</div>
                <p className="mt-2 text-sm leading-6 text-stone-800">{text}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <Button variant="amber" onClick={() => copyText(payload)}><Clipboard size={16} />Copy report</Button>
        <Button variant="secondary" onClick={() => navigator.share ? navigator.share({ title: "Exploring Needs Report", text: payload }).catch(() => copyText(payload)) : copyText(payload)}>
          <ArrowRight size={16} />Share report
        </Button>
        <a href={CALENDAR_URL} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 text-sm font-semibold text-stone-950 transition hover:bg-amber-400">
          <CalendarDays size={16} />Book support
        </a>
      </div>
    </div>
  );
}

function ShadowLibrary() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <SectionTitle
        title="Shadow Work Library"
        copy="Shadow patterns are common ways emotional energy moves off target. Use this library to recognize the pattern and choose a cleaner move."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {SHADOW_PATTERNS.map(enrichShadow).map((shadow) => (
          <div key={shadow.id} className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="text-lg font-black text-stone-950">{shadow.label}</div>
            <p className="mt-2 text-sm leading-6 text-stone-700">{shadow.signal}</p>
            <div className="mt-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="text-sm font-black text-stone-950">Core wound</div>
              <p className="mt-1 text-sm leading-6 text-stone-700">{shadow.wound}</p>
            </div>
            <div className="mt-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="text-sm font-black text-stone-950">Common pattern</div>
              <p className="mt-1 text-sm leading-6 text-stone-700">{shadow.tactic}</p>
            </div>
            <div className="mt-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="text-sm font-black text-stone-950">Four Horsemen link</div>
              <p className="mt-1 text-sm leading-6 text-stone-700">{shadow.horseman}</p>
            </div>
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <div className="text-sm font-black text-emerald-950">Self-healing practice</div>
              <p className="mt-1 text-sm leading-6 text-emerald-950">{shadow.practice}</p>
            </div>
            <div className="mt-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="text-sm font-black text-stone-950">Repair sentence</div>
              <p className="mt-1 text-sm leading-6 text-stone-700">{shadow.repair}</p>
            </div>
            <div className="mt-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="text-sm font-black text-stone-950">Do not</div>
              <p className="mt-1 text-sm leading-6 text-stone-700">{shadow.doNot}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HelpWiki({ setTab }) {
  const topics = [
    {
      title: "What this is",
      body: "ExploringNeeds.com is a guided emotional intelligence tool. It helps you move from a charged feeling into the unmet need, shadow pattern, repair language, and practical next action.",
    },
    {
      title: "What it is not",
      body: "It is not a diagnosis, a replacement for therapy, or a tool for labeling someone else. Use it to understand your own signal, choose cleaner action, and prepare for honest conversation.",
    },
    {
      title: "What a need means",
      body: "A need is the human value underneath the emotion. Examples include respect, safety, clarity, support, dignity, repair, autonomy, connection, rest, and reassurance.",
    },
    {
      title: "How the check-in works",
      body: "The wizard asks who is using it, what kind of work is needed, what happened, what the body did, which feeling fits, and which needs are active. The final report turns that into action.",
    },
    {
      title: "How to use the report",
      body: "Read the frame first. Then choose one corrective action, one script, and one shadow pattern to watch. Copy or share the report when it helps you stay clear in a conversation.",
    },
    {
      title: "What shadow work means",
      body: "A shadow is a protective pattern that can move emotional energy off target. Examples include control, withdrawal, attack, approval seeking, DARVO, JADE, rescue, grandiosity, and reality distortion.",
    },
    {
      title: "Four Horsemen",
      body: "Criticism, contempt, defensiveness, and stonewalling are warning signs in relationships. The shadow guidance points out where these patterns may be entering the moment.",
    },
    {
      title: "DARVO and JADE",
      body: "DARVO means deny, attack, reverse victim and offender. JADE means justify, argue, defend, explain. Both can keep people stuck when accountability or boundaries are needed.",
    },
    {
      title: "When to slow down",
      body: "If your body is hot, numb, shaky, tight, or ready to attack, regulate before speaking. A better script lands after your nervous system has enough room to choose.",
    },
    {
      title: "When to get support",
      body: "Book support when patterns repeat, conflict escalates, reality feels confusing, or you need help turning insight into consistent action.",
    },
  ];

  const quickLinks = [
    { label: "Run a check-in", tab: "checkin" },
    { label: "Read latest report", tab: "report" },
    { label: "Browse feelings", tab: "explore" },
    { label: "Study shadows", tab: "shadows" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <SectionTitle
        title="Help Wiki"
        copy="A practical guide to the concepts inside ExploringNeeds.com and how to use the tool without getting lost."
      />

      <div className="grid gap-2 sm:grid-cols-4">
        {quickLinks.map((item) => (
          <Button key={item.label} variant="secondary" onClick={() => setTab(item.tab)}>
            {item.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {topics.map((topic) => (
          <article key={topic.title} className="rounded-lg border border-stone-200 bg-white p-4">
            <h3 className="text-base font-black text-stone-950">{topic.title}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-700">{topic.body}</p>
          </article>
        ))}
      </div>

      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="text-sm font-black text-emerald-950">Simple operating rule</div>
        <p className="mt-2 text-sm leading-6 text-emerald-950">
          Name what happened, notice the body, identify the feeling, find the need, watch the shadow, choose one clean move.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const rows = useMemo(() => toRows(), []);
  const [tab, setTab] = useState("intro");
  const [checkInKey, setCheckInKey] = useState(0);
  const [themeId, setThemeId] = useState("sage");
  const [latestReport, setLatestReport] = useState(null);

  const startNewCheckIn = () => {
    setTab("checkin");
    setCheckInKey((value) => value + 1);
  };

  return (
    <AppShell tab={tab} setTab={setTab} onNewCheckIn={startNewCheckIn} themeId={themeId} setThemeId={setThemeId}>
      {tab === "intro" && <Intro setTab={setTab} />}
      {tab === "checkin" && <GuidedCheckIn key={checkInKey} rows={rows} setLatestReport={setLatestReport} setTab={setTab} />}
      {tab === "explore" && <Explore rows={rows} setLatestReport={setLatestReport} />}
      {tab === "report" && <Report report={latestReport} />}
      {tab === "shadows" && <ShadowLibrary />}
      {tab === "scripts" && <Scripts latest={latestReport} />}
      {tab === "help" && <HelpWiki setTab={setTab} />}
    </AppShell>
  );
}
