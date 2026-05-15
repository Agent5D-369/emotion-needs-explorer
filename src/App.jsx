import React, { useEffect, useMemo, useState } from "react";
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

const APP_NAME = "Exploring Needs";
const APP_TITLE = "Emotional Intelligence Toolkit";
const APP_TAGLINE = "Feelings to needs to repair.";
const APP_SUBTITLE = "Name feelings. Find needs. Repair patterns.";
const HERO_TITLE = "Turn the reaction into a repair plan.";
const HERO_COPY =
  "Use a guided check-in to name the feeling, find the unmet need, spot the shadow pattern, and choose one clean next move.";
const ATTR_LINE =
  "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/) | ExploringNeeds.com | Rick Broider | Agent5D.com | HolisticLifeTribe.com";
const CALENDAR_URL = "https://calendar.app.google/NQvsMN7X5evMK9Q1A";
const PAYPAL_URL = "https://www.paypal.com/ncp/payment/PEDRQJN9PAREL";
const AI_COACH_URL = "https://aiholisticwellnesscoach.com/";
const REPORTS_STORAGE_KEY = "exploring_needs_reports_v1";
const LANGUAGE_STORAGE_KEY = "exploring_needs_language_v1";

const LANGUAGES = [
  { id: "en", label: "English", short: "EN" },
  { id: "es", label: "Español", short: "ES" },
];

const I18N = {
  en: {
    appTitle: "Emotional Intelligence Toolkit",
    appTagline: "Feelings to needs to repair.",
    appSubtitle: "Name feelings. Find needs. Repair patterns.",
    newCheckIn: "New check-in",
    copied: "Copied",
    language: "Language",
    nav: {
      intro: "Start",
      checkin: "Check In",
      reset: "Reset",
      paths: "Paths",
      explore: "Feelings",
      shadows: "Shadows",
      scripts: "Scripts",
      reports: "Reports",
      tracker: "Tracker",
      help: "Help",
    },
    support: {
      talk: "Talk about it now",
      donate: "Support with a donation",
      book: "Book coaching support",
    },
    themeLabel: "Themes",
    themes: {},
    intro: {
      title: "Turn the reaction into a repair plan.",
      copy: "Use a guided check-in to name the feeling, find the unmet need, spot the shadow pattern, and choose one clean next move.",
      start: "Start guided check-in",
      shadowFinder: "Shadow finder",
      reset: "90-second reset",
      help: "Read help wiki",
      tags: [
        "From reaction to repair.",
        "Decode the emotion. Meet the need. Move with integrity.",
        "A practical map from charged emotion to clear action.",
      ],
      howTitle: "How to use it",
      howCopy: "Move one screen at a time. Choose the closest fit. The goal is not a perfect label. The goal is a better next move.",
      steps: [
        ["Start with who is using it", "The app adapts its language for a man, woman, teen, parent, partner, coach, or mentor."],
        ["Choose the kind of work", "Use Quick Check In for speed, Relationship Repair for conflict, Shadow Work for patterns, Accountability for ownership, or Support Someone when guiding another person."],
        ["Let the body narrow the map", "Body signals help translate a charged moment into a likely feeling and need without forcing perfect words too early."],
        ["Use the report", "The final report gives the frame, needs, shadows to watch, scripts, repair language, and one practical next move."],
      ],
      bestTitle: "Best use case",
      bestCopy: "Use it before a hard conversation, after a triggering moment, when you feel stuck in blame or shutdown, or when you want to support someone without controlling them.",
      helpsTitle: "What this helps with",
      helpsCopy: "Use it when emotions are high, repair matters, accountability is needed, or the same relationship pattern keeps repeating.",
      helps: [
        "Unmet needs explorer",
        "Relationship repair tool",
        "Shadow work guide",
        "DARVO and JADE pattern support",
        "Four Horsemen relationship awareness",
        "Emotional intelligence training for men and boys",
      ],
    },
    checkin: {
      progress: ["Who", "Mode", "Event", "Body", "Feeling", "Need", "Report"],
      breadcrumb: {
        currentPath: "Current path",
        who: "Who",
        mode: "Mode",
        event: "Event",
        body: "Body",
        feeling: "Feeling",
        needs: "Needs",
      },
      steps: {
        whoTitle: "Who is using this?",
        whoCopy: "Choose the lens first so the check-in can shape the language, report, and repair guidance around the person using it.",
        howTitle: "How to use this",
        modeTitle: "Choose the work",
        modeCopy: "This keeps the flow focused. A quick check-in, a repair conversation, shadow work, accountability, and support all need different guidance.",
        eventTitle: "What happened?",
        eventCopy: "Start with the situation, not the perfect emotion word. The next steps translate the signal into needs, shadow patterns, and action.",
        bodyTitle: "What did your body do?",
        bodyCopy: "The body often tells the truth before language catches up. Pick every signal that fits.",
        feelingTitle: "What word is closest?",
        feelingCopy: "Do not force certainty. Choose the closest match, then adjust if another word lands better.",
        needTitle: "What need is underneath?",
        needCopy: "A need is not an excuse. It is the signal that tells you what kind of repair, request, or boundary matters.",
        reportTitle: "Your report",
        reportCopy: "This is the output of the check-in. Copy it, share it, or use it as the next conversation script.",
      },
      guidance: [
        "You do not need the perfect word yet. Start with the event, then let the body signals narrow the map.",
        "A feeling points to a need. A need points to a clean request, repair, boundary, or pause.",
        "If the moment is intense, use the final script after your body settles enough to speak clearly.",
      ],
      needPills: "<strong>Need pills:</strong> these are the unmet needs that may be underneath the emotion. They are not excuses. They point toward the request, repair, boundary, or care action that could help.",
      labels: {
        frame: "The frame",
        commonShadows: "Common shadows to watch",
        commonShadowsCopy: "These are not labels. They are common ways emotional energy can move off target.",
        pattern: "Pattern",
        horsemen: "Four Horsemen link",
        coreWound: "Core wound",
        healingNeed: "Healing need",
        practice: "Practice",
        repair: "Repair",
        bestMove: "Best move",
        doNow: "Do this now",
        avoidNow: "Avoid this now",
        settle: "Settle",
        name: "Name",
        ask: "Ask",
        scripts: "Context-sensitive scripts",
        scriptsCopy: "Pick the words that match the move you need: request, boundary, repair, or coaching conversation.",
        deeper: "Optional deeper guidance",
        shareable: "Shareable insight",
        shareableCopy: "Use this public version when you want to share the tool without sharing the private story.",
        notSelected: "not selected",
        situation: "Situation",
        bodySignals: "Body signals",
        likelyEmotion: "Likely emotion",
        unmetNeeds: "Unmet needs",
        mindset: "Mindset",
        likelyShadows: "Likely shadow patterns",
        actionPlan: "Corrective action plan",
        nextMove: "Next move",
        guidedNextStep: "Guided next step",
      },
      actions: {
        settle: "take 90 seconds and reduce heat in the body.",
        name: "choose the top need, usually",
        ask: "make one request that can happen today.",
        avoidHistory: "Do not argue for your whole history.",
        avoidSilence: "Do not punish with silence.",
        avoidMindReading: "Do not demand mind-reading. Make the need visible.",
      },
      buttons: {
        back: "Back",
        next: "Next",
        copy: "Copy",
        saveReport: "Save report",
        viewReports: "View reports",
        copyScript: "Copy this script",
        copyShareCard: "Copy share card",
        shareInsight: "Share insight",
      },
      saved: "Report saved to this browser",
      fallbackNeed: "Something important was asking to be named, protected, or requested clearly.",
    },
  },
  es: {
    appTitle: "Kit de Inteligencia Emocional",
    appTagline: "De sentir a necesitar y reparar.",
    appSubtitle: "Nombra emociones. Encuentra necesidades. Repara patrones.",
    newCheckIn: "Nuevo check-in",
    copied: "Copiado",
    language: "Idioma",
    nav: {
      intro: "Inicio",
      checkin: "Check-in",
      reset: "Regular",
      paths: "Caminos",
      explore: "Emociones",
      shadows: "Sombras",
      scripts: "Guiones",
      reports: "Planes",
      tracker: "Patrones",
      help: "Ayuda",
    },
    support: {
      talk: "Hablarlo ahora",
      donate: "Apoyar con donación",
      book: "Reservar apoyo",
    },
    themeLabel: "Temas",
    themes: {
      "Light: Sage Ground": "Claro: Tierra salvia",
      "Light: Clear Sky": "Claro: Cielo limpio",
      "Light: Warm Clay": "Claro: Arcilla cálida",
      "Dark: Forest Night": "Oscuro: Bosque nocturno",
      "Dark: Harbor Blue": "Oscuro: Azul puerto",
      "Dark: Ember Calm": "Oscuro: Brasa calma",
    },
    intro: {
      title: "Convierte la reacción en un plan de reparación.",
      copy: "Usa un check-in guiado para nombrar la emoción, encontrar la necesidad no atendida, detectar el patrón de sombra y elegir un siguiente movimiento limpio.",
      start: "Iniciar check-in guiado",
      shadowFinder: "Buscar sombra",
      reset: "Reset de 90 segundos",
      help: "Leer la guía",
      tags: [
        "De reacción a reparación.",
        "Decodifica la emoción. Atiende la necesidad. Actúa con integridad.",
        "Un mapa práctico de carga emocional a acción clara.",
      ],
      howTitle: "Cómo usarlo",
      howCopy: "Avanza una pantalla a la vez. Elige lo que más se acerque. La meta no es una etiqueta perfecta. La meta es un mejor siguiente movimiento.",
      steps: [
        ["Empieza con quién lo está usando", "La app adapta su lenguaje para hombre, mujer, adolescente, madre, padre, pareja, coach o mentor."],
        ["Elige el tipo de trabajo", "Usa Check In Rápido para velocidad, Reparación Relacional para conflicto, Trabajo de Sombra para patrones, Responsabilidad para apropiarte de tu parte, o Apoyar a Alguien cuando guías a otra persona."],
        ["Deja que el cuerpo reduzca el mapa", "Las señales corporales ayudan a traducir un momento cargado en una emoción y necesidad probable sin forzar palabras perfectas demasiado pronto."],
        ["Usa el plan", "El resultado final te da el marco, necesidades, sombras a vigilar, guiones, lenguaje de reparación y un siguiente movimiento práctico."],
      ],
      bestTitle: "Mejor uso",
      bestCopy: "Úsalo antes de una conversación difícil, después de un disparador, cuando te quedes en culpa o cierre, o cuando quieras apoyar a alguien sin controlarlo.",
      helpsTitle: "En qué ayuda",
      helpsCopy: "Úsalo cuando las emociones están altas, la reparación importa, se necesita responsabilidad o el mismo patrón relacional se repite.",
      helps: [
        "Explorador de necesidades no atendidas",
        "Herramienta de reparación relacional",
        "Guía de trabajo de sombra",
        "Apoyo para patrones DARVO y JADE",
        "Conciencia de los Cuatro Jinetes en relaciones",
        "Entrenamiento de inteligencia emocional para hombres y chicos",
      ],
    },
    checkin: {
      progress: ["Quién", "Modo", "Evento", "Cuerpo", "Emoción", "Necesidad", "Plan"],
      breadcrumb: {
        currentPath: "Ruta actual",
        who: "Quién",
        mode: "Modo",
        event: "Evento",
        body: "Cuerpo",
        feeling: "Emoción",
        needs: "Necesidades",
      },
      steps: {
        whoTitle: "¿Quién está usando esto?",
        whoCopy: "Elige primero la perspectiva para que el check-in adapte el lenguaje, el plan y la guía de reparación a la persona que lo usa.",
        howTitle: "Cómo usar esto",
        modeTitle: "Elige el tipo de trabajo",
        modeCopy: "Esto mantiene el flujo enfocado. Un check-in rápido, una reparación relacional, trabajo de sombra, responsabilidad y apoyo a otra persona necesitan guías distintas.",
        eventTitle: "¿Qué pasó?",
        eventCopy: "Empieza con la situación, no con la palabra emocional perfecta. Los siguientes pasos traducen la señal en necesidades, patrones de sombra y acción.",
        bodyTitle: "¿Qué hizo tu cuerpo?",
        bodyCopy: "El cuerpo suele decir la verdad antes de que el lenguaje llegue. Elige cada señal que encaje.",
        feelingTitle: "¿Qué palabra se acerca más?",
        feelingCopy: "No fuerces certeza. Elige la opción más cercana y ajusta si otra palabra encaja mejor.",
        needTitle: "¿Qué necesidad hay debajo?",
        needCopy: "Una necesidad no es una excusa. Es la señal que muestra qué reparación, petición o límite importa.",
        reportTitle: "Tu plan",
        reportCopy: "Este es el resultado del check-in. Cópialo, compártelo o úsalo como guion para la siguiente conversación.",
      },
      guidance: [
        "No necesitas la palabra perfecta todavía. Empieza con el evento y deja que las señales del cuerpo reduzcan el mapa.",
        "Una emoción apunta a una necesidad. Una necesidad apunta a una petición limpia, reparación, límite o pausa.",
        "Si el momento está intenso, usa el guion final cuando tu cuerpo se calme lo suficiente para hablar con claridad.",
      ],
      needPills: "<strong>Píldoras de necesidad:</strong> estas son las necesidades no atendidas que podrían estar debajo de la emoción. No son excusas. Señalan la petición, reparación, límite o acción de cuidado que podría ayudar.",
      labels: {
        frame: "El marco",
        commonShadows: "Sombras comunes a vigilar",
        commonShadowsCopy: "No son etiquetas. Son formas comunes en que la energía emocional puede salirse de dirección.",
        pattern: "Patrón",
        horsemen: "Relación con los Cuatro Jinetes",
        coreWound: "Herida central",
        healingNeed: "Necesidad de sanación",
        practice: "Práctica",
        repair: "Reparación",
        bestMove: "Mejor movimiento",
        doNow: "Haz esto ahora",
        avoidNow: "Evita esto ahora",
        settle: "Regular",
        name: "Nombrar",
        ask: "Pedir",
        scripts: "Guiones sensibles al contexto",
        scriptsCopy: "Elige las palabras que coincidan con el movimiento que necesitas: petición, límite, reparación o conversación de guía.",
        deeper: "Guía más profunda opcional",
        shareable: "Insight para compartir",
        shareableCopy: "Usa esta versión pública cuando quieras compartir la herramienta sin compartir la historia privada.",
        notSelected: "no seleccionado",
        situation: "Situación",
        bodySignals: "Señales corporales",
        likelyEmotion: "Emoción probable",
        unmetNeeds: "Necesidades no atendidas",
        mindset: "Mentalidad",
        likelyShadows: "Patrones de sombra probables",
        actionPlan: "Plan de acción correctiva",
        nextMove: "Siguiente movimiento",
        guidedNextStep: "Siguiente paso guiado",
      },
      actions: {
        settle: "toma 90 segundos y baja el calor del cuerpo.",
        name: "elige la necesidad principal, normalmente",
        ask: "haz una petición que pueda ocurrir hoy.",
        avoidHistory: "No discutas toda tu historia.",
        avoidSilence: "No castigues con silencio.",
        avoidMindReading: "No exijas que te lean la mente. Haz visible la necesidad.",
      },
      buttons: {
        back: "Atrás",
        next: "Siguiente",
        copy: "Copiar",
        saveReport: "Guardar plan",
        viewReports: "Ver planes",
        copyScript: "Copiar este guion",
        copyShareCard: "Copiar tarjeta",
        shareInsight: "Compartir insight",
      },
      saved: "Plan guardado en este navegador",
      fallbackNeed: "Algo importante pedía ser nombrado, protegido o solicitado con claridad.",
    },
  },
};

