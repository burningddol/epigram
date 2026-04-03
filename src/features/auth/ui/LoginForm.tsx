"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { signIn } from "@/entities/user";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

import { loginSchema, type LoginFormValues } from "../model/loginSchema";

export function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  async function onSubmit(data: LoginFormValues): Promise<void> {
    try {
      await signIn(data);
      router.push("/");
    } catch {
      const message = "이메일 혹은 비밀번호를 확인해주세요.";
      setError("email", { message });
      setError("password", { message });
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
          type="password"
          placeholder="비밀번호"
          error={errors.password?.message}
          aria-label="비밀번호"
          {...register("password")}
        />
      </div>
      <Button type="submit" isLoading={isSubmitting} className="h-11 w-full">
        로그인
      </Button>
    </form>
  );
}
