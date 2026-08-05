"use client";

import { useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useAuthSession } from "@/features/auth/client/auth-session-context";
import { useI18n } from "@/features/i18n/i18n-context";
import { useLeaderboard } from "@/features/leaderboard/hooks/use-leaderboard";
import type { RankingItem } from "@/features/leaderboard/types";

const ROW_STYLES = [
  "bg-gradient-to-r from-[#ff6a60] to-[#ff8c50]",
  "bg-gradient-to-r from-[#ffc24d] to-[#ff9f4a]",
  "bg-gradient-to-r from-[#5f8dff] to-[#4f6fff]",
  "bg-gradient-to-r from-[#c54fd7] to-[#8c4be0]",
  "bg-gradient-to-r from-[#1ec98f] to-[#23b7d7]",
  "bg-gradient-to-r from-[#c5c9cf] to-[#9fa6b2]",
  "bg-gradient-to-r from-[#5f4ac8] to-[#3d2f9f]",
];

const MAX_ROWS = 30;

function hashText(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getStableRowStyle(item: RankingItem): string {
  const stableSource = String(item.id ?? item.email ?? item.name);
  const styleIndex = hashText(stableSource) % ROW_STYLES.length;
  return ROW_STYLES[styleIndex];
}

type LeaderboardEntry =
  | { kind: "item"; item: RankingItem; rank: number }
  | { kind: "ellipsis" };

export default function LeaderboardPage() {
  const { t } = useI18n();
  const { user } = useAuthSession();
  const { items, loading, error } = useLeaderboard();

  const entries = useMemo<LeaderboardEntry[]>(() => {
    if (items.length === 0) {
      return [];
    }

    const currentUserId = user?.id;
    const currentUserIndex =
      currentUserId === undefined
        ? -1
        : items.findIndex((item) => String(item.id) === String(currentUserId));

    if (currentUserIndex === -1 || currentUserIndex < MAX_ROWS) {
      return items.slice(0, MAX_ROWS).map((item, index) => ({
        kind: "item",
        item,
        rank: index + 1,
      }));
    }

    const topFive = items.slice(0, 5).map((item, index) => ({
      kind: "item" as const,
      item,
      rank: index + 1,
    }));

    const tailCount = MAX_ROWS - 5;
    const userSection = items
      .slice(currentUserIndex, currentUserIndex + tailCount)
      .map((item, index) => ({
        kind: "item" as const,
        item,
        rank: currentUserIndex + index + 1,
      }));

    return [...topFive, { kind: "ellipsis" as const }, ...userSection];
  }, [items, user?.id]);

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-13.8rem)] items-center justify-center">
        <Spinner className="h-10 w-10 border-[3px]" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto flex w-full max-w-[30rem] flex-col px-4">
        <p className="text-[#ff8181]">{error}</p>
      </main>
    );
  }

  if (entries.length === 0) {
    return (
      <main className="fixed bottom-[4.2rem] left-1/2 top-[8.6rem] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col overflow-hidden px-4">
        <h1 className="sticky top-0 z-10 shrink-0 bg-[#033470] py-1 text-left text-4xl font-extrabold tracking-tight">
          {t("leaderboard.title")}
        </h1>
        <div className="mt-3 flex min-h-0 flex-1 items-start overflow-y-auto">
          <p>{t("common.emptyList")}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="fixed bottom-[4.2rem] left-1/2 top-[8.6rem] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col overflow-hidden px-4">
      <h1 className="sticky top-0 z-10 shrink-0 bg-[#033470] py-1 text-left text-4xl font-extrabold tracking-tight">
        {t("leaderboard.title")}
      </h1>
      <section className="mt-3 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-2 pr-1">
        {entries.map((entry, index) => {
          if (entry.kind === "ellipsis") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex items-center justify-center py-0 text-3xl font-extrabold text-white"
              >
                ...
              </div>
            );
          }

          const { item, rank } = entry;
          const isCurrentUser =
            user?.id !== undefined && String(item.id) === String(user.id);
          const pointsLabel =
            item.points > 1
              ? t("leaderboard.pointsPlural")
              : t("leaderboard.pointsSingular");
          const rowStyle = getStableRowStyle(item);

          return (
            <article
              key={`${item.email}-${item.pointsTimestamp}-${rank}`}
              className={`rounded-md px-4 py-4 text-white shadow-lg ${rowStyle} ${
                isCurrentUser ? "border-[3px] border-white" : "border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-8 text-center text-2xl font-extrabold">
                    {rank}
                  </span>
                  <span className="truncate text-base font-semibold">{item.name}</span>
                </div>
                <span className="whitespace-nowrap text-base font-bold">
                  {item.points} {pointsLabel}
                </span>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