const ES_ENTITY_COPY = {
  audiences: {
    man: { label: "Hombre", description: "directo, responsable y listo para relaciones" },
    woman: { label: "Mujer", description: "necesidades claras, límites limpios y reparación centrada" },
    "teen-boy": { label: "Chico adolescente", description: "lenguaje simple, menos presión y más ejemplos" },
    "teen-girl": { label: "Chica adolescente", description: "lenguaje claro, seguridad, confianza y apoyo" },
    father: { label: "Padre", description: "liderazgo sin control ni cierre emocional" },
    mother: { label: "Madre", description: "cuidar sin cargarlo todo ni borrarte" },
    coach: { label: "Coach / Maestro / Mentor", description: "preguntas que guían sin acorralar" },
    partner: { label: "Pareja", description: "reparación, responsabilidad y conexión" },
  },
  modes: {
    quick: {
      label: "Check In Rápido",
      description: "Nombra la señal y recibe un siguiente movimiento limpio.",
      lens: "Pasa de la activación a una acción clara.",
    },
    repair: {
      label: "Reparación Relacional",
      description: "Úsalo cuando la cercanía, la confianza o la comunicación estén tensas.",
      lens: "Protege la dignidad, reduce los Cuatro Jinetes y elige un movimiento de reparación.",
    },
    shadow: {
      label: "Trabajo de Sombra",
      description: "Encuentra el patrón protector debajo de la reacción.",
      lens: "Estudia el patrón sin vergüenza y elige una expresión más limpia de la necesidad.",
    },
    accountability: {
      label: "Responsabilidad",
      description: "Hazte cargo del impacto sin caer en vergüenza ni voltear la culpa.",
      lens: "Separa la dignidad de la defensa y haz que la reparación sea observable.",
    },
    support: {
      label: "Apoyar a Alguien",
      description: "Úsalo cuando ayudas a un hijo, pareja, cliente o amigo.",
      lens: "Guía con curiosidad, no con control. Ayuda a nombrar la señal y elegir un siguiente paso.",
    },
  },
  situations: {
    disrespected: { label: "Me sentí irrespetado o tratado con desprecio", hint: "tono, desestimación, insulto, interrupción" },
    criticized: { label: "Me sentí criticado o corregido", hint: "retroalimentación, culpa, ser señalado" },
    unseen: { label: "Me sentí invisible o poco apreciado", hint: "esfuerzo no visto, carga invisible, sin agradecimiento" },
    rejected: { label: "Rechazado o excluido", hint: "ignorado, excluido, no elegido" },
    "sexual-rejection": { label: "Rechazo sexual o sentirme no deseado", hint: "deseo, contacto, intimidad, vergüenza" },
    abandoned: { label: "Abandono emocional", hint: "solo en el momento, sin respuesta" },
    controlled: { label: "Controlado, atrapado o acorralado", hint: "reglas, presión, sin espacio para elegir" },
    exposed: { label: "Expuesto, avergonzado o descubierto", hint: "error, vulnerabilidad, vergüenza" },
    pressure: { label: "Demasiada presión", hint: "escuela, trabajo, dinero, rendimiento" },
    accountability: { label: "Me pidieron asumir responsabilidad", hint: "impacto nombrado, disculpa necesaria, defensa subiendo" },
    "partner-upset": { label: "Mi pareja está molesta y me siento culpado", hint: "tensión relacional, conflicto, defensividad" },
    shutdown: { label: "Quiero cerrarme", hint: "silencio, adormecido, sobrecargado, hacia adentro" },
    "prove-right": { label: "Quiero demostrar que tengo razón", hint: "debate, hechos, ganar, energía de juicio" },
    "victim-loop": { label: "Me siento como la víctima", hint: "injusticia, resentimiento, impotencia" },
    overgiving: { label: "Usado, drenado o dando de más", hint: "impulso codependiente, resentimiento, rescate" },
    jealous: { label: "Celoso, reemplazado o comparado", hint: "competencia, miedo a perder mi lugar" },
    "woman-disrespect": { label: "Irrespetado por una mujer", hint: "herida materna, conflicto de pareja, espejo femenino" },
    "purpose-power": { label: "Sin poder con dinero, trabajo o propósito", hint: "presión de proveedor, dirección, estatus, estrés" },
    "crossed-line": { label: "Crucé una línea y necesito reparar", hint: "herí a alguien, rompí confianza, necesito asumir limpio" },
    betrayal: { label: "La confianza fue rota", hint: "mentira, exposición, decepción" },
    failure: { label: "Fallé o no estuve a la altura", hint: "error, pérdida, vergüenza, arrepentimiento" },
    conflict: { label: "Discusión o tensión", hint: "pareja, padre o madre, compañero, amigo" },
  },
  bodySignals: {
    jaw: "Mandíbula tensa",
    heat: "Calor en la cara",
    chest: "Pecho apretado",
    stomach: "Vacío en el estómago",
    numb: "Adormecido o cerrado",
    restless: "Energía inquieta",
    "urge-yell": "Ganas de gritar",
    "urge-leave": "Ganas de irme",
  },
};

const ES_NEEDS = {
  respect: "respeto",
  safety: "seguridad",
  fairness: "justicia",
  connection: "conexión",
  belonging: "pertenencia",
  clarity: "claridad",
  support: "apoyo",
  autonomy: "autonomía",
  rest: "descanso",
  acknowledgment: "reconocimiento",
  reassurance: "tranquilidad",
  dignity: "dignidad",
  repair: "reparación",
  honesty: "honestidad",
  forgiveness: "perdón",
  space: "espacio",
  care: "cuidado",
  competence: "competencia",
  agency: "agencia",
  reciprocity: "reciprocidad",
  security: "seguridad emocional",
  stability: "estabilidad",
  accountability: "responsabilidad",
  patience: "paciencia",
  tolerance: "tolerancia",
  understanding: "comprensión",
  calm: "calma",
  control: "control",
  empowerment: "empoderamiento",
  choice: "elección",
  movement: "movimiento",
  "to be heard": "ser escuchado",
  resolution: "resolución",
  encouragement: "ánimo",
};

const ES_NEED_EXPLAINERS = {
  respect: "Ser tratado con dignidad, sin ser menospreciado ni descartado.",
  safety: "Saber que no estás bajo amenaza y que puedes bajar el ritmo.",
  fairness: "Confiar en que las reglas, cargas o consecuencias están equilibradas.",
  connection: "Sentirte cerca, incluido y recordado.",
  belonging: "Saber que tienes un lugar con tu gente.",
  clarity: "Saber qué es verdad, qué importa y qué pasa después.",
  support: "No tener que cargar todo solo.",
  autonomy: "Tener elección, voz y espacio para decidir.",
  rest: "Recuperarte antes de seguir empujando.",
  acknowledgment: "Que tu esfuerzo, dolor o verdad sean nombrados con precisión.",
  reassurance: "Recibir suficiente verdad y estabilidad para dejar de adivinar.",
  dignity: "Seguir siendo humano y valioso incluso cuando se nombra algo difícil.",
  repair: "Hacer específico el daño y restaurar confianza con acción.",
  honesty: "Trabajar con lo real en vez de manejar imagen o evitar impacto.",
  forgiveness: "Poder aprender, reparar y volver a la integridad.",
  space: "Tener suficiente espacio para regularte antes de responder.",
  care: "Recibir ternura, atención y protección donde estás herido.",
  competence: "Sentirte capaz y apoyado para enfrentar el reto.",
  agency: "Recordar que todavía tienes un siguiente movimiento aunque la situación sea injusta.",
  reciprocity: "Que el esfuerzo, el cuidado y la responsabilidad se muevan en ambas direcciones.",
  security: "Sentirte elegido, estable y no fácilmente reemplazable.",
  stability: "Tener suficiente previsibilidad para calmarte y actuar con claridad.",
  accountability: "Asumir impacto sin perder dignidad ni voltear la culpa.",
};

