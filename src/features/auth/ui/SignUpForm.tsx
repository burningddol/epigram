"use client";

import type { ReactElement } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { signUp } from "@/entities/user";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

import { signUpSchema, type SignUpFormValues } from "../model/signUpSchema";

export function SignUpForm(): ReactElement {
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-[10px]">
        <Input
          type="email"
          placeholder="이메일"
          error={errors.email?.message}
          aria-label="이메일"
          {...register("email")}
        />
        <Input
          type="text"
          placeholder="닉네임"
          error={errors.nickname?.message}
          aria-label="닉네임"
          {...register("nickname")}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          error={errors.password?.message}
          aria-label="비밀번호"
          {...register("password")}
        />
        <Input
          type="password"
          placeholder="비밀번호 확인"
          error={errors.passwordConfirmation?.message}
          aria-label="비밀번호 확인"
          {...register("passwordConfirmation")}
        />
      </div>
      <Button type="submit" isLoading={isSubmitting} className="h-11 w-full">
        가입하기
      </Button>
    </form>
  );
}
