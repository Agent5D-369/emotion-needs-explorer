// src/prompts.js

export const GUIDED_PROMPTS = {
  Anger: {
    Agitation: {
      Agitated:
        "Regulate before replying; reduce input (noise, notifications, multitasking). Request: “I’m agitated and need 15 minutes of quiet to reset—can we pause and pick this up at :30?”",
    },
    Annoyance: {
      Annoyed:
        "Name the friction and ask for one small change. Request: “I’m annoyed by last-minute shifts; could we lock plans 24 hours ahead?”",
    },
    Bitterness: {
      Bitter:
        "Bitterness often signals unacknowledged effort. Request: “I need recognition and closure for my part—can we do a 5-minute acknowledgment and agree on boundaries going forward?”",
    },
    Contempt: {
      Contemptuous:
        "Contempt melts when dignity is restored. Request: “I want to speak without sarcasm; can we use non-blaming language and take timeouts if heat rises?”",
      Disdainful:
        "Name your values without shaming the other. Request: “I need respect for these standards—can we agree on how we’ll handle misses (fix, learn, move on)?”",
    },
    Exasperation: {
      Exasperated:
        "Reduce complexity; pick one lever. Request: “I’m exasperated—can we choose one priority and say no to the rest this week?”",
    },
    Frustration: {
      Exasperated:
        "Your system is overloaded—lower scope. Request: “I need fewer moving parts—can we defer nonessential tasks until Monday?”",
      Frustrated:
        "Turn blocked energy into a next step. Request: “I’m frustrated; what’s the single next deliverable and who owns it?”",
    },
    Hatred: {
      Hateful:
        "Prioritize safety and distance; don’t negotiate while inflamed. Request: “I need space to cool off—let’s pause one hour and restart with a mediator/ground rules.”",
    },
    Hostility: {
      Aggressive:
        "Shift from control to clarity. Request: “I want to collaborate; can we set the goal, roles, and a respectful tone before continuing?”",
      Hateful:
        "Reset the container. Request: “Language has crossed a line—can we stick to observations/requests only or end this for today?”",
      Hostile:
        "Name impact + boundary. Request: “This feels hostile; I need respect. If tone doesn’t change, I’ll step away and reschedule.”",
    },
    Irritation: {
      Agitated:
        "Down-shift the tempo. Request: “I’m keyed up; could we slow pace and take a 5-minute breathing break?”",
      Annoyed:
        "Ask for the smallest behavior tweak. Request: “Please finish one topic before starting another—it helps me track.”",
      Irritated:
        "Protect focus. Request: “I’m sensitive to interruptions—can we hold questions until the end?”",
    },
    Jealousy: {
      Envious:
        "Convert envy into growth. Request: “I admire that skill; can you mentor me 30 minutes weekly for a month?”",
      Jealous:
        "Ask for reassurance and a ritual. Request: “I’m feeling jealous—could we schedule a weekly check-in about us and share plans openly?”",
    },
    Rage: {
      Enraged:
        "Safety first; orient the body (grounding, water, movement). Request: “I need 20 minutes alone to regulate; I’ll return then.”",
      Vengeful:
        "Trade retaliation for repair. Request: “I want fairness—can we define what repair looks like and when each step will happen?”",
    },
    Resentment: {
      Bitter:
        "Ask for acknowledgment + boundary. Request: “I’ve been carrying this—could you acknowledge my contribution so we can reset expectations?”",
      Resentful:
        "Move to reciprocity. Request: “I need shared load—can we split this task 50/50 for the next two weeks and review?”",
    },
  },

  Disgust: {
    Aversion: {
      Averse:
        "Honor your ‘no’ without attacking. Request: “This isn’t a fit for me—I need an alternative role/option that respects my limits.”",
      Avoidant:
        "Create safe distance, not disconnection. Request: “I need space from this stimulus—can we switch locations or turn cameras off?”",
    },
    Contempt: {
      Disdainful:
        "Re-center on values + curiosity. Request: “I’m triggered by how this was done—can we review the decision path so I understand constraints?”",
      Dismissive:
        "Ask for engagement rules. Request: “I need my input considered—can we respond to each point rather than wave it off?”",
    },
    Disapproval: {
      Critical:
        "Turn criticism into criteria. Request: “Let’s list 3 success criteria and evaluate against them next time.”",
      Judgmental:
        "Swap labels for specifics. Request: “Instead of ‘bad’, could we name what’s missing and one fix?”",
    },
    Distaste: {
      Distasteful:
        "State preference + boundary. Request: “This approach isn’t aligned for me—can we choose option B or let me opt out?”",
      Offended:
        "Repair dignity quickly. Request: “That comment landed as disrespectful—I need an acknowledgment and a commitment to avoid it going forward.”",
    },
    Loathing: {
      Revolted:
        "Remove the exposure; restore purity/integrity. Request: “I need to disengage from this material—please send a summary instead.”",
    },
    Moral Outrage: {
      Indignant:
        "Channel heat into constructive action. Request: “This violates our values—can we form a small group to propose a fix by Friday?”",
      "Self-righteous":
        "Invite accountability without superiority. Request: “I’m asking for the same standard for all—can we agree on enforcement and transparency?”",
    },
    Nausea: {
      Queasy:
        "Soften sensory input. Request: “I’m queasy—could we get fresh air and dim the lights for a few minutes?”",
      Sickened:
        "Reassert safety/purity. Request: “This crosses my line—please remove the content or I’ll step out.”",
    },
    Revulsion: {
      Loathing:
        "Name the value breach; choose distance. Request: “This conflicts with my ethics—I need to abstain and won’t participate.”",
      Repulsed:
        "Swap exposure for summary. Request: “I need the outcome without the details—can you brief me by memo?”",
    },
  },

  Fear: {
    Alarm: {
      Alarmed:
        "Stabilize the environment and get orientation. Request: “I need a quick status of risks and what’s already contained.”",
    },
    Anxiety: {
      Anxious:
        "Ask for map + cadence. Request: “Could we outline three steps and set a 10-minute daily check-in until launch?”",
      Nervous:
        "Rehearse. Request: “I need a dry run with feedback in the next hour—can you spot-coach me?”",
      Worried:
        "Reduce uncertainty with updates. Request: “Please send me a brief status by 4pm daily until this resolves.”",
    },
    Apprehension: {
      Apprehensive:
        "Shrink the commitment; pilot. Request: “Can we start with a small trial through next week and reassess?”",
      Uneasy:
        "Clarify scope/limits. Request: “What’s in vs out? I need boundaries documented before I proceed.”",
    },
    Doubt: {
      Doubtful:
        "Ask for evidence and counter-examples. Request: “Can you show me the data or two past wins like this?”",
      Suspicious:
        "Transparency dissolves suspicion. Request: “I need the assumptions and conflicts of interest disclosed in writing.”",
    },
    Insecurity: {
      Helpless:
        "Create a win you own. Request: “Give me one piece I can lead this week so I regain momentum.”",
      Insecure:
        "Ask for criteria + reassurance. Request: “What does ‘good’ look like? A quick thumbs-up/thumbs-down during the work would help.”",
      Vulnerable:
        "Ask for protection ritual. Request: “If I say ‘timeout’, can we pause and resume calmly later?”",
    },
    Panic: {
      Panicked:
        "Body first (breath, orient, feet on floor). Request: “Sit with me for 2 minutes of slow breaths, then we’ll list next steps.”",
      Terrified:
        "Anchor to safety. Request: “Please stay close; I need to move to a quieter place and call a trusted person.”",
    },
    Terror: {
      Horrified:
        "Acknowledge shock; restore agency. Request: “I need to stop exposure and choose the next step—options A/B/C?”",
      Overwhelmed:
        "Contain inputs. Request: “Let’s park all but one thread—what single action matters most right now?”",
    },
  },

  Happiness: {
    Contentment: {
      Content:
        "Lock in what works. Request: “Let’s keep this rhythm—can we repeat this schedule next week?”",
      Relieved:
        "Close loops. Request: “Can we confirm what’s done and document final learnings today?”",
      Serene:
        "Guard the state. Request: “I’d like device-free evenings after 8pm—OK with you?”",
    },
    Gratitude: {
      Grateful:
        "Amplify by expressing it. Request: “I want to acknowledge you—can I share a quick win note with the team?”",
      Hopeful:
        "Convert hope to plan. Request: “Could we set one milestone and a check-in two weeks out?”",
      Optimistic:
        "Channel momentum. Request: “I’m energized—can we book a 90-minute focus block for this idea?”",
    },
    Joy: {
      Amused:
        "Schedule more play. Request: “Let’s add a 15-minute fun break after lunch daily this week.”",
      Excited:
        "Create a sandbox. Request: “I need time to build—can we protect Friday morning for a prototype?”",
      Joyful:
        "Repeat the conditions. Request: “Can we recreate this setting next month and invite two more people?”",
    },
    Love: {
      Affectionate:
        "Trade affection explicitly. Request: “I’d love more touch—can we do a hug before/after dinner?”",
      Compassionate:
        "Offer supportive presence. Request: “Can I sit with you for 10 minutes just to listen—no fixing?”",
      Loving:
        "Deepen ritual. Request: “Let’s do a weekly date night—phones away.”",
    },
    Pride: {
      Confident:
        "Steward others. Request: “I’m ready to mentor—can I support someone starting this path?”",
      Proud:
        "Invite celebration + visibility. Request: “Could we share a quick celebration in the channel?”",
    },
  },

  Sadness: {
    Disappointment: {
      Disappointed:
        "Normalize the dip and try again with adjusted scope. Request: “Can we revise the goal and attempt once more next sprint?”",
      Hurt:
        "Ask for gentler pace/tone. Request: “I’m hurt—can we slow down and stay with one topic?”",
      Regretful:
        "Move toward repair. Request: “I’d like to make amends—what would feel meaningful to you?”",
    },
    Grief: {
      Grieving:
        "Invite witnessing/ritual. Request: “Could you sit with me for 10 minutes—no advice, just presence?”",
      Heartbroken:
        "Ask for tenderness across time. Request: “Small acts help—can we plan two check-ins this week?”",
      Mourning:
        "Create a remembrance container. Request: “Let’s schedule a short ritual on the anniversary.”",
    },
    Hopelessness: {
      Defeated:
        "Borrow encouragement + agency. Request: “I need one achievable step I can own today—what’s your pick?”",
      Despairing:
        "Co-regulate and reconnect to meaning. Request: “Please help me ground, then let’s review what still matters to me.”",
      Hopeless:
        "Shrink to first pebble. Request: “What is the smallest action that moves this 1%?”",
    },
    Loneliness: {
      Abandoned:
        "Ask directly for care. Request: “I need check-ins—could we set two times this week?”",
      Isolated:
        "Bridge back gently. Request: “Can you join me at one low-pressure event this weekend?”",
      Lonely:
        "Name the intimacy you want. Request: “Could we schedule a walk or call just to connect?”",
    },
    Melancholy: {
      Heartache:
        "Soothe with connection. Request: “I need comfort—can we cook/eat together tonight?”",
      Melancholic:
        "Turn reflection into expression. Request: “I’d like 30 minutes to journal or make music—can you protect the time with me?”",
    },
    Shame: {
      Ashamed:
        "Invite compassion; remove global labels. Request: “Please reflect back what you still respect about me while we discuss the miss.”",
      Guilty:
        "Own impact + repair. Request: “I’m sorry—can we agree on one repair action and a follow-up date?”",
      Remorseful:
        "Pair responsibility with renewal. Request: “Here’s what I’ll change—can we review progress in two weeks?”",
    },
  },

  Surprise: {
    Amazement: {
      Amazed:
        "Capture what worked. Request: “Can we write a 5-bullet ‘why this succeeded’ and repeat next cycle?”",
      Astonished:
        "Turn awe into learning. Request: “Walk me through how this happened—I want to understand the mechanics.”",
      Impressed:
        "Offer recognition that sticks. Request: “I’d like to publicly acknowledge this—OK to post a note today?”",
    },
    Awe: {
      Awed:
        "Anchor the experience. Request: “Let’s take a photo/write a note about why this moved us and schedule a revisit.”",
    },
    Confusion: {
      Confused:
        "Ask for orientation. Request: “Can you give me the one-minute overview and desired outcome?”",
      Disoriented:
        "Stabilize and restate. Request: “Please list the three steps in order—I’ll repeat back to confirm.”",
    },
    Shock: {
      Disbelief:
        "Get the story and sources. Request: “Could you explain the reasoning and share the key references?”",
      Shocked:
        "Slow down; prioritize. Request: “Let’s pause, verify facts, and choose one immediate action.”",
      Stunned:
        "Ask for recap. Request: “Please summarize what changed and what’s expected of me now.”",
    },
    Startle: {
      Startled:
        "Soothe the startle. Request: “Give me a minute to breathe and then repeat the ask slowly.”",
    },
    Wonder: {
      Curious:
        "Feed curiosity. Request: “Can we book 30 minutes to explore this question?”",
      Intrigued:
        "Try a small experiment. Request: “Let’s run a one-week test and review results Friday.”",
      Wondering:
        "Turn questions into research. Request: “I’ll draft 3 hypotheses—can you sanity-check them with me tomorrow?”",
    },
  },
};