const ES_AUDIENCE_MINDSET = {
  man: "Esto no se trata de ser blando. Se trata de leer la señal antes de que maneje tu siguiente movimiento.",
  woman: "Esto se trata de nombrar la señal, honrar tu cuerpo y elegir acción clara sin abandonarte.",
  "teen-boy": "No tienes que explicarlo perfecto. Elige la respuesta más cercana y sigue.",
  "teen-girl": "No necesitas las palabras perfectas. Elige lo que encaja y deja que la herramienta te ayude a nombrar la necesidad.",
  father: "Lidera sin controlar. Tu claridad calmada enseña más que la presión.",
  mother: "Cuida sin cargarlo todo. La meta es verdad, límites y reparación.",
  coach: "Guía con curiosidad. La meta es ayudarles a nombrar la señal sin acorralarlos.",
  partner: "Mantente cerca del impacto, la necesidad y la reparación. No conviertas la conversación en un juicio.",
};

const ES_EMOTIONS = {
  Anger: "Enojo",
  Disgust: "Rechazo",
  Fear: "Miedo",
  Happiness: "Alegría",
  Sadness: "Tristeza",
  Surprise: "Sorpresa",
};

function localizeNeed(need, lang = "en") {
  if (lang !== "es") return need;
  return ES_NEEDS[need] || need;
}

function localizeNeeds(needs = [], lang = "en") {
  return needs.map((need) => localizeNeed(need, lang));
}

function localizeEntity(type, item, lang = "en") {
  if (lang !== "es" || !item) return item;
  const override = ES_ENTITY_COPY[type]?.[item.id];
  return override ? { ...item, ...override } : item;
}

function localizeBodySignal(item, lang = "en") {
  if (lang !== "es" || !item) return item;
  return { ...item, label: ES_ENTITY_COPY.bodySignals[item.id] || item.label };
}

function localizeEmotion(value, lang = "en") {
  if (lang !== "es") return value;
  return ES_EMOTIONS[value] || value;
}

function localizeNeedExplainer(need, lang = "en") {
  if (lang === "es") return ES_NEED_EXPLAINERS[need];
  return NEED_EXPLAINERS[need];
}

function buildActionFrame({ activePath, audienceLabel, modeLens, needs, lang = "en" }) {
  const emotion = activePath?.specific?.toLowerCase() || (lang === "es" ? "activado" : "activated");
  const topNeeds = needs.slice(0, 3).join(", ");
  if (lang === "es") {
    return [
      `No solo estás sintiendo ${emotion}. Como ${audienceLabel.toLowerCase()}, tu sistema está señalando una necesidad de ${topNeeds}.`,
      `${modeLens} Regula primero, nombra la necesidad con claridad y haz una petición o acción de reparación que pueda ocurrir hoy.`,
    ].join(" ");
  }
  return [
    `You are not just ${emotion}. As a ${audienceLabel.toLowerCase()}, your system is signaling a need for ${topNeeds}.`,
    `${modeLens} Regulate first, name the need cleanly, and make one request or repair action that can happen today.`,
  ].join(" ");
}

function buildLocalizedScripts({ emotion, needs, situation, mode, audience, lang = "en" }) {
  if (lang !== "es") {
    return SCRIPT_TYPES.map((script) => ({
      ...script,
      text: script.build({ emotion, needs, situation, mode, audience }),
    }));
  }
  const primaryNeed = needs[0] || "claridad";
  return [
    {
      id: "request",
      label: "Petición limpia",
      icon: MessageSquareText,
      text: `Estoy sintiendo ${emotion || "activación"} alrededor de ${situation || "esta situación"} y necesito ${needs.join(", ") || "claridad"}. En ${mode || "esta conversación"}, ¿podemos elegir un siguiente paso concreto y un momento para revisar?`,
    },
    {
      id: "boundary",
      label: "Límite",
      icon: Shield,
      text: `Quiero manejar esto bien. Estoy sintiendo ${emotion || "carga"} y necesito ${primaryNeed}. Si esto sigue moviéndose de una forma que bloquea esa necesidad, voy a pausar y volver con una petición clara y una hora de regreso.`,
    },
    {
      id: "repair",
      label: "Reparación",
      icon: HeartHandshake,
      text: `No manejé eso como quiero. Debajo de eso estaba sintiendo ${emotion || "sobrecarga"} y necesitaba ${needs.join(", ") || "apoyo"}. Lo siento por mi parte. La reparación que puedo ofrecer ahora es nombrar mi impacto, bajar el ritmo y escuchar antes de pedir ser entendido.`,
    },
    {
      id: "coach",
      label: "Pregunta de guía",
      icon: UserRound,
      text: `Prueba preguntarle a ${audience || "la persona"}: "Cuando apareció ${emotion || "esa emoción"}, ¿qué hizo tu cuerpo y qué necesidad pedía atención: ${needs.slice(0, 3).join(", ") || "respeto, seguridad o apoyo"}?"`,
    },
  ];
}

function localizedGuidanceFor(path, lang = "en") {
  if (lang !== "es") return guidanceFor(path);
  const emotion = path?.specific || path?.sub || path?.core || "activación";
  const needs = localizeNeeds(path?.needs || [], "es").slice(0, 3);
  const needText = needs.join(", ") || "claridad";
  return `Regula primero, nombra que estás sintiendo ${emotion}, y centra el siguiente movimiento en ${needText}. Haz una sola petición observable, ofrece una reparación específica o toma una pausa con hora de regreso.`;
}

function localizedCorrectiveActions(lang = "en") {
  if (lang !== "es") return CORRECTIVE_ACTIONS;
  return [
    {
      title: "Regular primero",
      copy: "Toma 90 segundos antes de la conversación si tu cuerpo está caliente, tenso, adormecido o listo para atacar. Respira más bajo, suelta la mandíbula, relaja las manos y reduce estímulos.",
    },
    {
      title: "Nombrar la necesidad sin culpar",
      copy: "Usa una palabra de necesidad como centro de la conversación. Prueba respeto, claridad, tranquilidad, apoyo, seguridad, descanso, conexión o justicia.",
    },
    {
      title: "Hacer una petición posible",
      copy: "Pide una conducta que pueda ocurrir hoy. Las buenas peticiones son específicas, con tiempo definido y observables.",
    },
    {
      title: "Fijar seguimiento",
      copy: "Las necesidades se atienden con acción repetida. Elige cuándo revisarás si la petición, límite o reparación realmente funcionó.",
    },
  ];
}

const TRANSFORMATION_PATHS = [
  {
    id: "shutdown",
    title: "Stop shutting down",
    audience: "Men, teen boys, partners, fathers, and anyone who goes silent under pressure.",
    trigger: "Conflict, criticism, overwhelm, shame, or fear of getting it wrong.",
    need: "Safety, space, dignity, and a clear return path.",
    practice: "Use a timed pause, regulate your body, then return with one honest sentence and one request.",
    metric: "Notice whether you return to the conversation within the time you named.",
  },
  {
    id: "attack",
    title: "Stop exploding or attacking",
    audience: "Anyone who uses intensity, criticism, contempt, or pressure to regain control.",
    trigger: "Disrespect, rejection, feeling cornered, or being asked to take accountability.",
    need: "Respect, fairness, repair, and power that does not require harm.",
    practice: "Drop character attacks. Name the behavior, impact, need, and request.",
    metric: "Count how often you protect the need without insulting the person.",
  },
  {
    id: "approval",
    title: "Heal approval seeking",
    audience: "Codependents, people pleasers, over-givers, and anyone stuck in JADE.",
    trigger: "Fear of rejection, conflict, disappointment, or being misunderstood.",
    need: "Belonging, reassurance, autonomy, and connection that can survive truth.",
    practice: "Tell the smallest complete truth and stop explaining once the boundary is clear.",
    metric: "Notice whether you say yes when your body means no.",
  },
  {
    id: "accountability",
    title: "Build clean accountability",
    audience: "Anyone who gets defensive, collapses into shame, reverses blame, or avoids repair.",
    trigger: "Being called out, hearing impact, receiving feedback, or facing broken trust.",
    need: "Dignity, honesty, repair, and a way to own impact without becoming worthless.",
    practice: "Use behavior, impact, apology, repair, changed action. Do not debate the other person's reality.",
    metric: "Track whether your repair includes a changed behavior that can be observed.",
  },
  {
    id: "victim",
    title: "Break victim identity",
    audience: "Anyone whose pain is real, but whose next move has become proving injury instead of choosing agency.",
    trigger: "Unfairness, resentment, helplessness, betrayal, or old wounds being activated.",
    need: "Acknowledgment, fairness, support, and agency.",
    practice: "Validate the pain, then choose one action that protects dignity today.",
    metric: "Ask whether the next move creates more agency or more evidence of helplessness.",
  },
  {
    id: "repair",
    title: "Repair after harm",
    audience: "Partners, parents, leaders, coaches, and anyone who crossed a line.",
    trigger: "Broken trust, harsh words, silence, betrayal, boundary violations, or missed accountability.",
    need: "Honesty, repair, safety, dignity, and consistency over time.",
    practice: "Name what happened, name the impact, apologize without defense, offer repair, and set follow-up.",
    metric: "Track whether the repair is repeated long enough to rebuild trust.",
  },
];

