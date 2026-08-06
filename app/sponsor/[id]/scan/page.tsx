import { redirect } from "next/navigation";

export default async function LegacyScanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/sponsor/${id}`);
}