// Optional fallbacks (trigger only if you later add new emotions without guidance)
export const CORE_FALLBACK = {
  Anger:
    "Center the boundary you need. Request: “I’m activated and need a clearer boundary. Can we define limits and consequences?”",
  Fear:
    "Increase predictability. Request: “I’m anxious and need a map. Can we outline steps, owners, and check-ins?”",
  Sadness:
    "Invite care + repair. Request: “I’m hurting and need compassion. Can we slow down and name one repair?”",
  Surprise:
    "Orient, then act. Request: “This surprised me and I need context. Can we review facts and decide one next step?”",
  Happiness:
    "Amplify what’s working. Request: “This feels good and I want more. Can we schedule a repeat and name why it worked?”",
};

export const NEED_FALLBACK = {
  safety:
    "Ask for a safety anchor. Request: “I need to feel safe. Can we pause for 10 minutes and agree on calm-language only?”",
  clarity:
    "Ask for simple structure. Request: “I need clarity. Can we write the next three steps and who owns them?”",
  connection:
    "Ask for contact. Request: “I need connection. Can we plan a check-in call this week?”",
  respect:
    "Ask for dignity rituals. Request: “I need respect. Can we avoid interruptions and use non-blaming language?”",
  rest:
    "Ask for recovery. Request: “I need rest. Can we wrap by 9pm and keep tomorrow morning light?”",
};

export const DEFAULT_PROMPT =
  "Name your need, then translate it into a doable request beginning with “Could we…” and ending with a time or boundary. Keep it small and testable.";

export function guidanceFor({ core, sub, specific, needs = [] }) {
  if (GUIDED_PROMPTS?.[core]?.[sub]?.[specific]) {
    return GUIDED_PROMPTS[core][sub][specific];
  }
  if (GUIDED_PROMPTS?.[core]?.[sub]) {
    const first = Object.values(GUIDED_PROMPTS[core][sub])[0];
    if (first) return first;
  }
  if (CORE_FALLBACK?.[core]) return CORE_FALLBACK[core];
  const flat = needs.map(n => n.toLowerCase());
  for (const [k,v] of Object.entries(NEED_FALLBACK)) {
    if (flat.some(n => n.includes(k))) return v;
  }
  return DEFAULT_PROMPT;
}
