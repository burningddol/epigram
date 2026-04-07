import type { Emotion } from "./schema";

export interface EmotionMeta {
  label: string;
  icon: string;
  color: string;
}

export const EMOTION_META: Record<Emotion, EmotionMeta> = {
  MOVED: { label: "감동", icon: "/icon/012-heart face.png", color: "#48bb98" },
  HAPPY: { label: "기쁨", icon: "/icon/035-smiling face.png", color: "#fbc85b" },
  WORRIED: { label: "고민", icon: "/icon/044-thinking.png", color: "#8e80e3" },
  SAD: { label: "슬픔", icon: "/icon/034-sad.png", color: "#5195ee" },
  ANGRY: { label: "분노", icon: "/icon/Frame 65.png", color: "#e46e80" },
};

export const EMOTION_ORDER: Emotion[] = ["MOVED", "HAPPY", "WORRIED", "SAD", "ANGRY"];
