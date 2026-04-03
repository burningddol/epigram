"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { signUp } from "@/entities/user";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

import { signUpSchema, type SignUpFormValues } from "../model/signUpSchema";

export function SignUpForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  async function onSubmit(data: SignUpFormValues): Promise<void> {
    try {
      await signUp(data);
      router.push("/");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 500) {
        setError("nickname", { message: "이미 사용 중인 닉네임입니다." });
        return;
      }
      throw error;
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="이메일"
        type="email"
        placeholder="이메일을 입력해 주세요"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="닉네임"
        type="text"
        placeholder="닉네임을 입력해 주세요"
        error={errors.nickname?.message}
        {...register("nickname")}
      />
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력해 주세요"
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호를 다시 입력해 주세요"
        error={errors.passwordConfirmation?.message}
        {...register("passwordConfirmation")}
      />
      <Button type="submit" isLoading={isSubmitting} className="w-full">
        가입하기
      </Button>
    </form>
  );
}
