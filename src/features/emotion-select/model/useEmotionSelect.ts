import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postTodayEmotion, useTodayEmotion } from "@/entities/emotion-log";
import { useMe } from "@/entities/user";

import type { Emotion, EmotionLog } from "@/entities/emotion-log";

interface UseEmotionSelectReturn {
  isLoggedIn: boolean;
  todayEmotion: Emotion | null;
  isSubmitting: boolean;
  selectEmotion: (emotion: Emotion) => void;
}

export function useEmotionSelect(): UseEmotionSelectReturn {
  const { user } = useMe();
  const queryClient = useQueryClient();

  const { data: todayEmotionLog } = useTodayEmotion(user?.id ?? 0);

  const todayKey = ["emotionLogs", "today", user?.id ?? 0];

  const { mutate, isPending } = useMutation({
    mutationFn: postTodayEmotion,
    onMutate: async (emotion) => {
      // 진행 중인 refetch 취소 — optimistic update 덮어쓰기 방지
      await queryClient.cancelQueries({ queryKey: todayKey });

      const previous = queryClient.getQueryData<EmotionLog | null>(todayKey);

      queryClient.setQueryData<EmotionLog | null>(todayKey, (old) =>
        old != null ? { ...old, emotion } : null
      );

      return { previous };
    },
    onError: (_err, _emotion, context) => {
      // 실패 시 이전 값으로 롤백
      queryClient.setQueryData(todayKey, context?.previous);
    },
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
