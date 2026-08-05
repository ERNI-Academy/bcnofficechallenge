"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/features/i18n/i18n-context";

function SectionTitle({ text }: { text: string }) {
  return (
    <p className="mt-5 text-base font-extrabold leading-6 text-white">
      {text}
    </p>
  );
}

function SectionText({ text }: { text: string }) {
  return (
    <p className="mt-2 text-sm leading-6 text-white/95">
      {text}
    </p>
  );
}

export default function HowItWorksPage() {
  const { t } = useI18n();

  return (
    <main className="fixed bottom-[4.2rem] left-1/2 top-[8.6rem] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col overflow-hidden px-4">
      <Link
        href="/welcome"
        className="mb-1 mt-1 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/90"
      >
        <span aria-hidden="true">←</span>
        <span>{t("common.goBack")}</span>
      </Link>

      <h1 className="sticky top-0 z-10 shrink-0 bg-[#031d3b] py-1 text-left text-3xl font-extrabold tracking-tight">
        {t("howItWorks.title")}
      </h1>

      <section className="relative mt-3 min-h-0 flex-1 overflow-y-auto pb-2 pr-1">
        <div className="float-left mb-2 mr-4 w-[44%] min-w-[140px] max-w-[220px]">
          <Image
            src="/bear.png"
            alt="Codemotion Bear"
            width={220}
            height={260}
            className="h-auto w-full object-contain"
            priority
          />
        </div>

        <SectionTitle text={t("howItWorks.sectionHowWorksTitle")} />
        <SectionText text={t("howItWorks.sectionHowWorksBody")} />

        <SectionTitle text={t("howItWorks.sectionWhatIsTitle")} />
        <SectionText text={t("howItWorks.sectionWhatIsBody1")} />
        <SectionText text={t("howItWorks.sectionWhatIsBody2")} />
        <SectionText text={t("howItWorks.sectionWhatIsBody3")} />

        <SectionTitle text={t("howItWorks.sectionParticipateTitle")} />
        <SectionText text={`- ${t("howItWorks.sectionParticipateItem1")}`} />
        <SectionText text={`- ${t("howItWorks.sectionParticipateItem2")}`} />
        <SectionText text={`- ${t("howItWorks.sectionParticipateItem3")}`} />
        <SectionText text={`- ${t("howItWorks.sectionParticipateItem4")}`} />

        <SectionTitle text={t("howItWorks.sectionWinnerTitle")} />
        <SectionText text={t("howItWorks.sectionWinnerIntro")} />
        <SectionText text={`- ${t("howItWorks.sectionWinnerItem1")}`} />
        <SectionText text={`- ${t("howItWorks.sectionWinnerItem2")}`} />
        <SectionText text={`- ${t("howItWorks.sectionWinnerItem3")}`} />
        <SectionText text={t("howItWorks.sectionWinnerNote")} />

        <SectionTitle text={t("howItWorks.sectionPrizeTitle")} />
        <SectionText text={t("raffle.description")} />
        <SectionText text={t("howItWorks.sectionPrizeIntro")} />
        <SectionText text={t("howItWorks.sectionPrizeBody")} />

        <SectionTitle text={t("howItWorks.sectionConditionsTitle")} />
        <SectionText text={`- ${t("howItWorks.sectionConditionsItem1")}`} />
        <SectionText text={`- ${t("howItWorks.sectionConditionsItem2")}`} />
        <SectionText text={`- ${t("howItWorks.sectionConditionsItem3")}`} />
        <SectionText text={`- ${t("howItWorks.sectionConditionsItem4")}`} />
        <SectionText text={`- ${t("howItWorks.sectionConditionsItem5")}`} />

        <SectionTitle text={t("howItWorks.sectionTransparencyTitle")} />
        <SectionText text={t("howItWorks.sectionTransparencyItem1")} />
        <SectionText text={t("howItWorks.sectionTransparencyItem2")} />
        <SectionText text={t("howItWorks.sectionTransparencyItem3")} />

        <SectionTitle text={t("howItWorks.sectionDataTitle")} />
        <SectionText text={t("howItWorks.sectionDataBody")} />
      </section>
    </main>
  );
}

