"use client";

import { useEffect, type ReactElement } from "react";

import { useRouter } from "next/navigation";

import { useEpigramDetail } from "@/entities/epigram";
import { useMe } from "@/entities/user";
import { AUTHOR_TYPE, type EpigramCreateFormValues } from "@/features/epigram-create/model/schema";
import { EpigramEditForm } from "@/features/epigram-edit";

const UNKNOWN_AUTHOR = "알 수 없음";

const PAGE_CONTAINER_CLASS =
  "mx-auto w-full max-w-2xl px-4 py-10 tablet:max-w-3xl tablet:px-6 pc:max-w-screen-xl pc:px-16 pc:py-16 desktop:max-w-screen-2xl desktop:px-24";

interface EpigramEditPageProps {
  epigramId: number;
}

interface ResolveDefaultValuesParams {
  content: string;
  author: string;
  referenceTitle: string | null;
  referenceUrl: string | null;
  tagNames: string[];
}

function resolveDefaultValues({
  content,
  author,
  referenceTitle,
  referenceUrl,
  tagNames,
}: ResolveDefaultValuesParams): EpigramCreateFormValues {
  const isUnknown = author === UNKNOWN_AUTHOR;

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
  const { user: me, isLoading: isMeLoading } = useMe();

  const isUnauthorized =
    !isMeLoading && me !== null && epigram !== undefined && epigram.writerId !== me.id;

  useEffect(() => {
    if (isUnauthorized) {
      router.replace(`/epigrams/${epigramId}`);
    }
  }, [isUnauthorized, epigramId, router]);

  const isLoading = isEpigramLoading || isMeLoading;

  if (isLoading || !epigram || isUnauthorized) {
    return (
      <div className={PAGE_CONTAINER_CLASS}>
        <div className="mb-8">
          <div className="h-9 w-48 animate-pulse rounded-lg bg-blue-200" />
        </div>
        <div className="h-96 animate-pulse rounded-2xl bg-blue-100" />
      </div>
    );
  }

  const defaultValues = resolveDefaultValues({
    content: epigram.content,
    author: epigram.author,
    referenceTitle: epigram.referenceTitle,
    referenceUrl: epigram.referenceUrl,
    tagNames: epigram.tags.map((tag) => tag.name),
  });

  return (
    <div className={PAGE_CONTAINER_CLASS}>
      <div className="mb-8 pc:mb-12">
        <h1 className="text-2xl font-bold text-black-950 tablet:text-3xl pc:text-4xl desktop:text-5xl">
          에피그램 수정
        </h1>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-200 tablet:p-8 pc:p-10">
        <EpigramEditForm epigramId={epigramId} defaultValues={defaultValues} />
      </div>
    </div>
  );
}
