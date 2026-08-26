"use client";

import { useRef } from "react";
import { ArrowRightIcon } from "@kyo8/ui";

const DRAG_THRESHOLD = 6;

interface DragState {
  startX: number;
  startScrollLeft: number;
  pointerId: number;
  dragging: boolean;
}

export default function Carousel({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);

  function scrollByAmount(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    drag.current = {
      startX: e.clientX,
      startScrollLeft: trackRef.current?.scrollLeft ?? 0,
      pointerId: e.pointerId,
      dragging: false,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = trackRef.current;
    const state = drag.current;
    if (!el || !state) return;
    const delta = e.clientX - state.startX;

    // Only commit to a drag gesture past a small threshold, so a plain click
    // on a card still fires normally instead of being swallowed by pointer capture.
    if (!state.dragging) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return;
      state.dragging = true;
      el.setPointerCapture(state.pointerId);
    }
    el.scrollLeft = state.startScrollLeft - delta;
  }

  function endDrag() {
    const el = trackRef.current;
    const state = drag.current;
    if (state?.dragging && el?.hasPointerCapture(state.pointerId)) {
      el.releasePointerCapture(state.pointerId);
    }
    drag.current = null;
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-2 active:cursor-grabbing sm:px-8"
      >
        {children}
      </div>

      <div className="mt-3 flex justify-end gap-2 px-6 sm:px-8">
        <button
          type="button"
          onClick={() => scrollByAmount(-1)}
          aria-label="Previous"
          className="flex h-8 w-8 items-center justify-center border border-border-strong text-fg-muted transition-colors hover:border-fg hover:text-fg cursor-pointer"
        >
          <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => scrollByAmount(1)}
          aria-label="Next"
          className="flex h-8 w-8 items-center justify-center border border-border-strong text-fg-muted transition-colors hover:border-fg hover:text-fg cursor-pointer"
        >
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