const EMERGENCY_RESET_STEPS = [
  "Stop talking for 90 seconds if your body wants to attack, run, freeze, explain, or prove.",
  "Unclench your jaw, lower your shoulders, relax your hands, and look at one stable object.",
  "Name one body signal and one possible need. Use the closest fit, not the perfect word.",
  "Choose one clean move: pause, request, boundary, repair, or ask for support.",
];

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
  { id: "coach", label: "Coach / Teacher / Mentor", description: "questions that guide without cornering" },
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
  {
    id: "projection",
    label: "Shadow of Projection",
    triggers: ["Anger", "Fear", "shame", "trust", "clarity", "accountability"],
    signal: "The mind may place an unwanted feeling, motive, or wound onto someone else before checking what is true inside.",
    tactic: "Can look like accusing, mind reading, assuming motive, assigning intent, or treating a fear as evidence.",
    horseman: "Can feed criticism, defensiveness, and contempt.",
    move: "Separate what you know from what you are imagining. Say: I am noticing a story and I need to check what is true.",
  },
  {
    id: "perfectionism",
    label: "Shadow of Perfectionism",
    triggers: ["Fear", "Sadness", "competence", "dignity", "control", "safety"],
    signal: "The body tries to avoid shame by making mistakes feel unacceptable.",
    tactic: "Can look like over-editing, procrastination, harsh self-judgment, impossible standards, or criticizing others first.",
    horseman: "Often turns into criticism or defensiveness.",
    move: "Trade perfect for repairable. Choose the next honest draft, attempt, apology, or small action.",
  },
  {
    id: "entitlement",
    label: "Shadow of Entitlement",
    triggers: ["Anger", "Happiness", "respect", "recognition", "control", "value"],
    signal: "A need for respect or recognition may turn into a demand for exception, access, or special treatment.",
    tactic: "Can look like pressuring, taking, dismissing limits, ignoring consent, or treating disappointment as injustice.",
    horseman: "Strongly linked to contempt and criticism.",
    move: "Respect the other person's no. Make a request without assuming you are owed the answer you want.",
  },
  {
    id: "compliance",
    label: "Shadow of Compliance",
    triggers: ["Fear", "Sadness", "belonging", "safety", "approval", "connection"],
    signal: "The body may try to stay safe by agreeing faster than truth can speak.",
    tactic: "Can look like automatic yes, appeasing, hiding disagreement, smiling through resentment, or becoming who others prefer.",
    horseman: "Can later become stonewalling or criticism when resentment surfaces.",
    move: "Pause before agreeing. Say: I need a minute to check what is true for me before I answer.",
  },
  {
    id: "hyperindependence",
    label: "Shadow of Hyper-Independence",
    triggers: ["Fear", "Sadness", "support", "trust", "safety", "care"],
    signal: "Support can feel dangerous, weak, or unreliable, so the body tries to carry everything alone.",
    tactic: "Can look like refusing help, emotional isolation, over-functioning, distrust, or acting like needs are burdens.",
    horseman: "Can become stonewalling when closeness asks for vulnerability.",
    move: "Let one safe person support one specific thing. Ask for help that is clear, limited, and observable.",
  },
  {
    id: "shamecollapse",
    label: "Shadow of Shame Collapse",
    triggers: ["Sadness", "Fear", "accountability", "repair", "dignity", "forgiveness"],
    signal: "Feedback or impact may become a total identity verdict instead of a repairable behavior.",
    tactic: "Can look like self-attack, giving up, making others comfort you, or turning accountability into your pain.",
    horseman: "Often fuels defensiveness and stonewalling.",
    move: "Stay with the behavior. Say: I can own this without making my shame the center.",
  },
  {
    id: "envy",
    label: "Shadow of Envy",
    triggers: ["Sadness", "Anger", "belonging", "recognition", "security", "value"],
    signal: "Someone else's success, attention, or closeness may feel like proof that you are losing worth or place.",
    tactic: "Can look like comparison, subtle sabotage, dismissing wins, resentment, or trying to pull someone down.",
    horseman: "Often shows up as contempt or criticism.",
    move: "Name the longing underneath the comparison. Turn envy into a request, goal, or grief process.",
  },
  {
    id: "scorekeeping",
    label: "Shadow of Scorekeeping",
    triggers: ["Anger", "Sadness", "fairness", "reciprocity", "acknowledgment", "support"],
    signal: "A real need for fairness may turn into a ledger used to punish, withhold, or prove superiority.",
    tactic: "Can look like tallying, resentment, transactional care, delayed punishment, or using past effort as a weapon.",
    horseman: "Often becomes criticism, defensiveness, and contempt.",
    move: "Ask for the current repair or agreement. Do not make the whole relationship stand trial at once.",
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
  projection: {
    wound: "Fear that your own hurt, shame, or motive will be too hard to face directly.",
    need: "Clarity, self-honesty, safety, and reality testing.",
    practice: "Write: what I know, what I fear, what I am adding. Ask one clean question before reacting.",
    repair: "Say: I put a story on you before checking what was true. I want to separate my fear from your actual behavior.",
    doNot: "Do not accuse, assign motive, diagnose, or punish someone for an unverified interpretation.",
  },
  perfectionism: {
    wound: "Fear that mistakes mean rejection, humiliation, or proof that you are not enough.",
    need: "Competence, dignity, encouragement, and repairable progress.",
    practice: "Choose the smallest honest action that can be improved after it exists.",
    repair: "Say: I made this about perfect performance. I am returning to learning, repair, and the next usable step.",
    doNot: "Do not delay forever, attack yourself, attack others, or use standards as a shield against vulnerability.",
  },
  entitlement: {
    wound: "Fear that not getting what you want means disrespect, invisibility, or loss of status.",
    need: "Respect, recognition, agency, and consent-based connection.",
    practice: "Make the request once. Let the other person have a real no without punishment.",
    repair: "Say: I treated my want like an entitlement. I am respecting your choice and making a cleaner request.",
    doNot: "Do not pressure, corner, guilt, punish, demand access, or ignore consent and limits.",
  },
  compliance: {
    wound: "Fear that truth will cost safety, belonging, protection, or approval.",
    need: "Autonomy, safety, honest connection, and enough time to answer truthfully.",
    practice: "Before saying yes, pause and ask your body if resentment is already forming.",
    repair: "Say: I agreed before I checked my truth. I need to correct that now instead of building resentment.",
    doNot: "Do not abandon your truth, outsource your choices, or confuse appeasement with peace.",
  },
  hyperindependence: {
    wound: "Support has felt unsafe, unreliable, humiliating, or conditional.",
    need: "Trust, support, care, and relationships that do not punish need.",
    practice: "Ask one safe person for one specific form of help this week.",
    repair: "Say: I acted like needing support was a problem. I am practicing asking clearly instead of disappearing into self-reliance.",
    doNot: "Do not isolate, refuse all help, shame your own needs, or call avoidance strength.",
  },
  shamecollapse: {
    wound: "Fear that accountability means you are bad, unlovable, or beyond repair.",
    need: "Dignity, forgiveness, repair, and behavior-level ownership.",
    practice: "Name the specific behavior and impact. Keep the focus there until repair is clear.",
    repair: "Say: I collapsed into shame instead of staying with my impact. I am ready to name the behavior and repair it.",
    doNot: "Do not make others comfort you, disappear, self-attack, or use shame to avoid changed behavior.",
  },
  envy: {
    wound: "Fear that someone else's good means there is less worth, attention, love, or possibility for you.",
    need: "Recognition, belonging, security, grief, and permission to want.",
    practice: "Translate comparison into longing. Ask what desire, grief, or goal the envy is revealing.",
    repair: "Say: I let comparison turn into resentment. I am naming what I want without taking away from you.",
    doNot: "Do not diminish, sabotage, mock, compete for worth, or punish someone for having what you want.",
  },
  scorekeeping: {
    wound: "Fear that effort will never be seen unless every imbalance is recorded and used as proof.",
    need: "Fairness, reciprocity, acknowledgment, and shared responsibility.",
    practice: "Ask for one current agreement. Save the bigger pattern for a calm repair conversation.",
    repair: "Say: I turned this into a ledger. I need acknowledgment and a clear agreement going forward.",
    doNot: "Do not weaponize old effort, withhold care as punishment, or put the entire relationship on trial in one moment.",
  },
};

function enrichShadow(shadow) {
  return { ...shadow, ...(SHADOW_HEALING[shadow.id] || {}) };
}

