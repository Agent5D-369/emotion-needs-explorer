export const EMOTION_DATA = {
  Anger: { Irritation: { Irritated: ["consideration","respect","acknowledgment"] } },
  Fear: { Anxiety: { Anxious: ["safety","reassurance","calm"] } },
  Sadness: { Disappointment: { Disappointed: ["understanding","encouragement","support"] } },
  Surprise: { Shock: { Stunned: ["orientation","grounding","clarity"] } },
  Happiness: { Joy: { Joyful: ["connection","celebration","freedom"] } }
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