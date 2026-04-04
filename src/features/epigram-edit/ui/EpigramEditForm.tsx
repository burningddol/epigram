"use client";

import { type KeyboardEvent, type ReactElement } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";

import {
  AUTHOR_TYPE,
  epigramCreateFormSchema,
  type AuthorType,
  type EpigramCreateFormValues,
} from "@/features/epigram-create/model/schema";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

import { useEpigramEdit } from "../model/useEpigramEdit";

interface AuthorRadioOption {
  value: AuthorType;
  label: string;
}

const AUTHOR_OPTIONS: AuthorRadioOption[] = [
  { value: AUTHOR_TYPE.DIRECT, label: "직접 입력" },
  { value: AUTHOR_TYPE.UNKNOWN, label: "알 수 없음" },
  { value: AUTHOR_TYPE.SELF, label: "본인" },
];

const MAX_CONTENT_LENGTH = 500;

interface EpigramEditFormProps {
  epigramId: number;
  defaultValues: EpigramCreateFormValues;
}

export function EpigramEditForm({ epigramId, defaultValues }: EpigramEditFormProps): ReactElement {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<EpigramCreateFormValues>({
    resolver: zodResolver(epigramCreateFormSchema),
    defaultValues,
  });

  const {
    tagInput,
    handleTagInputChange,
    handleAddTag,
    handleRemoveTag,
    handleCancel,
    submit,
    isSubmitting,
    hasError,
  } = useEpigramEdit(epigramId);

  const contentValue = watch("content");
  const authorType = watch("authorType");
  const contentLength = contentValue?.length ?? 0;
  const isContentNearLimit = contentLength >= MAX_CONTENT_LENGTH * 0.9;
  const isContentOverLimit = contentLength > MAX_CONTENT_LENGTH;

  function getContentCounterClass(): string {
    if (isContentOverLimit) return "font-semibold text-error";
    if (isContentNearLimit) return "text-black-300";
    return "text-blue-400";
  }

  function handleTagKeyDown(
    e: KeyboardEvent<HTMLInputElement>,
    currentTags: string[],
    onChange: (tags: string[]) => void
  ): void {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(currentTags, onChange);
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-8" noValidate>
      <fieldset className="flex flex-col gap-2">
        <label htmlFor="content" className="text-sm font-semibold text-blue-900">
          내용 <span className="text-error">*</span>
        </label>
        <div className="relative">
          <textarea
            id="content"
            {...register("content")}
            placeholder="500자 이내로 입력해주세요."
            rows={5}
            className={`w-full resize-none rounded-xl bg-blue-200 px-4 py-3 pb-6 text-sm text-black-950 outline-none transition-all duration-200 placeholder:text-blue-400 focus:bg-blue-100 focus:ring-2 focus:ring-black-500 ${
              errors.content ? "bg-blue-100 ring-2 ring-error" : ""
            }`}
          />
          <span
            className={`absolute bottom-3 right-4 text-xs transition-colors duration-200 ${getContentCounterClass()}`}
          >
            {contentLength} / {MAX_CONTENT_LENGTH}
          </span>
        </div>
        {errors.content ? (
          <p className="animate-fade-in text-xs text-error">{errors.content.message}</p>
        ) : null}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-semibold text-blue-900">
          저자 <span className="text-error">*</span>
        </legend>

        <Controller
          name="authorType"
          control={control}
          render={({ field }) => (
            <div className="flex gap-6">
              {AUTHOR_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-black-500 transition-colors hover:text-black-900"
                >
                  <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                    <input
                      type="radio"
                      value={option.value}
                      checked={field.value === option.value}
                      onChange={() => field.onChange(option.value)}
                      className="peer sr-only"
                    />
                    <span className="h-5 w-5 rounded-full border-2 border-blue-400 transition-colors duration-150 peer-checked:border-blue-900 peer-focus-visible:ring-2 peer-focus-visible:ring-black-500 peer-focus-visible:ring-offset-1" />
                    <span className="absolute h-2.5 w-2.5 scale-0 rounded-full bg-blue-900 transition-transform duration-150 peer-checked:scale-100" />
                  </span>
                  {option.label}
                </label>
              ))}
            </div>
          )}
        />

        {authorType === AUTHOR_TYPE.DIRECT ? (
          <div className="animate-fade-in">
            <Input
              {...register("authorName")}
              placeholder="저자 이름 입력"
              error={errors.authorName?.message}
            />
          </div>
        ) : null}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold text-blue-900">출처</legend>
        <div className="flex flex-col gap-2">
          <Input
            {...register("referenceTitle")}
            placeholder="출처 제목 입력"
            error={errors.referenceTitle?.message}
          />
          <Input
            {...register("referenceUrl")}
            placeholder="URL (ex. https://www.website.com)"
            type="url"
            error={errors.referenceUrl?.message}
          />
        </div>
      </fieldset>

      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-semibold text-blue-900">태그</legend>

            <div className="relative">
              <input
                value={tagInput}
                onChange={(e) => handleTagInputChange(e.target.value)}
                onKeyDown={(e) => handleTagKeyDown(e, field.value, field.onChange)}
                placeholder="입력하여 태그 작성 (최대 10자)"
                disabled={field.value.length >= 3}
                className={[
                  "h-11 w-full rounded-xl bg-blue-200 px-4 pr-20 text-sm text-black-950",
                  "outline-none transition-all duration-200 placeholder:text-blue-400",
                  "focus:bg-blue-100 focus:ring-2 focus:ring-black-500",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  errors.tags ? "bg-blue-100 ring-2 ring-error" : "",
                ].join(" ")}
              />
              <button
                type="button"
                onClick={() => handleAddTag(field.value, field.onChange)}
                disabled={field.value.length >= 3 || !tagInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-blue-900 px-3 py-1 text-xs font-semibold text-white transition-all duration-150 hover:bg-black-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                추가
              </button>
            </div>

            {field.value.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {field.value.map((tag) => (
                  <span
                    key={tag}
                    className="animate-fade-in flex items-center gap-1 rounded-full bg-blue-200 px-3 py-1 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-300"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag, field.value, field.onChange)}
                      className="ml-0.5 rounded-full p-0.5 text-blue-400 transition-colors hover:bg-blue-400 hover:text-white"
                      aria-label={`태그 '${tag}' 삭제`}
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}

            <p className="text-xs text-blue-400">
              {field.value.length >= 3
                ? "태그는 최대 3개까지 추가할 수 있습니다."
                : `${field.value.length}/3개 추가됨`}
            </p>

            {errors.tags ? (
              <p className="animate-fade-in text-xs text-error">{errors.tags.message}</p>
            ) : null}
          </fieldset>
        )}
      />

      {hasError ? (
        <p className="animate-fade-in rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
          에피그램 수정에 실패했습니다. 다시 시도해주세요.
        </p>
      ) : null}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          className="h-12 flex-1 text-base"
        >
          취소
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isContentOverLimit}
          className="h-12 flex-1 text-base"
        >
          수정 완료
        </Button>
      </div>
    </form>
  );
}
