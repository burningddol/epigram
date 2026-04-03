import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postTodayEmotion, useTodayEmotion } from "@/entities/emotion-log";
import type { Emotion } from "@/entities/emotion-log";

export function useEmotionSelect(): {
  hasSelectedToday: boolean;
  isSubmitting: boolean;
  selectEmotion: (emotion: Emotion) => void;
} {
  const queryClient = useQueryClient();
  const { data: todayEmotion } = useTodayEmotion();

  const { mutate, isPending } = useMutation({
    mutationFn: postTodayEmotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emotionLogs", "today"] });
    },
  });

  return {
    hasSelectedToday: todayEmotion !== null && todayEmotion !== undefined,
    isSubmitting: isPending,
    selectEmotion: mutate,
  };
}
