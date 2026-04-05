import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Emotion } from "@/entities/emotion-log";
import { postTodayEmotion, useTodayEmotion } from "@/entities/emotion-log";
import { getMe } from "@/entities/user";

interface UseEmotionSelectReturn {
  isLoggedIn: boolean;
  todayEmotion: Emotion | null;
  isSubmitting: boolean;
  selectEmotion: (emotion: Emotion) => void;
}

export function useEmotionSelect(): UseEmotionSelectReturn {
  const queryClient = useQueryClient();
  const { data: me, isSuccess: isMeLoaded } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const { data: todayEmotionLog } = useTodayEmotion(me?.id ?? 0);

  const { mutate, isPending } = useMutation({
    mutationFn: postTodayEmotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emotionLogs", "today"] });
    },
  });

  return {
    isLoggedIn: isMeLoaded && me != null,
    todayEmotion: todayEmotionLog?.emotion ?? null,
    isSubmitting: isPending,
    selectEmotion: mutate,
  };
}
