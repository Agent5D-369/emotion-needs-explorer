export const EMOTION_DATA = {
  Anger: {
    Rage: {
      Hateful: ["acceptance", "belonging", "unconditional regard"],
      Hostile: ["safety", "trust", "respect"],
      Agitated: ["rest", "calm", "regulation"],
    },
    Exasperated: {
      Frustrated: ["progress", "effectiveness", "clarity"],
      Aggravated: ["ease", "cooperation", "understanding"],
      Irritable: ["space", "rest", "reduced stimulation"],
    },
    Envy: {
      Jealous: ["assurance", "recognition", "exclusivity", "value"],
      Resentful: ["fairness", "equality", "reciprocity"],
      Envious: ["abundance", "opportunity", "self-worth"],
    },
    Disgust: {
      Disapproving: ["alignment", "integrity", "values honored"],
      Contempt: ["respect", "dignity", "authenticity"],
    },
  },
  Fear: {
    Horror: {
      Dread: ["safety", "predictability", "protection"],
      Mortified: ["acceptance", "dignity", "belonging"],
      Appalled: ["alignment with values", "order", "justice"],
    },
    Nervous: {
      Insecure: ["stability", "reassurance", "self-worth"],
      Anxious: ["safety", "grounding", "clarity"],
      Hysterical: ["soothing", "regulation", "containment"],
    },
    Scared: {
      Helpless: ["support", "empowerment", "agency"],
      Frightened: ["safety", "reassurance", "protection"],
      Panic: ["grounding", "breath", "support"],
    },
    Terror: {
      Worried: ["certainty", "clarity", "solutions"],
      Uneasy: ["comfort", "reassurance", "grounding"],
      Apprehensive: ["preparation", "trust", "protection"],
    },
  },
  Sadness: {
    Agony: {
      Hurt: ["care", "compassion", "being seen"],
      Depressed: ["purpose", "connection", "vitality"],
      Sorrow: ["acknowledgment", "shared mourning", "love"],
    },
    Disappointed: {
      Dismayed: ["hope", "stability", "restoration"],
      Displeased: ["preference honored", "harmony", "choice"],
      Regretful: ["forgiveness", "repair", "acceptance"],
    },
    Guilt: {
      Isolated: ["connection", "inclusion", "belonging"],
      Lonely: ["companionship", "love", "shared presence"],
      Grief: ["mourning", "remembrance", "support"],
    },
    Despair: {
      Neglected: ["attention", "nurturing", "recognition"],
      Hopeless: ["hope", "meaning", "encouragement"],
      Suffering: ["relief", "healing", "compassion"],
    },
  },
  Surprise: {
    Stunned: {
      Confused: ["clarity", "orientation", "understanding"],
      Amazed: ["wonder", "meaning", "integration"],
      Overcome: ["containment", "grounding", "support"],
    },
    Shock: {
      Dismayed: ["reassurance", "stability", "recovery"],
      Perplexed: ["answers", "understanding", "guidance"],
      Awestruck: ["awe", "connection", "spiritual meaning"],
    },
    Astounded: {
      Speechless: ["expression", "integration", "sharing"],
      Touched: ["connection", "recognition", "intimacy"],
      Moved: ["meaning", "resonance", "belonging"],
    },
    Astonished: {
      Amazed: ["wonder", "meaning", "integration"],
      Dumbfounded: ["sense-making", "orientation", "clarity"],
      Flabbergasted: ["processing", "grounding", "explanation"],
    },
  },
  Joy: {
    Optimistic: {
      Hopeful: ["vision", "possibility", "encouragement"],
      Eager: ["engagement", "opportunity", "momentum"],
      Enthusiastic: ["expression", "outlet", "contribution"],
    },
    Proud: {
      Triumphant: ["recognition", "accomplishment", "celebration"],
      Illustrious: ["respect", "legacy", "honor"],
      Accomplished: ["acknowledgment", "pride", "closure"],
    },
    Cheerful: {
      Joyful: ["play", "freedom", "aliveness"],
      Excited: ["adventure", "novelty", "creativity"],
      Enthralled: ["immersion", "stimulation", "connection"],
    },
    Content: {
      Happy: ["connection", "enjoyment", "fulfillment"],
      Delighted: ["surprise", "joy", "gratitude"],
      Blissful: ["union", "transcendence", "peace"],
    },
  },
  Love: {
    Peaceful: {
      Satisfied: ["contentment", "completion", "enoughness"],
      Relieved: ["ease", "release", "resolution"],
      Compassionate: ["connection", "empathy", "contribution"],
    },
    Tenderness: {
      Caring: ["purpose", "affection", "giving/receiving"],
      Compassion: ["understanding", "resonance", "healing"],
      Affection: ["touch", "closeness", "warmth"],
    },
    Desire: {
      Infatuated: ["connection", "novelty", "passion"],
      Passionate: ["expression", "creativity", "purpose"],
      Romantic: ["intimacy", "bonding", "shared meaning"],
    },
    Affectionate: {
      Fondness: ["closeness", "appreciation", "affection"],
      Attachment: ["stability", "continuity", "bonding"],
      Admiration: ["recognition", "inspiration", "aspiration"],
    },
  },
};

export function toRows() {
  const rows = [];
  Object.entries(EMOTION_DATA).forEach(([core, subs]) => {
    Object.entries(subs).forEach(([sub, specifics]) => {
      Object.entries(specifics).forEach(([specific, needs]) => {
        rows.push({ core, sub, specific, needs });
      });
    });
  });
  return rows;
}
