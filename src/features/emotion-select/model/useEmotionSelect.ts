import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Emotion } from "@/entities/emotion-log";
import { postTodayEmotion, useTodayEmotion } from "@/entities/emotion-log";

interface UseEmotionSelectReturn {
  hasSelectedToday: boolean;
  isSubmitting: boolean;
  selectEmotion: (emotion: Emotion) => void;
}

export function useEmotionSelect(): UseEmotionSelectReturn {
  const queryClient = useQueryClient();
  const { data: todayEmotion } = useTodayEmotion();

  const { mutate, isPending } = useMutation({
    mutationFn: postTodayEmotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emotionLogs", "today"] });
    },
  });

  return {
    hasSelectedToday: todayEmotion != null,
    isSubmitting: isPending,
    selectEmotion: mutate,
  };
}
