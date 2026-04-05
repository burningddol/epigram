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
  // 공개 페이지에서도 로그인 상태를 확인하므로 401 실패는 에러가 아닌 "비로그인"으로 처리
  const { data: me, isSuccess: isMeLoaded } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    throwOnError: false,
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
