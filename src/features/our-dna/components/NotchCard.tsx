interface NotchCardProps {
  title: string;
  description: string;
  className?: string;
}

export default function NotchCard({
  title,
  description,
  className = "",
}: NotchCardProps) {
  return (
    <svg
      viewBox="0 0 455 232"
      preserveAspectRatio="xMidYMid meet"
      className={`w-full h-auto ${className}`}
      role="img"
      aria-labelledby="card-title"
    >
      {/* Border */}
      <path
        d="M357.206 20C357.206 8.95431 348.252 0 337.206 0H20C8.95431 0 0 8.95432 0 20V193.663C0 204.709 8.95432 213.663 20 213.663H242.008C247.072 213.663 251.176 217.768 251.176 222.832C251.176 227.895 255.281 232 260.345 232H435C446.046 232 455 223.046 455 212V61.457C455 50.4114 446.046 41.457 435 41.457H377.206C366.16 41.457 357.206 32.5027 357.206 21.457V20Z"
        fill="none"
        stroke="#F05D23"
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
      />

      {/* Content */}
      <foreignObject x="32" y="28" width="391" height="176">
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          className="flex h-full items-start"
        >
          <div className="max-w-[320px]">
            <h3
              id="card-title"
              className="font-display text-secondary text-xl font-bold leading-tight sm:text-2xl"
            >
              {title}
            </h3>

            <p className="text-secondary/80 mt-6 text-sm leading-7 sm:text-base">
              {description}
            </p>
          </div>
        </div>
      </foreignObject>
    </svg>
  );
}
