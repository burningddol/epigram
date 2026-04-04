"use client";

import type { ReactElement } from "react";

import { useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { useEpigramDetail } from "@/entities/epigram";
import { getMe } from "@/entities/user";
import { AUTHOR_TYPE, type EpigramCreateFormValues } from "@/features/epigram-create/model/schema";
import { EpigramEditForm } from "@/features/epigram-edit";

interface EpigramEditPageProps {
  epigramId: number;
}

function resolveDefaultValues(
  content: string,
  author: string,
  referenceTitle: string | null,
  referenceUrl: string | null,
  tagNames: string[]
): EpigramCreateFormValues {
  const isUnknown = author === "알 수 없음";

  return {
    content,
    authorType: isUnknown ? AUTHOR_TYPE.UNKNOWN : AUTHOR_TYPE.DIRECT,
    authorName: isUnknown ? "" : author,
    referenceTitle: referenceTitle ?? "",
    referenceUrl: referenceUrl ?? "",
    tags: tagNames,
  };
}

export function EpigramEditPage({ epigramId }: EpigramEditPageProps): ReactElement {
  const router = useRouter();
  const { data: epigram, isLoading: isEpigramLoading } = useEpigramDetail(epigramId);
  const { data: me, isLoading: isMeLoading } = useQuery({ queryKey: ["me"], queryFn: getMe });

  const isLoading = isEpigramLoading || isMeLoading;

  if (!isLoading && epigram && me && epigram.writerId !== me.id) {
    router.replace(`/epigrams/${epigramId}`);
    return <></>;
  }

  if (isLoading || !epigram) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 tablet:max-w-3xl tablet:px-6 pc:max-w-screen-xl pc:px-16 pc:py-16">
        <div className="mb-8">
          <div className="h-9 w-48 animate-pulse rounded-lg bg-blue-200" />
        </div>
        <div className="h-96 animate-pulse rounded-2xl bg-blue-100" />
      </div>
    );
  }

  const defaultValues = resolveDefaultValues(
    epigram.content,
    epigram.author,
    epigram.referenceTitle,
    epigram.referenceUrl,
    epigram.tags.map((t) => t.name)
  );

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 tablet:max-w-3xl tablet:px-6 pc:max-w-screen-xl pc:px-16 pc:py-16">
      <div className="mb-8 pc:mb-12">
        <h1 className="text-2xl font-bold text-black-950 tablet:text-3xl pc:text-4xl">
          에피그램 수정
        </h1>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-200 tablet:p-8 pc:p-10">
        <EpigramEditForm epigramId={epigramId} defaultValues={defaultValues} />
      </div>
    </div>
  );
}
