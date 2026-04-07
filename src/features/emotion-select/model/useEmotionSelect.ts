import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postTodayEmotion, useTodayEmotion } from "@/entities/emotion-log";
import { useMe } from "@/entities/user";

import type { Emotion } from "@/entities/emotion-log";

interface UseEmotionSelectReturn {
  isLoggedIn: boolean;
  todayEmotion: Emotion | null;
  isSubmitting: boolean;
  selectEmotion: (emotion: Emotion) => void;
}

export function useEmotionSelect(): UseEmotionSelectReturn {
  const { user } = useMe();
  const queryClient = useQueryClient();

  // emotionLogs/today POST는 upsert — 기선택 감정도 재호출로 변경 가능
  const { data: todayEmotionLog } = useTodayEmotion(user?.id ?? 0);

  const { mutate, isPending } = useMutation({
    mutationFn: postTodayEmotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emotionLogs", "today"] });
    },
  });

  return {
    isLoggedIn: user != null,
    todayEmotion: todayEmotionLog?.emotion ?? null,
    isSubmitting: isPending,
    selectEmotion: mutate,
  };
}
