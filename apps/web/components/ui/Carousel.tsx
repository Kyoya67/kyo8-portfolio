"use client";

import { useRef } from "react";

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

    </div>
  );
}