const SHADOW_CATEGORIES = [
  {
    id: "all",
    label: "All",
    description: "Every shadow pattern in the library.",
    shadowIds: SHADOW_PATTERNS.map((shadow) => shadow.id),
  },
  {
    id: "power",
    label: "Power and control",
    description: "Patterns that try to force certainty, status, compliance, or victory.",
    shadowIds: ["control", "attack", "grandiosity", "entitlement", "scorekeeping"],
  },
  {
    id: "avoidance",
    label: "Avoidance and shutdown",
    description: "Patterns that leave the moment, numb the body, or hide from repair.",
    shadowIds: ["withdrawal", "numbing", "perfectionism", "hyperindependence", "story"],
  },
  {
    id: "accountability",
    label: "Accountability distortions",
    description: "Patterns that dodge impact, distort reality, or collapse under feedback.",
    shadowIds: ["darvo", "gaslight", "shamecollapse", "projection"],
  },
  {
    id: "codependent",
    label: "Codependent survival",
    description: "Patterns that trade truth, boundaries, or agency for safety and closeness.",
    shadowIds: ["approval", "jade", "rescue", "compliance"],
  },
  {
    id: "identity",
    label: "Identity wounds",
    description: "Patterns shaped by shame, comparison, helplessness, and insecure worth.",
    shadowIds: ["victim", "envy", "projection", "perfectionism", "shamecollapse"],
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
  { id: "reset", label: "Reset", icon: Activity },
  { id: "paths", label: "Paths", icon: Trophy },
  { id: "explore", label: "Feelings", icon: Compass },
  { id: "shadows", label: "Shadows", icon: BookOpen },
  { id: "scripts", label: "Scripts", icon: Clipboard },
  { id: "reports", label: "Reports", icon: Sparkles },
  { id: "tracker", label: "Tracker", icon: Search },
  { id: "help", label: "Help", icon: HelpCircle },
];

function LanguagePicker({ lang, setLang, compact = false }) {
  return (
    <div className={cls("grid gap-2", compact ? "grid-cols-2" : "grid-cols-1")}>
      {LANGUAGES.map((language) => (
        <button
          key={language.id}
          onClick={() => setLang(language.id)}
          className={cls(
            "min-h-10 rounded-lg border px-3 text-left text-xs font-black transition",
            lang === language.id
              ? "border-emerald-800 bg-emerald-800 text-white"
              : "border-stone-200 bg-white text-stone-800 hover:border-stone-400"
          )}
        >
          {compact ? language.short : language.label}
        </button>
      ))}
    </div>
  );
}

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

function makeReportId() {
  return `report-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatReportDate(value) {
  if (!value) return "No date saved";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function countValues(values) {
  const counts = new Map();
  values.filter(Boolean).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function buildGrowthPlan(report, lang = "en") {
  const topNeed = report?.needs?.[0] || "clarity";
  const shadow = report?.shadows?.[0];
  const script = report?.scripts?.[0];
  const scriptText = typeof script === "string" ? script : script?.text;
  if (lang === "es") {
    const topNeedEs = localizeNeed(topNeed, "es");
    return {
      today: `Regula primero y luego haz una petición o reparación centrada en ${topNeedEs}.`,
      next24: scriptText || `Di: Estoy notando activación y necesito ${topNeedEs}. ¿Podemos elegir un siguiente paso claro?`,
      week: shadow?.practice || "Repite el movimiento limpio cada día y observa qué cambia en tu cuerpo, conducta y relaciones.",
      integration: shadow?.metric || `Observa si tu siguiente acción crea más ${topNeedEs}, menos reactividad y reparación más limpia.`,
    };
  }
  return {
    today: `Regulate first, then make one request or repair move centered on ${topNeed}.`,
    next24: scriptText || `Say: I am noticing activation and I need ${topNeed}. Can we choose one clear next step?`,
    week: shadow?.practice || "Repeat the clean move daily and track what changes in your body, behavior, and relationships.",
    integration: shadow?.metric || `Track whether your next action creates more ${topNeed}, less reactivity, and cleaner repair.`,
  };
}

function buildShareCardText(report, lang = "en") {
  if (!report) return "";
  const topNeed = report.needs?.[0] || "clarity";
  const shadow = report.shadows?.[0]?.label || "a protective pattern";
  if (lang === "es") {
    return [
      "Pausé antes de reaccionar.",
      `Emoción: ${report.specific || "activación"}`,
      `Necesidad: ${localizeNeed(topNeed, "es")}`,
      `Patrón a vigilar: ${shadow}`,
      `Siguiente movimiento: ${buildGrowthPlan(report, "es").today}`,
      "",
      "Explora tu señal: https://exploringneeds.com/",
    ].join("\n");
  }
  return [
    "I paused before reacting.",
    `Feeling: ${report.specific || "activated"}`,
    `Need: ${topNeed}`,
    `Pattern to watch: ${shadow}`,
    `Next move: ${buildGrowthPlan(report).today}`,
    "",
    "Explore your signal: https://exploringneeds.com/",
  ].join("\n");
}

function shareText(title, text) {
  if (navigator.share) {
    navigator.share({ title, text }).catch(() => copyText(text));
    return;
  }
  copyText(text);
}

function getCopy(lang = "en") {
  return I18N[lang] || I18N.en;
}

function makeTranslator(lang = "en") {
  const copy = getCopy(lang);
  return (path) => path.split(".").reduce((value, key) => value?.[key], copy) ?? path;
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
    donate: "bg-[#f6c344] text-[#1f1600] hover:bg-[#ffd86a] ring-1 ring-[#5f4500]",
    coach: "bg-[#1d4ed8] text-white hover:bg-[#1e40af] ring-1 ring-[#bfdbfe]",
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

function SupportActions({ className = "", t = makeTranslator("en") }) {
  return (
    <div className={cls("grid gap-2 sm:grid-cols-3", className)}>
      <a
        href={AI_COACH_URL}
        target="_blank"
        rel="noreferrer"
        className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#7c3aed] px-4 text-sm font-black text-white ring-1 ring-[#ddd6fe] transition hover:bg-[#6d28d9]"
      >
        <MessageSquareText size={16} />
        {t("support.talk")}
      </a>
      <a
        href={PAYPAL_URL}
        target="_blank"
        rel="noreferrer"
        className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#f6c344] px-4 text-sm font-black text-[#1f1600] ring-1 ring-[#5f4500] transition hover:bg-[#ffd86a]"
      >
        <HeartHandshake size={16} />
        {t("support.donate")}
      </a>
      <a
        href={CALENDAR_URL}
        target="_blank"
        rel="noreferrer"
        className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1d4ed8] px-4 text-sm font-black text-white ring-1 ring-[#bfdbfe] transition hover:bg-[#1e40af]"
      >
        <CalendarDays size={16} />
        {t("support.book")}
      </a>
    </div>
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

function NeedPillHelp({ compact = false, t = makeTranslator("en") }) {
  return (
    <div
      className={cls("rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-950", compact && "p-2 text-xs")}
      dangerouslySetInnerHTML={{ __html: t("checkin.needPills") }}
    />
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

function ThemePicker({ themeId, setThemeId, compact = false, t = makeTranslator("en") }) {
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
          <span>{t(`themes.${theme.label}`) !== `themes.${theme.label}` ? t(`themes.${theme.label}`) : theme.label}</span>
        </button>
      ))}
    </div>
  );
}

function AppShell({ tab, setTab, onNewCheckIn, themeId, setThemeId, lang, setLang, t, children }) {
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
              <div className={cls("text-xs", theme.muted)}>{t("appTagline")}</div>
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
                {t(`nav.${id}`) || label}
              </button>
            ))}
          </nav>
          <div className="mt-8 border-t border-stone-200 pt-4">
            <div className="mb-2 text-xs font-black uppercase tracking-wide">{t("language")}</div>
            <LanguagePicker lang={lang} setLang={setLang} />
          </div>
          <div className="mt-8 border-t border-stone-200 pt-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide">
              <Palette size={14} />
              {t("themeLabel")}
            </div>
            <ThemePicker themeId={themeId} setThemeId={setThemeId} t={t} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden pb-24 md:pb-0">
          <header className={cls("sticky top-0 z-20 border-b px-4 py-3 backdrop-blur md:px-8", theme.surface, theme.border)}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="max-w-[19rem] text-base font-black tracking-normal sm:max-w-none sm:text-lg md:text-2xl">
                  {t("appTitle")}
                </h1>
                <p className={cls("hidden text-sm md:block", theme.muted)}>
                  {t("appSubtitle")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <LanguagePicker lang={lang} setLang={setLang} compact />
                <Button variant="secondary" className="hidden md:inline-flex" onClick={onNewCheckIn}>
                  <RefreshCw size={16} />
                  {t("newCheckIn")}
                </Button>
              </div>
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
              <span>{t(`nav.${id}`) || label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function ProgressRail({ step, t = makeTranslator("en") }) {
  const steps = t("checkin.progress");
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

function NeedBadges({ needs, lang = "en" }) {
  return (
    <div className="flex flex-wrap gap-2">
      {needs.map((need) => (
        <span key={need} className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-950">
          {localizeNeed(need, lang)}
        </span>
      ))}
    </div>
  );
}

function CheckInBreadcrumb({ audience, mode, situation, bodySignals, activePath, needs, lang = "en", t = makeTranslator("en") }) {
  const label = t("checkin.breadcrumb");
  const items = [
    [label.who, audience?.label],
    [label.mode, mode?.label],
    [label.event, situation?.label],
    [label.body, bodySignals?.map((item) => item.label).join(", ")],
    [label.feeling, activePath?.specific ? `${localizeEmotion(activePath.core, lang)} / ${activePath.sub} / ${activePath.specific}` : ""],
    [label.needs, needs?.length ? localizeNeeds(needs.slice(0, 4), lang).join(", ") : ""],
  ].filter(([, value]) => value);

  if (!items.length) return null;

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3">
      <div className="text-xs font-black uppercase tracking-wide text-stone-500">{label.currentPath}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map(([label, value]) => (
          <span key={label} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-800">
            <strong>{label}:</strong> {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function Intro({ setTab, t }) {
  const steps = t("intro.steps");
  const taglines = t("intro.tags");
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 md:p-6">
        <h2 className="text-2xl font-black tracking-normal text-emerald-950 md:text-4xl">{t("intro.title")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-950 md:text-base">
          {t("intro.copy")}
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button variant="primary" onClick={() => setTab("checkin")}>
            <PlayCircle size={16} />
            {t("intro.start")}
          </Button>
          <Button variant="secondary" onClick={() => setTab("shadows")}>
            <BookOpen size={16} />
            {t("intro.shadowFinder")}
          </Button>
          <Button variant="amber" onClick={() => setTab("reset")}>
            <Activity size={16} />
            {t("intro.reset")}
          </Button>
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" onClick={() => setTab("help")}>
            <HelpCircle size={16} />
            {t("intro.help")}
          </Button>
        </div>
        <SupportActions className="mt-4" t={t} />
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
          title={t("intro.howTitle")}
          copy={t("intro.howCopy")}
        />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {steps.map(([title, copy], index) => (
            <div key={title} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-sm font-black text-white">
                  {index + 1}
                </span>
                <div className="text-sm font-black text-stone-950">{title}</div>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-700">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 md:p-5">
        <div className="text-sm font-black text-stone-950">{t("intro.bestTitle")}</div>
        <p className="mt-2 text-sm leading-6 text-stone-700">
          {t("intro.bestCopy")}
        </p>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-4 md:p-5">
        <SectionTitle
          title={t("intro.helpsTitle")}
          copy={t("intro.helpsCopy")}
        />
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {t("intro.helps").map((item) => (
            <div key={item} className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm font-semibold text-stone-800">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function EmergencyReset({ setTab }) {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-950">
          <Activity size={16} />
          Emergency reset
        </div>
        <h2 className="mt-2 text-2xl font-black text-emerald-950 md:text-3xl">Before you speak, reset the signal.</h2>
        <p className="mt-3 text-sm leading-6 text-emerald-950">
          Use this when you are hot, numb, spiraling, defending, blaming, explaining, or about to say something that will create more repair work.
        </p>
      </section>
      <div className="grid gap-3">
        {EMERGENCY_RESET_STEPS.map((step, index) => (
          <div key={step} className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-sm font-black text-white">
                {index + 1}
              </span>
              <p className="text-sm leading-6 text-stone-700">{step}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button variant="primary" onClick={() => setTab("checkin")}>
          <ArrowRight size={16} />
          Continue to check-in
        </Button>
        <Button variant="secondary" onClick={() => setTab("scripts")}>
          <MessageSquareText size={16} />
          Get words to say
        </Button>
      </div>
      <SupportActions />
    </div>
  );
}

function TransformationPaths({ setTab }) {
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <SectionTitle
        title="Transformation Paths"
        copy="Choose the growth pattern you want to work. Each path turns emotional intelligence into a practice, not just a label."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {TRANSFORMATION_PATHS.map((path) => (
          <article key={path.id} className="rounded-lg border border-stone-200 bg-white p-4">
            <h3 className="text-lg font-black text-stone-950">{path.title}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-700"><strong>For:</strong> {path.audience}</p>
            <p className="mt-2 text-sm leading-6 text-stone-700"><strong>Trigger:</strong> {path.trigger}</p>
            <p className="mt-2 text-sm leading-6 text-stone-700"><strong>Need:</strong> {path.need}</p>
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <div className="text-sm font-black text-emerald-950">Practice</div>
              <p className="mt-1 text-sm leading-6 text-emerald-950">{path.practice}</p>
            </div>
            <div className="mt-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="text-sm font-black text-stone-950">Track this</div>
              <p className="mt-1 text-sm leading-6 text-stone-700">{path.metric}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button variant="primary" onClick={() => setTab("checkin")}>
          <PlayCircle size={16} />
          Start with a check-in
        </Button>
        <Button variant="secondary" onClick={() => setTab("tracker")}>
          <Search size={16} />
          View pattern tracker
        </Button>
      </div>
    </div>
  );
}

function GuidedCheckIn({ rows, saveReport, setTab, lang = "en", t = makeTranslator("en") }) {
  const [step, setStep] = useState(0);
  const [audience, setAudience] = useState("man");
  const [modeId, setModeId] = useState("quick");
  const [situationId, setSituationId] = useState(SITUATIONS[0].id);
  const [bodyIds, setBodyIds] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedShadowId, setSelectedShadowId] = useState(null);

  const maxStep = 6;
  const modeRaw = CHECKIN_MODES.find((item) => item.id === modeId) || CHECKIN_MODES[0];
  const mode = localizeEntity("modes", modeRaw, lang);
  const audienceRaw = AUDIENCES.find((item) => item.id === audience) || AUDIENCES[0];
  const audienceData = localizeEntity("audiences", audienceRaw, lang);
  const situationOptions = SITUATIONS.filter((item) => mode.situationIds.includes(item.id));
  const situationRaw = SITUATIONS.find((item) => item.id === situationId) || SITUATIONS[0];
  const situation = localizeEntity("situations", situationRaw, lang);
  const selectedBody = BODY_SIGNALS.filter((item) => bodyIds.includes(item.id)).map((item) => localizeBodySignal(item, lang));

  const suggestions = useMemo(() => {
    const emotionScores = new Map();
    situationRaw.emotions.forEach((emotion, idx) => emotionScores.set(emotion, 5 - idx));
    selectedBody.forEach((signal) =>
      signal.emotions.forEach((emotion) => emotionScores.set(emotion, (emotionScores.get(emotion) || 0) + 3))
    );
    const scored = rows
      .map((row) => ({
        ...row,
        score:
          (emotionScores.get(row.core) || 0) +
          row.needs.reduce((score, need) => score + (situationRaw.needs.includes(need) ? 2 : 0), 0),
      }))
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score || a.specific.localeCompare(b.specific));
    const unique = new Map();
    scored.forEach((row) => {
      const key = row.specific.toLowerCase();
      if (!unique.has(key)) unique.set(key, row);
    });
    return Array.from(unique.values()).slice(0, 8);
  }, [rows, selectedBody, situationRaw]);

  const activePath = selectedPath || suggestions[0] || rows[0];
  const inferredNeeds = useMemo(() => {
    const all = new Set([...(activePath?.needs || []), ...situationRaw.needs]);
    selectedBody.forEach((signal) => signal.needs.forEach((need) => all.add(need)));
    return Array.from(all).slice(0, 7);
  }, [activePath, selectedBody, situationRaw]);

  const uiNeeds = localizeNeeds(inferredNeeds, lang);

  const scriptContext = {
    emotion: activePath?.specific || activePath?.sub || activePath?.core,
    needs: uiNeeds,
    situation: situation.label,
    audience: audienceData.label,
    mode: mode.label,
  };
  const resultScripts = buildLocalizedScripts({ ...scriptContext, lang });
  const primaryScript = resultScripts[0].text;
  const guidedPrompt = localizedGuidanceFor({ ...activePath, needs: inferredNeeds }, lang);
  const audienceCopy = lang === "es" ? ES_AUDIENCE_MINDSET[audience] : {
    man: "This is not about being soft. It is about reading the signal before it drives your next move.",
    woman: "This is about naming the signal, honoring your body, and choosing clear action without self-abandonment.",
    "teen-boy": "You do not have to explain it perfectly. Pick the closest answer and keep going.",
    "teen-girl": "You do not need the perfect words. Pick what fits and let the tool help you name the need.",
    father: "Lead without control. Your calm clarity teaches more than pressure does.",
    mother: "Care without carrying everything. The goal is truth, boundaries, and repair.",
    coach: "Guide with curiosity. The goal is to help them name the signal without cornering them.",
    partner: "Stay close to impact, need, and repair. Do not turn the conversation into a trial.",
  }[audience];
  const actionFrame = buildActionFrame({ activePath, audienceLabel: audienceData.label, modeLens: mode.lens, needs: uiNeeds, lang });
  const relevantShadows = useMemo(
    () =>
      getRelevantShadows({
        core: activePath?.core,
        needs: inferredNeeds,
        bodyLabels: selectedBody.map((item) => item.label),
        situationLabel: situationRaw.label,
      }),
    [activePath?.core, inferredNeeds, selectedBody, situationRaw.label]
  );
  const selectedShadow = relevantShadows.find((shadow) => shadow.id === selectedShadowId) || relevantShadows[0];

  const toggleBody = (id) => {
    setBodyIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const report = {
    id: makeReportId(),
    source: lang === "es" ? "Check In Guiado" : "Guided Check In",
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
  const shareCardText = buildShareCardText(report, lang);

  const saveCurrentReport = () => {
    saveReport(report);
    showToast(t("checkin.saved"));
  };

  const summary = [
    `${t("checkin.labels.situation")}: ${situation.label}`,
    `${t("checkin.breadcrumb.who")}: ${audienceData.label}`,
    `${t("checkin.breadcrumb.mode")}: ${mode.label}`,
    `${t("checkin.labels.bodySignals")}: ${selectedBody.map((item) => item.label).join(", ") || t("checkin.labels.notSelected")}`,
    `${t("checkin.labels.likelyEmotion")}: ${localizeEmotion(activePath.core, lang)} / ${activePath.sub} / ${activePath.specific}`,
    `${t("checkin.labels.unmetNeeds")}: ${uiNeeds.join(", ")}`,
    "",
    `${t("checkin.labels.frame")}:`,
    actionFrame,
    "",
    `${t("checkin.labels.mindset")}:`,
    audienceCopy,
    "",
    `${t("checkin.labels.likelyShadows")}:`,
    ...relevantShadows.map((shadow) => `- ${shadow.label}: ${shadow.move} ${t("checkin.labels.practice")}: ${shadow.practice}`),
    "",
    `${t("checkin.labels.actionPlan")}:`,
    ...localizedCorrectiveActions(lang).map((item) => `- ${item.title}: ${item.copy}`),
    "",
    `${t("checkin.labels.nextMove")}:`,
    primaryScript,
    "",
    `${t("checkin.labels.guidedNextStep")}:`,
    guidedPrompt,
    "",
    ATTR_LINE,
  ].join("\n");

  return (
    <div className="mx-auto grid min-w-0 max-w-3xl gap-4 overflow-hidden">
      <ProgressRail step={step} t={t} />
      <CheckInBreadcrumb
        audience={audienceData}
        mode={mode}
        situation={step >= 2 ? situation : null}
        bodySignals={step >= 3 ? selectedBody : []}
        activePath={step >= 4 ? activePath : null}
        needs={step >= 5 ? inferredNeeds : []}
        lang={lang}
        t={t}
      />

      <section className="min-w-0 max-w-full overflow-hidden rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-6">
        {step === 0 && (
          <div className="space-y-5">
            <SectionTitle
              title={t("checkin.steps.whoTitle")}
              copy={t("checkin.steps.whoCopy")}
            />
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="text-sm font-black text-stone-950">{t("checkin.steps.howTitle")}</div>
              <div className="mt-3 grid gap-2">
                {t("checkin.guidance").map((item, index) => (
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
              {AUDIENCES.map((item) => {
                const view = localizeEntity("audiences", item, lang);
                return (
                <Chip key={item.id} active={audience === item.id} onClick={() => setAudience(item.id)}>
                  <span className="block">{view.label}</span>
                  <span className={cls("mt-1 block text-xs font-medium", audience === item.id ? "text-stone-300" : "text-stone-500")}>
                    {view.description}
                  </span>
                </Chip>
              )})}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <SectionTitle
              title={t("checkin.steps.modeTitle")}
              copy={t("checkin.steps.modeCopy")}
            />
            <div className="grid min-w-0 gap-2">
              {CHECKIN_MODES.map((item) => {
                const view = localizeEntity("modes", item, lang);
                return (
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
                  <span className="block">{view.label}</span>
                  <span className={cls("mt-1 block text-xs font-medium", modeId === item.id ? "text-stone-300" : "text-stone-500")}>
                    {view.description}
                  </span>
                </Chip>
              )})}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <SectionTitle
              title={t("checkin.steps.eventTitle")}
              copy={t("checkin.steps.eventCopy")}
            />
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              {situationOptions.map((item) => {
                const view = localizeEntity("situations", item, lang);
                return (
                <Chip key={item.id} active={situationId === item.id} onClick={() => { setSituationId(item.id); setSelectedPath(null); setSelectedShadowId(null); }}>
                  <span className="block">{view.label}</span>
                  <span className={cls("mt-1 block text-xs font-medium", situationId === item.id ? "text-stone-300" : "text-stone-500")}>
                    {view.hint}
                  </span>
                </Chip>
              )})}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <SectionTitle
              title={t("checkin.steps.bodyTitle")}
              copy={t("checkin.steps.bodyCopy")}
            />
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              {BODY_SIGNALS.map((item) => {
                const view = localizeBodySignal(item, lang);
                return (
                <Chip key={item.id} active={bodyIds.includes(item.id)} onClick={() => toggleBody(item.id)}>
                  {view.label}
                </Chip>
              )})}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <SectionTitle
              title={t("checkin.steps.feelingTitle")}
              copy={t("checkin.steps.feelingCopy")}
            />
            <NeedPillHelp t={t} />
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
                          {localizeEmotion(row.core, lang)} / {row.sub}
                        </div>
                      </div>
                      <NeedBadges needs={row.needs.slice(0, 3)} lang={lang} />
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
              title={t("checkin.steps.needTitle")}
              copy={t("checkin.steps.needCopy")}
            />
            <NeedPillHelp t={t} />
            <NeedBadges needs={inferredNeeds} lang={lang} />
            <div className="grid gap-2">
              {inferredNeeds.slice(0, 6).map((need) => (
                <div key={need} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
                  <div className="text-sm font-black capitalize text-stone-950">{localizeNeed(need, lang)}</div>
                  <div className="mt-1 text-sm leading-6 text-stone-600">
                    {localizeNeedExplainer(need, lang) || t("checkin.fallbackNeed")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-5">
            <SectionTitle
              title={t("checkin.steps.reportTitle")}
              copy={t("checkin.steps.reportCopy")}
            />
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-950">
                <Trophy size={16} />
                {t("checkin.labels.frame")}
              </div>
              <p className="mt-3 text-lg font-semibold leading-8 text-emerald-950">{actionFrame}</p>
            </div>
            {relevantShadows.length ? (
              <div className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="text-sm font-black text-stone-950">{t("checkin.labels.commonShadows")}</div>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  {t("checkin.labels.commonShadowsCopy")}
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
                      <strong>{t("checkin.labels.pattern")}:</strong> {selectedShadow.tactic}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-700">
                      <strong>{t("checkin.labels.horsemen")}:</strong> {selectedShadow.horseman}
                    </p>
                    {selectedShadow.wound ? (
                      <p className="mt-2 text-sm leading-6 text-stone-700">
                        <strong>{t("checkin.labels.coreWound")}:</strong> {selectedShadow.wound}
                      </p>
                    ) : null}
                    {selectedShadow.need ? (
                      <p className="mt-2 text-sm leading-6 text-stone-700">
                        <strong>{t("checkin.labels.healingNeed")}:</strong> {selectedShadow.need}
                      </p>
                    ) : null}
                    {selectedShadow.practice ? (
                      <p className="mt-2 text-sm leading-6 text-stone-700">
                        <strong>{t("checkin.labels.practice")}:</strong> {selectedShadow.practice}
                      </p>
                    ) : null}
                    {selectedShadow.repair ? (
                      <p className="mt-2 text-sm leading-6 text-stone-700">
                        <strong>{t("checkin.labels.repair")}:</strong> {selectedShadow.repair}
                      </p>
                    ) : null}
                    <p className="mt-2 text-sm leading-6 text-stone-700">
                      <strong>{t("checkin.labels.bestMove")}:</strong> {selectedShadow.move}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="text-sm font-black text-stone-950">{t("checkin.labels.doNow")}</div>
                <ol className="mt-3 space-y-3 text-sm leading-6 text-stone-700">
                  <li><strong>1. {t("checkin.labels.settle")}:</strong> {t("checkin.actions.settle")}</li>
                  <li><strong>2. {t("checkin.labels.name")}:</strong> {t("checkin.actions.name")} {localizeNeed(inferredNeeds[0] || "clarity", lang)}.</li>
                  <li><strong>3. {t("checkin.labels.ask")}:</strong> {t("checkin.actions.ask")}</li>
                </ol>
              </div>
              <div className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="text-sm font-black text-stone-950">{t("checkin.labels.avoidNow")}</div>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-stone-700">
                  <li>{t("checkin.actions.avoidHistory")}</li>
                  <li>{t("checkin.actions.avoidSilence")}</li>
                  <li>{t("checkin.actions.avoidMindReading")}</li>
                </ul>
              </div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="text-sm font-black text-stone-950">{t("checkin.labels.scripts")}</div>
              <p className="mt-1 text-sm leading-6 text-stone-700">
                {t("checkin.labels.scriptsCopy")}
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
                      {t("checkin.buttons.copyScript")}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <details className="rounded-lg border border-stone-200 bg-white p-4">
              <summary className="cursor-pointer text-sm font-black text-stone-950">{t("checkin.labels.deeper")}</summary>
              <p className="mt-2 text-sm leading-6 text-stone-700">{guidedPrompt}</p>
            </details>
            <div className="rounded-lg border border-stone-200 bg-white p-4">
              <div className="text-sm font-black text-stone-950">{t("checkin.labels.shareable")}</div>
              <p className="mt-1 text-sm leading-6 text-stone-700">
                {t("checkin.labels.shareableCopy")}
              </p>
              <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm leading-6 text-stone-800">{shareCardText}</pre>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Button variant="amber" onClick={() => copyText(shareCardText)}>
                  <Clipboard size={16} />
                  {t("checkin.buttons.copyShareCard")}
                </Button>
                <Button variant="secondary" onClick={() => shareText("Exploring Needs insight", shareCardText)}>
                  <ArrowRight size={16} />
                  {t("checkin.buttons.shareInsight")}
                </Button>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <Button variant="amber" onClick={() => copyText(summary)}>
                <Clipboard size={16} />
                {t("checkin.buttons.copy")}
              </Button>
              <Button variant="secondary" onClick={saveCurrentReport}>
                <Save size={16} />
                {t("checkin.buttons.saveReport")}
              </Button>
              <Button variant="secondary" onClick={() => { saveCurrentReport(); setTab("reports"); }}>
                {t("checkin.buttons.viewReports")}
                <ArrowRight size={16} />
              </Button>
            </div>
            <SupportActions t={t} />
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>
            <ArrowLeft size={16} />
            {t("checkin.buttons.back")}
          </Button>
          <Button variant="primary" disabled={step === maxStep} onClick={() => setStep((value) => Math.min(maxStep, value + 1))}>
            {t("checkin.buttons.next")}
            <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </div>
  );
}

function Explore({ rows, saveReport, setTab }) {
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
  const signalGuidance = guidanceFor({ core, sub, specific, needs });
  const signalShadows = getRelevantShadows({ core, needs, bodyLabels: [], situationLabel: "Feelings Library" });
  const signalScripts = SCRIPT_TYPES.map((script) =>
    script.build({ emotion: specific, needs, situation: "Feelings Library", audience: "person", mode: "Feelings Library" })
  );
  const libraryReport = {
    id: makeReportId(),
    source: "Feelings Library",
    core,
    sub,
    specific,
    needs,
    situation: "Feelings Library",
    bodySignals: [],
    frame: `You are noticing ${specific.toLowerCase()}. The needs underneath may include ${needs.join(", ")}. Use that signal to make one clean request or choose one recovery action.`,
    scripts: signalScripts,
    shadows: signalShadows,
    guidance: signalGuidance,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <SectionTitle title="Feelings Library" copy="Browse feelings directly or search by emotion, need, or situation. Use the right panel to understand what a selected signal may be asking for." />
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
                <div className="mt-2 text-xs font-semibold text-stone-500">Pills show likely unmet needs.</div>
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
        <div className="text-sm font-black">Signal guide</div>
        <div className="mt-2 text-2xl font-black">{specific}</div>
        <div className="text-sm text-stone-500">{core} / {sub}</div>
        <div className="mt-4"><NeedBadges needs={needs} /></div>
        <div className="mt-3"><NeedPillHelp compact /></div>
        <div className="mt-4 rounded-lg border border-stone-200 bg-white p-3">
          <div className="text-sm font-black">What this may mean</div>
          <p className="mt-1 text-sm leading-6 text-stone-700">
            This signal may be pointing toward {needs.slice(0, 3).join(", ") || "clarity"}. Treat the word as a working hypothesis, then test it against your body and the situation.
          </p>
        </div>
        <div className="mt-4 rounded-lg border border-stone-200 bg-white p-3">
          <div className="text-sm font-black">Needs to explore</div>
          <div className="mt-2 grid gap-2">
            {needs.slice(0, 4).map((need) => (
              <div key={need} className="text-sm leading-6 text-stone-700">
                <strong className="capitalize text-stone-950">{need}:</strong>{" "}
                {NEED_EXPLAINERS[need] || "Something important may need to be named, protected, requested, or repaired."}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-stone-200 bg-white p-3">
          <div className="text-sm font-black">Next step</div>
          <p className="mt-1 text-sm leading-6 text-stone-700">{signalGuidance}</p>
        </div>
        {signalShadows.length ? (
          <div className="mt-4 rounded-lg border border-stone-200 bg-white p-3">
            <div className="text-sm font-black">Shadow to watch</div>
            <p className="mt-1 text-sm leading-6 text-stone-700">
              <strong>{signalShadows[0].label}:</strong> {signalShadows[0].move}
            </p>
          </div>
        ) : null}
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="text-sm font-black text-stone-950">Try these words</div>
          <p className="mt-1 text-sm leading-6 text-stone-800">{signalScripts[0]}</p>
        </div>
        <div className="mt-4 grid gap-2">
          <Button variant="amber" onClick={() => copyText(payload)}><Clipboard size={16} />Copy</Button>
          <Button
            variant="secondary"
            onClick={() => {
              saveReport(libraryReport);
              showToast("Learning note saved to this browser");
            }}
          >
            <Save size={16} />Save learning note
          </Button>
          <Button variant="secondary" onClick={() => setTab("checkin")}>
            <ArrowRight size={16} />Use in check-in
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
      <SupportActions />
    </div>
  );
}

function Reports({ reports }) {
  const [selectedId, setSelectedId] = useState(reports[0]?.id || "");
  const report = reports.find((item) => item.id === selectedId) || reports[0];
  useEffect(() => {
    if (reports[0]?.id && !reports.some((item) => item.id === selectedId)) {
      setSelectedId(reports[0].id);
    }
  }, [reports, selectedId]);
  const growthPlan = buildGrowthPlan(report);
  const shareCardText = buildShareCardText(report);
  const payload = report
    ? [
        `${APP_TITLE} check-in report`,
        "",
        `Saved: ${formatReportDate(report.createdAt)}`,
        `Source: ${report.source || "Guided Check In"}`,
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
        "Growth plan:",
        `Today: ${growthPlan.today}`,
        `Next 24 hours: ${growthPlan.next24}`,
        `7-day practice: ${growthPlan.week}`,
        `Integration metric: ${growthPlan.integration}`,
        "",
        ATTR_LINE,
      ].join("\n")
    : "";

  if (!report) {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border border-stone-200 bg-white p-6">
        <SectionTitle
          title="Reports"
          copy="Reports are saved in this browser only. Without a login or account, they can persist on this device through local storage, but they will not follow you to another browser or device."
        />
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-stone-700">
          Run a Check In or save a Feelings Library learning note to create your first report.
        </div>
        <SupportActions className="mt-4" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <SectionTitle
        title="Reports"
        copy="Saved history for this browser. Use reports to track patterns over time, return to useful scripts, and prepare for repair conversations."
      />
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-stone-700">
        Reports persist only in this browser using local storage. No account means no cross-device sync, no cloud backup, and no recovery if browser data is cleared.
      </div>
      {reports.length > 1 ? (
        <div className="grid gap-2">
          {reports.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={cls(
                "rounded-lg border p-3 text-left text-sm transition",
                report.id === item.id ? "border-emerald-800 bg-emerald-800 text-white" : "border-stone-200 bg-white text-stone-800 hover:border-stone-400"
              )}
            >
              <div className="font-black">{item.specific || "Saved report"}</div>
              <div className={cls("mt-1 text-xs font-semibold", report.id === item.id ? "text-stone-200" : "text-stone-500")}>
                {formatReportDate(item.createdAt)} | {item.source || "Guided Check In"} | {item.situation}
              </div>
            </button>
          ))}
        </div>
      ) : null}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-950">
          <Trophy size={16} />
          Frame
        </div>
        <div className="mt-2 text-xs font-black uppercase tracking-wide text-emerald-950">
          Saved {formatReportDate(report.createdAt)} | {report.source || "Guided Check In"}
        </div>
        <p className="mt-3 text-lg font-semibold leading-8 text-emerald-950">{report.frame}</p>
      </div>
      <div className="rounded-lg border border-stone-200 bg-white p-4">
        <div className="text-sm font-black text-stone-950">Shareable insight</div>
        <p className="mt-2 text-sm leading-6 text-stone-700">
          A short, non-private version of the report that can invite someone else into the tool without exposing the full story.
        </p>
        <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm leading-6 text-stone-800">{shareCardText}</pre>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Button variant="amber" onClick={() => copyText(shareCardText)}>
            <Clipboard size={16} />
            Copy share card
          </Button>
          <Button variant="secondary" onClick={() => shareText("Exploring Needs insight", shareCardText)}>
            <ArrowRight size={16} />
            Share insight
          </Button>
        </div>
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
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="text-sm font-black text-emerald-950">Growth plan</div>
        <div className="mt-3 grid gap-3">
          <div className="rounded-lg border border-emerald-200 bg-white p-3">
            <div className="text-sm font-black text-stone-950">Today</div>
            <p className="mt-1 text-sm leading-6 text-stone-700">{growthPlan.today}</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-white p-3">
            <div className="text-sm font-black text-stone-950">Next 24 hours</div>
            <p className="mt-1 text-sm leading-6 text-stone-700">{growthPlan.next24}</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-white p-3">
            <div className="text-sm font-black text-stone-950">7-day practice</div>
            <p className="mt-1 text-sm leading-6 text-stone-700">{growthPlan.week}</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-white p-3">
            <div className="text-sm font-black text-stone-950">Integration metric</div>
            <p className="mt-1 text-sm leading-6 text-stone-700">{growthPlan.integration}</p>
          </div>
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
        <Button variant="secondary" onClick={() => shareText("Exploring Needs Report", payload)}>
          <ArrowRight size={16} />Share report
        </Button>
        <Button variant="secondary" onClick={() => copyText(`${report.frame}\n\n${ATTR_LINE}`)}>
          <Clipboard size={16} />Copy frame
        </Button>
      </div>
      <SupportActions />
    </div>
  );
}

function ShadowLibrary() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [selectedId, setSelectedId] = useState(SHADOW_PATTERNS[0].id);
  const enriched = SHADOW_PATTERNS.map(enrichShadow);
  const finderPrompts = [
    {
      label: "I need to win or control it",
      category: "power",
      shadowId: "control",
      copy: "Start with power patterns: control, attack, entitlement, grandiosity, and scorekeeping.",
    },
    {
      label: "I shut down or disappear",
      category: "avoidance",
      shadowId: "withdrawal",
      copy: "Start with avoidance patterns: withdrawal, numbing, perfectionism, and hyper-independence.",
    },
    {
      label: "I defend, explain, or reverse blame",
      category: "accountability",
      shadowId: "darvo",
      copy: "Start with accountability distortions: DARVO, JADE, projection, and shame collapse.",
    },
    {
      label: "I over-give or abandon myself",
      category: "codependent",
      shadowId: "rescue",
      copy: "Start with codependent survival: rescue, approval seeking, compliance, and JADE.",
    },
  ];
  const category = SHADOW_CATEGORIES.find((item) => item.id === categoryId) || SHADOW_CATEGORIES[0];
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = enriched.filter((shadow) => {
    const inCategory = category.id === "all" || category.shadowIds.includes(shadow.id);
    const haystack = [
      shadow.label,
      shadow.signal,
      shadow.tactic,
      shadow.horseman,
      shadow.move,
      shadow.wound,
      shadow.need,
      shadow.practice,
      shadow.repair,
      shadow.doNot,
    ].join(" ").toLowerCase();
    return inCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
  });
  const selectedShadow =
    filtered.find((shadow) => shadow.id === selectedId) ||
    enriched.find((shadow) => shadow.id === selectedId) ||
    filtered[0] ||
    enriched[0];
  const repairSteps = selectedShadow
    ? [
        ["1. Notice the signal", selectedShadow.signal],
        ["2. Name the hidden need", selectedShadow.need],
        ["3. Interrupt the pattern", selectedShadow.practice],
        ["4. Repair with words", selectedShadow.repair],
        ["5. Guard the boundary", selectedShadow.doNot],
      ]
    : [];

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <SectionTitle
        title="Shadow Work Library"
        copy="Search by pattern, tactic, wound, need, or repair move. Pick one shadow and work the repair path one step at a time."
      />

      <div className="rounded-lg border border-stone-200 bg-white p-3">
        <label className="text-sm font-black text-stone-950" htmlFor="shadow-search">Find a shadow pattern</label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-3 text-stone-400" size={18} />
          <input
            id="shadow-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search control, DARVO, shame, attack, repair..."
            className="h-11 w-full rounded-lg border border-stone-200 bg-white pl-10 pr-3 text-sm text-stone-950 outline-none focus:border-emerald-800"
          />
        </div>
      </div>

      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="text-sm font-black text-emerald-950">What is running me right now?</div>
        <p className="mt-1 text-sm leading-6 text-emerald-950">
          Pick the closest pattern. This jumps you to the most likely shadow category and repair path.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {finderPrompts.map((prompt) => (
            <button
              key={prompt.label}
              onClick={() => {
                setCategoryId(prompt.category);
                setSelectedId(prompt.shadowId);
                setQuery("");
              }}
              className="rounded-lg border border-emerald-200 bg-white p-3 text-left transition hover:border-emerald-800"
            >
              <div className="text-sm font-black text-stone-950">{prompt.label}</div>
              <div className="mt-1 text-sm leading-6 text-stone-700">{prompt.copy}</div>
            </button>
          ))}
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {SHADOW_CATEGORIES.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setCategoryId(item.id);
              const first = enriched.find((shadow) => item.id === "all" || item.shadowIds.includes(shadow.id));
              if (first) setSelectedId(first.id);
            }}
            className={cls(
              "min-h-11 shrink-0 rounded-lg border px-3 text-left text-sm font-bold transition",
              categoryId === item.id ? "border-emerald-800 bg-emerald-800 text-white" : "border-stone-200 bg-white text-stone-800 hover:border-stone-400"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-stone-700">
        <strong>{category.label}:</strong> {category.description}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <aside className="space-y-2">
          <div className="text-xs font-black uppercase tracking-wide text-stone-500">{filtered.length} patterns</div>
          {filtered.map((shadow) => (
            <button
              key={shadow.id}
              onClick={() => setSelectedId(shadow.id)}
              className={cls(
                "w-full rounded-lg border p-3 text-left transition",
                selectedShadow?.id === shadow.id ? "border-emerald-800 bg-emerald-800 text-white" : "border-stone-200 bg-white text-stone-800 hover:border-stone-400"
              )}
            >
              <div className="text-sm font-black">{shadow.label}</div>
              <div className={cls("mt-1 line-clamp-2 text-xs leading-5", selectedShadow?.id === shadow.id ? "text-stone-100" : "text-stone-500")}>
                {shadow.tactic}
              </div>
            </button>
          ))}
          {!filtered.length ? (
            <div className="rounded-lg border border-stone-200 bg-white p-4 text-sm leading-6 text-stone-700">
              No shadow patterns match that search. Try control, shame, repair, JADE, or shutdown.
            </div>
          ) : null}
        </aside>

        {selectedShadow ? (
          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-2xl font-black text-stone-950">{selectedShadow.label}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-700">{selectedShadow.signal}</p>
              </div>
              <Button variant="secondary" onClick={() => copyText(`${selectedShadow.label}\n${selectedShadow.repair}\n\n${ATTR_LINE}`)}>
                <Clipboard size={16} />
                Copy repair
              </Button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
                <div className="text-sm font-black text-stone-950">Core wound</div>
                <p className="mt-1 text-sm leading-6 text-stone-700">{selectedShadow.wound}</p>
              </div>
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
                <div className="text-sm font-black text-stone-950">Common pattern</div>
                <p className="mt-1 text-sm leading-6 text-stone-700">{selectedShadow.tactic}</p>
              </div>
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
                <div className="text-sm font-black text-stone-950">Four Horsemen link</div>
                <p className="mt-1 text-sm leading-6 text-stone-700">{selectedShadow.horseman}</p>
              </div>
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
                <div className="text-sm font-black text-stone-950">Hidden need</div>
                <p className="mt-1 text-sm leading-6 text-stone-700">{selectedShadow.need}</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-sm font-black text-emerald-950">Practical repair path</div>
              <div className="mt-3 grid gap-2">
                {repairSteps.map(([label, copy]) => (
                  <div key={label} className="rounded-lg border border-emerald-200 bg-white p-3">
                    <div className="text-sm font-black text-stone-950">{label}</div>
                    <p className="mt-1 text-sm leading-6 text-stone-700">{copy}</p>
                  </div>
                ))}
              </div>
            </div>

            <SupportActions className="mt-4" />
          </section>
        ) : null}
      </div>
    </div>
  );
}

function PatternTracker({ reports, setTab }) {
  const needCounts = countValues(reports.flatMap((report) => report.needs || []));
  const shadowCounts = countValues(reports.flatMap((report) => (report.shadows || []).map((shadow) => shadow.label)));
  const situationCounts = countValues(reports.map((report) => report.situation));
  const feelingCounts = countValues(reports.map((report) => report.specific));
  const latest = reports[0];

  if (!reports.length) {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border border-stone-200 bg-white p-6">
        <SectionTitle
          title="Pattern Tracker"
          copy="Save reports from Check In or the Feelings Library to reveal recurring needs, emotions, situations, and shadow patterns."
        />
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-stone-700">
          No saved reports yet. Run two or three check-ins this week and the tracker will begin showing the patterns that need the most attention.
        </div>
        <Button className="mt-4" variant="primary" onClick={() => setTab("checkin")}>
          <PlayCircle size={16} />
          Start first check-in
        </Button>
      </div>
    );
  }

  const sections = [
    ["Recurring needs", needCounts],
    ["Recurring shadows", shadowCounts],
    ["Recurring situations", situationCounts],
    ["Recurring feelings", feelingCounts],
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <SectionTitle
        title="Pattern Tracker"
        copy="This turns saved reports into a growth map. Look for repeated needs, repeated shadows, and repeated situations that are asking for practice."
      />
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="text-sm font-black text-emerald-950">Current focus</div>
        <p className="mt-2 text-sm leading-6 text-emerald-950">
          Your strongest current signal is {needCounts[0]?.label || "clarity"} with {shadowCounts[0]?.label || "no repeated shadow yet"}. Use the next check-in to test whether this pattern repeats in your body and behavior.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {sections.map(([title, rows]) => (
          <section key={title} className="rounded-lg border border-stone-200 bg-white p-4">
            <h3 className="text-base font-black text-stone-950">{title}</h3>
            <div className="mt-3 grid gap-2">
              {rows.slice(0, 6).map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
                  <span className="text-sm font-semibold text-stone-800">{row.label}</span>
                  <span className="rounded-full bg-emerald-800 px-3 py-1 text-xs font-black text-white">{row.count}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      {latest ? (
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="text-sm font-black text-stone-950">Latest practice plan</div>
          <p className="mt-2 text-sm leading-6 text-stone-700">{buildGrowthPlan(latest).week}</p>
        </div>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-3">
        <Button variant="primary" onClick={() => setTab("checkin")}>
          <PlayCircle size={16} />
          Add check-in
        </Button>
        <Button variant="secondary" onClick={() => setTab("reports")}>
          <Sparkles size={16} />
          Review reports
        </Button>
        <Button variant="secondary" onClick={() => setTab("paths")}>
          <Trophy size={16} />
          Choose path
        </Button>
      </div>
    </div>
  );
}

function HelpWiki({ setTab }) {
  const topics = [
    {
      title: "What this is",
      body: "This is a guided emotional intelligence tool, unmet needs explorer, shadow work app, relationship repair guide, and pattern tracker. It helps you move from a charged feeling into the unmet need, shadow pattern, repair language, and practical next action.",
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
      body: "Read the frame first. Then choose one corrective action, one script, one shadow pattern to watch, and one growth plan practice. Copy or share the report when it helps you stay clear in a conversation.",
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
    {
      title: "Why pattern tracking matters",
      body: "One check-in gives clarity. Repeated reports show the transformation path: recurring needs, recurring shadows, repeated triggers, and the practices that actually change behavior.",
    },
  ];

  const quickLinks = [
    { label: "Run a check-in", tab: "checkin" },
    { label: "Emergency reset", tab: "reset" },
    { label: "Read reports", tab: "reports" },
    { label: "Track patterns", tab: "tracker" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <SectionTitle
        title="Help Wiki"
        copy="A practical guide to the concepts inside the tool and how to use it without getting lost."
      />

      <div className="grid gap-2 sm:grid-cols-5">
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
      <SupportActions />
    </div>
  );
}

export default function App() {
  const rows = useMemo(() => toRows(), []);
  const [tab, setTab] = useState("intro");
  const [checkInKey, setCheckInKey] = useState(0);
  const [themeId, setThemeId] = useState("sage");
  const [lang, setLang] = useState(() => {
    try {
      return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";
    } catch {
      return "en";
    }
  });
  const [reports, setReports] = useState(() => {
    try {
      const stored = window.localStorage.getItem(REPORTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const latestReport = reports[0] || null;
  const t = useMemo(() => makeTranslator(lang), [lang]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // Local storage can be unavailable in private or restricted browser modes.
    }
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    try {
      window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
    } catch {
      // Local storage can be unavailable in private or restricted browser modes.
    }
  }, [reports]);

  const saveReport = (report) => {
    const entry = {
      ...report,
      id: report.id || makeReportId(),
      createdAt: report.createdAt || new Date().toISOString(),
    };
    setReports((prev) => [entry, ...prev].slice(0, 25));
  };

  const startNewCheckIn = () => {
    setTab("checkin");
    setCheckInKey((value) => value + 1);
  };

  return (
    <AppShell
      tab={tab}
      setTab={setTab}
      onNewCheckIn={startNewCheckIn}
      themeId={themeId}
      setThemeId={setThemeId}
      lang={lang}
      setLang={setLang}
      t={t}
    >
      {tab === "intro" && <Intro setTab={setTab} t={t} />}
      {tab === "checkin" && <GuidedCheckIn key={checkInKey} rows={rows} saveReport={saveReport} setTab={setTab} lang={lang} t={t} />}
      {tab === "reset" && <EmergencyReset setTab={setTab} />}
      {tab === "paths" && <TransformationPaths setTab={setTab} />}
      {tab === "explore" && <Explore rows={rows} saveReport={saveReport} setTab={setTab} />}
      {tab === "shadows" && <ShadowLibrary />}
      {tab === "scripts" && <Scripts latest={latestReport} />}
      {tab === "reports" && <Reports reports={reports} />}
      {tab === "tracker" && <PatternTracker reports={reports} setTab={setTab} />}
      {tab === "help" && <HelpWiki setTab={setTab} />}
    </AppShell>
  );
}
