"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { Spinner } from "@/components/ui/spinner";
import { useAuthSession } from "@/features/auth/client/auth-session-context";
import {
  completeQuiz,
  prepareQuiz,
} from "@/features/scans/client/scans-api";
import { useUserScans } from "@/features/scans/hooks/use-user-scans";
import type {
  PreparedQuiz,
  QrPayload,
  QuizAnswerResult,
  QuizResult,
} from "@/features/scans/types";
import { useSponsorDetails } from "@/features/sponsors/hooks/use-sponsor-details";

const SCANNER_ELEMENT_ID = "room-qr-reader";

function parseQrPayload(decodedText: string): QrPayload {
  let raw: unknown;
  try {
    raw = JSON.parse(decodedText);
  } catch {
    throw new Error("Invalid QR payload.");
  }

  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid QR payload.");
  }

  const candidate = raw as { v?: unknown; token?: unknown };
  if (
    candidate.v !== 1 ||
    typeof candidate.token !== "string" ||
    candidate.token.trim().length === 0
  ) {
    throw new Error("Invalid QR payload.");
  }

  return { v: 1, token: candidate.token.trim() };
}

export default function RoomChallengePage() {
  const params = useParams<{ id: string }>();
  const roomId = params.id;
  const { isAuthenticated } = useAuthSession();
  const { item: room, loading: roomLoading, error: roomError } =
    useSponsorDetails(roomId);
  const {
    items: completedScans,
    scannedSponsorIds,
    loading: scansLoading,
    error: scansError,
    refresh: refreshScans,
  } = useUserScans(isAuthenticated);

  const [preparedQuiz, setPreparedQuiz] = useState<PreparedQuiz | null>(null);
  const [qrPayload, setQrPayload] = useState<QrPayload | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const handlingRef = useRef(false);

  const isCompleted = scannedSponsorIds.has(roomId);
  const completedScan = completedScans.find((scan) => scan.sponsorId === roomId);
  const canStartScanner =
    !roomLoading &&
    !scansLoading &&
    room !== null &&
    !isCompleted &&
    preparedQuiz === null &&
    result === null;

  useEffect(() => {
    if (!canStartScanner) return;

    let unmounted = false;
    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;

    async function stopScanner() {
      const current = scannerRef.current;
      if (!current) return;
      try {
        if (current.isScanning) await current.stop();
      } catch {
        // Cleanup errors do not affect the quiz.
      }
      try {
        await current.clear();
      } catch {
        // Cleanup errors do not affect the quiz.
      }
      scannerRef.current = null;
    }

    async function onScanSuccess(decodedText: string) {
      if (handlingRef.current || unmounted) return;
      handlingRef.current = true;
      setProcessing(true);
      setError(null);

      try {
        const parsed = parseQrPayload(decodedText);
        const quiz = await prepareQuiz({ roomId, qr: parsed });
        if (unmounted) return;
        await stopScanner();
        setQrPayload(parsed);
        setPreparedQuiz(quiz);
        setAnswers({});
      } catch (scanError) {
        setError(
          scanError instanceof Error
            ? scanError.message
            : "Unexpected error during QR scan.",
        );
        handlingRef.current = false;
        void refreshScans();
      } finally {
        if (!unmounted) setProcessing(false);
      }
    }

    void scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        () => undefined,
      )
      .catch((cameraError) => {
        setError(
          cameraError instanceof Error
            ? cameraError.message
            : "Could not start the camera.",
        );
      });

    return () => {
      unmounted = true;
      void stopScanner();
    };
  }, [canStartScanner, refreshScans, roomId]);

  const allAnswered = useMemo(
    () =>
      preparedQuiz !== null &&
      preparedQuiz.questions.every((question) => question.id in answers),
    [answers, preparedQuiz],
  );

  async function submitAnswers(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!preparedQuiz || !qrPayload || !allAnswered || processing) return;

    setProcessing(true);
    setError(null);
    try {
      const completed = await completeQuiz({
        roomId,
        qr: qrPayload,
        answers: preparedQuiz.questions.map((question) => ({
          questionId: question.id,
          answer: answers[question.id],
        })),
      });
      setResult(completed);
      await refreshScans();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not submit the answers.",
      );
      void refreshScans();
    } finally {
      setProcessing(false);
    }
  }

  if (roomLoading || scansLoading) {
    return (
      <main className="flex min-h-[calc(100vh-13.8rem)] items-center justify-center">
        <Spinner className="h-10 w-10 border-[3px]" />
      </main>
    );
  }

  if (!room) {
    return <StatusPage title="Room" message={roomError ?? "Room not found."} />;
  }

  const resolvedError = roomError ?? scansError ?? error;

  return (
    <main className="fixed bottom-[4.2rem] left-1/2 top-[8.6rem] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col overflow-hidden px-4">
      <Link
        href="/welcome"
        className="mb-1 mt-1 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/90"
      >
        <span aria-hidden="true">←</span>
        <span>Go back</span>
      </Link>
      <h1 className="shrink-0 py-1 text-left text-3xl font-extrabold tracking-tight">
        {room.name}
      </h1>

      <section className="mt-3 min-h-0 flex-1 overflow-y-auto pb-4 pr-1">
        {resolvedError ? (
          <p className="mb-4 rounded-lg bg-red-950/35 px-3 py-2 text-center text-[#ff9d9d]">
            {resolvedError}
          </p>
        ) : null}

        {result ? (
          <div className="flex min-h-[24rem] flex-col items-center gap-5 pb-4 text-center">
            <Image src="/check.png" alt="Completed" width={72} height={72} />
            <p className="text-2xl font-extrabold">
              You earned {result.pointsEarned} {result.pointsEarned === 1 ? "point" : "points"} out of {result.maximumPoints} possible.
            </p>
            <QuizAnswerResults results={result.answerResults} />
            <Link
              href="/welcome"
              className="rounded-[0.55rem] bg-[#ff5b00] px-6 py-3 font-bold text-white"
            >
              Back to rooms
            </Link>
          </div>
        ) : isCompleted ? (
          <RoomExplanation
            name={room.name}
            description={room.description}
            imageUrl={room.imageUrl}
            answerResults={completedScan?.answerResults ?? []}
          />
        ) : preparedQuiz ? (
          <div className="flex flex-col gap-5">
            <RoomDescription
              name={room.name}
              description={room.description}
              imageUrl={room.imageUrl}
            />
            <form onSubmit={submitAnswers} className="flex flex-col gap-5">
              {preparedQuiz.questions.map((question, index) => (
                <fieldset
                  key={question.id}
                  className="rounded-xl border border-white/15 bg-white/5 p-4"
                >
                  <legend className="px-1 text-base font-bold">
                    {index + 1}. {question.text}
                  </legend>
                  <div className="mt-3 flex gap-5">
                    {[true, false].map((value) => (
                      <label key={String(value)} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={String(value)}
                          checked={answers[question.id] === value}
                          onChange={() =>
                            setAnswers((current) => ({
                              ...current,
                              [question.id]: value,
                            }))
                          }
                          className="h-5 w-5 accent-[#ff5b00]"
                        />
                        <span>{value ? "True" : "False"}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
              <button
                type="submit"
                disabled={!allAnswered || processing}
                className="relative h-12 rounded-[0.55rem] bg-[#ff5b00] text-base font-bold text-white disabled:opacity-45"
              >
                {processing ? <Spinner /> : "Submit"}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex min-h-[25rem] flex-col items-center justify-center gap-4">
            <p className="text-center text-xl font-extrabold">Scan the QR code</p>
            <div className="relative h-[18rem] w-full max-w-[18rem] overflow-hidden rounded-2xl border border-white/20 bg-black/25 p-2">
              <div id={SCANNER_ELEMENT_ID} className="h-full w-full rounded-xl" />
              {processing ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                  <Spinner className="h-10 w-10 border-[3px]" />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function RoomExplanation({
  name,
  description,
  imageUrl,
  answerResults,
}: {
  name: string;
  description: string;
  imageUrl: string;
  answerResults: QuizAnswerResult[];
}) {
  return (
    <div className="text-sm leading-6 text-white/95">
      <RoomDescription name={name} description={description} imageUrl={imageUrl} />
      <div className="clear-both mt-6 rounded-xl border border-white/15 bg-white/5 p-4 text-center font-bold">
        Your answers have already been submitted.
      </div>
      <QuizAnswerResults results={answerResults} />
    </div>
  );
}

function RoomDescription({
  name,
  description,
  imageUrl,
}: {
  name: string;
  description: string;
  imageUrl: string;
}) {
  return (
    <div className="overflow-hidden text-sm leading-6 text-white/95">
      {imageUrl ? (
        <div className="float-left mb-3 mr-4 flex aspect-square w-1/3 min-w-[96px] max-w-[150px] items-center justify-center rounded-xl bg-white p-3">
          <Image
            src={imageUrl}
            alt={name}
            width={150}
            height={150}
            unoptimized
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : null}
      <p className="whitespace-pre-wrap">{description}</p>
    </div>
  );
}

function QuizAnswerResults({ results }: { results: QuizAnswerResult[] }) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-3 text-left">
      <h2 className="text-lg font-extrabold">Question results</h2>
      {results.map((answer, index) => (
        <div
          key={answer.questionId}
          className={`rounded-xl border p-4 ${
            answer.isCorrect
              ? "border-emerald-300/35 bg-emerald-950/25"
              : "border-red-300/35 bg-red-950/25"
          }`}
        >
          <p className="text-sm leading-6">
            {index + 1}. {answer.questionText}
          </p>
          <p
            className={`mt-2 text-sm font-extrabold ${
              answer.isCorrect ? "text-emerald-300" : "text-[#ff9d9d]"
            }`}
          >
            {answer.isCorrect ? "✓ Correct" : "✕ Incorrect"}
          </p>
        </div>
      ))}
    </div>
  );
}

function StatusPage({ title, message }: { title: string; message: string }) {
  return (
    <main className="fixed bottom-[4.2rem] left-1/2 top-[8.6rem] z-10 flex w-full max-w-[30rem] -translate-x-1/2 flex-col px-4">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      <p className="mt-4 text-[#ff9d9d]">{message}</p>
    </main>
  );
}
