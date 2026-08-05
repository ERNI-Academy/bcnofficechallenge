"use client";

import { useEffect, useRef, useState } from "react";

type SingleLineFitTextProps = {
  text: string;
  className?: string;
  minFontSizePx?: number;
  maxFontSizePx?: number;
};

export function SingleLineFitText({
  text,
  className,
  minFontSizePx = 10,
  maxFontSizePx = 28,
}: SingleLineFitTextProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [fontSize, setFontSize] = useState(maxFontSizePx);

  useEffect(() => {
    function recalculate() {
      const wrapper = wrapperRef.current;
      const measure = measureRef.current;
      if (!wrapper || !measure) {
        return;
      }

      const availableWidth = wrapper.clientWidth;
      if (availableWidth <= 0) {
        return;
      }

      let nextSize = maxFontSizePx;
      measure.style.fontSize = `${nextSize}px`;

      while (measure.offsetWidth > availableWidth && nextSize > minFontSizePx) {
        nextSize -= 1;
        measure.style.fontSize = `${nextSize}px`;
      }

      setFontSize(nextSize);
    }

    recalculate();

    const observer = new ResizeObserver(() => {
      recalculate();
    });

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [maxFontSizePx, minFontSizePx, text]);

  return (
    <div ref={wrapperRef} className={className}>
      <span
        className="block whitespace-nowrap font-extrabold"
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.1 }}
      >
        {text}
      </span>
      <span
        ref={measureRef}
        aria-hidden
        className="invisible pointer-events-none fixed left-[-9999px] top-[-9999px] whitespace-nowrap font-extrabold"
      >
        {text}
      </span>
    </div>
  );
}

