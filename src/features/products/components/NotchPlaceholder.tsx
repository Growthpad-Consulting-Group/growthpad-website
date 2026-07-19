export default function NotchPlaceholder({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 455 232"
      preserveAspectRatio="xMidYMid meet"
      className={`h-auto w-full ${className}`}
      aria-hidden
    >
      <path
        d="M357.206 20C357.206 8.95431 348.252 0 337.206 0H20C8.95431 0 0 8.95432 0 20V193.663C0 204.709 8.95432 213.663 20 213.663H242.008C247.072 213.663 251.176 217.768 251.176 222.832C251.176 227.895 255.281 232 260.345 232H435C446.046 232 455 223.046 455 212V61.457C455 50.4114 446.046 41.457 435 41.457H377.206C366.16 41.457 357.206 32.5027 357.206 21.457V20Z"
        fill="#DADADA"
      />
    </svg>
  );
}
