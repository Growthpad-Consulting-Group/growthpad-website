"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import HTMLFlipBook from "react-pageflip";
import { Icon } from "@iconify/react";
import CtaButton from "@/shared/components/CtaButton";

const MAX_PAGES = 80;

const Page = forwardRef<HTMLDivElement, { src: string }>(function Page(
  { src },
  ref,
) {
  return (
    <div ref={ref} className="bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full object-contain" />
    </div>
  );
});

export default function PdfViewerModal({
  open,
  onClose,
  fileUrl,
  title,
  year,
}: {
  open: boolean;
  onClose: () => void;
  fileUrl: string;
  title?: string;
  year?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pages, setPages] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const loadedForUrl = useRef<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);

  // Mount / unmount with fade
  useEffect(() => {
    if (!open) return;
    setMounted(true);
    document.body.style.overflow = "hidden";
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(raf);
      setVisible(false);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open || !mounted) return;
    const t = setTimeout(() => setMounted(false), 400);
    return () => clearTimeout(t);
  }, [open, mounted]);

  // Load PDF
  useEffect(() => {
    if (!open || loadedForUrl.current === fileUrl) return;

    let cancelled = false;
    setPages(null);
    setError(null);
    setCurrentPage(0);

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error(`Couldn't fetch the PDF (${res.status}).`);
        const buffer = await res.arrayBuffer();

        const doc = await pdfjs.getDocument({ data: buffer }).promise;
        const pageCount = Math.min(doc.numPages, MAX_PAGES);
        const images: string[] = [];

        for (let i = 1; i <= pageCount; i++) {
          if (cancelled) return;
          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas isn't supported here.");
          await page.render({ canvas, canvasContext: ctx, viewport }).promise;
          images.push(canvas.toDataURL("image/jpeg", 0.85));
        }

        if (!cancelled) {
          loadedForUrl.current = fileUrl;
          setPages(images);
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Couldn't load the PDF.");
      }
    })();

    return () => { cancelled = true; };
  }, [open, fileUrl]);

  const flipPrev = useCallback(() => bookRef.current?.pageFlip()?.flipPrev(), []);
  const flipNext = useCallback(() => bookRef.current?.pageFlip()?.flipNext(), []);
  const zoomIn  = useCallback(() => setZoom((z) => Math.min(z + 0.25, 2)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(z - 0.25, 0.5)), []);
  const resetZoom = useCallback(() => setZoom(1), []);

  const playFlipSound = useCallback(() => {
    try {
      const audio = new Audio("/sounds/page-turn-2.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {/* autoplay blocked — silently skip */});
    } catch {
      // Audio not available
    }
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Use the title as filename, falling back to the last path segment
      const filename = title
        ? `${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`
        : fileUrl.split("/").pop() ?? "download.pdf";
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab if fetch fails
      window.open(fileUrl, "_blank");
    }
  }, [fileUrl, title]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")  flipPrev();
      if (e.key === "ArrowRight") flipNext();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open, onClose, flipPrev, flipNext, zoomIn, zoomOut, resetZoom]);

  const totalPages   = pages?.length ?? 0;
  const isFirst      = currentPage === 0;
  const isLast       = totalPages > 0 && currentPage >= totalPages - 2;
  const showInstructions = isFirst && pages !== null;

  // Page label: "1 – 2 / 24"
  const pageLabel = totalPages > 0
    ? `${currentPage + 1}${currentPage + 1 < totalPages ? ` – ${currentPage + 2}` : ""} / ${totalPages}`
    : "";

  if (!mounted) return null;

  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

  return createPortal(
    <div
      style={{ transitionTimingFunction: ease, transitionDuration: "1200ms" }}
      className={`fixed inset-0 z-70 flex flex-col bg-secondary transition-all ${
        visible ? "scale-100 opacity-100" : "scale-98 opacity-0"
      }`}
    >
      {/* ── Top bar ── */}
      <div className="relative flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6">
        {/* Title + year */}
        <div className="flex min-w-0 flex-col">
          {title && (
            <span className="font-display truncate text-sm font-bold text-white sm:text-base">
              {title}
            </span>
          )}
          {year && (
            <span className="text-xs capitalize text-white/40">Publication year: {year}</span>
          )}
        </div>

        {/* Zoom controls — center */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= 0.5}
            aria-label="Zoom out"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            <Icon icon="solar:magnifer-zoom-out-broken" width={18} height={18} />
          </button>
          <button
            type="button"
            onClick={resetZoom}
            aria-label="Reset zoom"
            className="min-w-12 rounded-lg px-2 py-1 text-center text-xs font-semibold text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= 2}
            aria-label="Zoom in"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            <Icon icon="solar:magnifer-zoom-in-broken" width={18} height={18} />
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            aria-label="Download PDF"
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon icon="solar:download-broken" width={18} height={18} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Book area ── */}
      <div className="relative flex flex-1 overflow-hidden">
        {error && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-white/70">{error}</p>
          </div>
        )}

        {!error && !pages && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-white/70">
            <div className="border-primary h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" />
            <p>Loading document…</p>
          </div>
        )}

        {pages && pages.length > 0 && (
          <>
            {/* Instruction overlay on the left half (first spread only) */}
            <div
              aria-hidden={!showInstructions}
              className={`pointer-events-none absolute inset-y-0 left-0 z-10 flex w-1/2 flex-col items-start justify-center gap-8 px-10 transition-opacity duration-500 xl:px-16 ${
                showInstructions ? "opacity-100" : "opacity-0"
              }`}
            >
              {title && (
                <div className="flex flex-col gap-1">
                  <h2 className="font-display text-2xl font-bold leading-snug text-white xl:text-3xl">
                    {title}
                  </h2>
                  {year && (
                    <p className="text-sm capitalize text-white/40">Publication year: {year}</p>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                  How to read
                </p>
                <ul className="flex flex-col gap-3">
                  <li className="flex items-center gap-3 text-sm text-white/70">
                    <Icon icon="solar:cursor-broken" width={16} height={16} className="shrink-0 text-white/50" />
                    <span>Click the page edge to flip</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/70">
                    <Icon icon="solar:transfer-horizontal-broken" width={16} height={16} className="shrink-0 text-white/50" />
                    <span>Swipe left / right on touch</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/70">
                    <Icon icon="solar:keyboard-broken" width={16} height={16} className="shrink-0 text-white/50" />
                    <span>
                      <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">←</kbd>
                      {" / "}
                      <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">→</kbd>
                      {" arrow keys"}
                    </span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/70">
                    <Icon icon="solar:magnifer-zoom-in-broken" width={16} height={16} className="shrink-0 text-white/50" />
                    <span>
                      <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">+</kbd>
                      {" / "}
                      <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">−</kbd>
                      {" to zoom"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pointer-events-auto">
                <CtaButton
                  onClick={handleDownload}
                  size="sm"
                  circleClassName="bg-white text-secondary"
                >
                  Download PDF
                </CtaButton>
              </div>
            </div>

            {/* Flip book — zoom via CSS scale on a wrapper */}
            <div
              className="flex flex-1 items-center justify-center overflow-hidden"
              onMouseDown={() => setDragging(true)}
              onMouseUp={() => setDragging(false)}
              onMouseLeave={() => setDragging(false)}
            >
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: "transform 0.2s ease",
                  cursor: dragging ? "grabbing" : "grab",
                }}
              >
                <HTMLFlipBook
                  ref={bookRef}
                  width={480}
                  height={640}
                  size="fixed"
                  minWidth={320}
                  maxWidth={640}
                  minHeight={420}
                  maxHeight={860}
                  showCover
                  className="shadow-2xl"
                  style={{}}
                  startPage={0}
                  drawShadow
                  flippingTime={700}
                  usePortrait={false}
                  startZIndex={0}
                  autoSize={false}
                  maxShadowOpacity={0.5}
                  mobileScrollSupport
                  clickEventForward
                  useMouseEvents
                  swipeDistance={30}
                  showPageCorners
                  disableFlipByClick={false}
                  onFlip={(e: { data: number }) => {
                    setCurrentPage(e.data);
                    playFlipSound();
                  }}
                >
                  {pages.map((src, i) => (
                    <Page key={i} src={src} />
                  ))}
                </HTMLFlipBook>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Bottom bar ── */}
      {pages && pages.length > 0 && (
        <div className="flex h-14 shrink-0 items-center justify-between border-t border-white/10 px-4 sm:px-6">
          {/* Prev */}
          <button
            type="button"
            onClick={flipPrev}
            disabled={isFirst}
            aria-label="Previous page"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Icon icon="solar:alt-arrow-left-broken" width={16} height={16} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Page counter */}
          <span className="text-sm text-white/50">{pageLabel}</span>

          {/* Next */}
          <button
            type="button"
            onClick={flipNext}
            disabled={isLast}
            aria-label="Next page"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <span className="hidden sm:inline">Next</span>
            <Icon icon="solar:alt-arrow-right-broken" width={16} height={16} />
          </button>
        </div>
      )}
    </div>,
    document.body,
  );
}
