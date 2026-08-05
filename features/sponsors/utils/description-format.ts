export type DescriptionInlinePart =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "link"; href: string; label?: string };

export type DescriptionBlock =
  | { type: "paragraph"; parts: DescriptionInlinePart[] }
  | { type: "bullet"; parts: DescriptionInlinePart[] }
  | { type: "spacer" };

/** `((url))` o `(([texto], [url]))` (texto visible + destino). */
const INLINE_TOKEN_REGEX = /(\(\((?:[\s\S]*?)\)\))|\[[^\]]+?\]/g;

const LABELED_LINK_INNER =
  /^\s*\[([^\]]+)\]\s*,\s*\[([^\]]+)\]\s*$/;

function parseInlineParts(text: string): DescriptionInlinePart[] {
  INLINE_TOKEN_REGEX.lastIndex = 0;
  const parts: DescriptionInlinePart[] = [];
  let lastIndex = 0;
  let match = INLINE_TOKEN_REGEX.exec(text);

  while (match) {
    const token = match[0];
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, matchIndex) });
    }

    if (token.startsWith("((") && token.endsWith("))")) {
      const inner = token.slice(2, -2).trim();
      const labeled = LABELED_LINK_INNER.exec(inner);
      if (labeled) {
        const label = labeled[1].trim();
        const href = labeled[2].trim();
        if (label && href) {
          parts.push({ type: "link", href, label });
        }
      } else if (inner) {
        parts.push({ type: "link", href: inner });
      }
    } else if (token.startsWith("[") && token.endsWith("]")) {
      parts.push({ type: "bold", value: token.slice(1, -1) });
    } else {
      parts.push({ type: "text", value: token });
    }

    lastIndex = matchIndex + token.length;
    match = INLINE_TOKEN_REGEX.exec(text);
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  return parts;
}

function normalizeLineBreaks(input: string): string {
  return input
    .replace(/\(\\n\)/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n");
}

export function formatSponsorDescription(input: string): DescriptionBlock[] {
  const normalized = normalizeLineBreaks(input ?? "");
  const lines = normalized.split("\n");
  const blocks: DescriptionBlock[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      blocks.push({ type: "spacer" });
      continue;
    }

    const segments = trimmedLine.split("(p)");
    segments.forEach((segment, segmentIndex) => {
      const content = segment.trim();
      if (!content) {
        return;
      }

      const parts = parseInlineParts(content);
      const isBullet = segmentIndex > 0;
      blocks.push({
        type: isBullet ? "bullet" : "paragraph",
        parts,
      });
    });
  }

  return blocks;
}

