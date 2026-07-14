export function Arrow({
  className,
  ...rest
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 108 108" className={className} {...rest}>
      <path
        fill="currentColor"
        d="M107.471 104.891L107.471 28.5115C107.471 12.774 94.7049 3.8147e-05 78.956 3.8147e-05L2.37449 3.8147e-05L2.37449 11.9292L78.956 11.9292C79.5273 11.9292 80.0922 11.9545 80.6496 12.0049C81.4516 12.0806 82.1376 12.6226 82.41 13.3793C82.6824 14.1359 82.4932 14.981 81.9232 15.5485C67.5804 29.8988 0 97.4259 0 97.4259C4.0239 99.9606 7.43246 103.378 9.94567 107.413L91.9118 25.5104C92.4843 24.9429 93.3342 24.7536 94.0959 25.0184C94.8575 25.2958 95.3934 25.9767 95.4729 26.7837C95.5195 27.3512 95.5498 27.9314 95.5498 28.5115L95.5498 104.891L107.471 104.891Z"
      />
    </svg>
  );
}

// Contrast arrows use .theme-fg so they automatically track the page's
// current light/dark theme (see globals.css + ScrollColorTransition) — no
// per-instance variant or registration needed.
export default function ArrowGroup({
  count = 3,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const colors = Array.from({ length: count }, (_, i) =>
    i % 2 === 0 ? "text-primary" : "theme-fg",
  );

  return (
    <div className={`flex items-center ${className}`}>
      {colors.map((color, i) => (
        <Arrow key={i} className={`ml-1.5 h-7 w-7 first:ml-0 ${color}`} />
      ))}
    </div>
  );
}
