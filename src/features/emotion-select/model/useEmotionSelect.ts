import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Emotion } from "@/entities/emotion-log";
import { postTodayEmotion, useTodayEmotion } from "@/entities/emotion-log";
import type { User } from "@/entities/user";

interface UseEmotionSelectReturn {
  isLoggedIn: boolean;
  todayEmotion: Emotion | null;
  isSubmitting: boolean;
  selectEmotion: (emotion: Emotion) => void;
}

export function useEmotionSelect(): UseEmotionSelectReturn {
  const queryClient = useQueryClient();
  // 네트워크 요청 없이 캐시에서만 읽음 — 로그인 후 보호 페이지 방문 시 캐시가 채워짐
  const me = queryClient.getQueryData<User>(["me"]);

  const { data: todayEmotionLog } = useTodayEmotion(me?.id ?? 0);

  const { mutate, isPending } = useMutation({
    mutationFn: postTodayEmotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emotionLogs", "today"] });
    },
  });

  return {
    isLoggedIn: me != null,
    todayEmotion: todayEmotionLog?.emotion ?? null,
    isSubmitting: isPending,
    selectEmotion: mutate,
  };
}
