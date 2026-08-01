import { type SVGProps } from "react";

/**
 * Criska "CK" mark — open C + chevron K + cyan node.
 * Vector (transparent, resolution-independent). Strokes use currentColor so the
 * mark is ink on light / white on dark; the node stays Pulse Cyan.
 */
export function CKMark({
  className,
  pulse = false,
  ...props
}: SVGProps<SVGSVGElement> & { pulse?: boolean }) {
  return (
    <svg
      viewBox="0 0 116 96"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Criska"
      className={className}
      {...props}
    >
      {/* C — open circle facing right */}
      <path
        d="M68 24 A34 34 0 1 0 68 72"
        fill="none"
        stroke="currentColor"
        strokeWidth={13}
        strokeLinecap="round"
      />
      {/* K — chevron, using the C's edge as its spine */}
      <path
        d="M104 18 L74 48 L104 78"
        fill="none"
        stroke="currentColor"
        strokeWidth={13}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* node */}
      <circle cx="46" cy="48" r="7" fill="#43BFC7" className={pulse ? "animate-node" : undefined} />
    </svg>
  );
}

/** Compact monogram alias (favicon / small spaces). */
export function Monogram(props: SVGProps<SVGSVGElement> & { pulse?: boolean }) {
  return <CKMark {...props} />;
}

/** Horizontal lockup — CK mark + CRISKA wordmark. Inherits color from parent. */
export function LogoLockup({
  className = "",
  markClassName = "h-7 w-auto",
  pulse = true,
}: {
  className?: string;
  markClassName?: string;
  pulse?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <CKMark className={markClassName} pulse={pulse} />
      <span className="text-[19px] font-semibold uppercase leading-none tracking-[0.2em]">
        Criska
      </span>
    </span>
  );
}

/** Backward-compatible export used by existing imports. */
export function Wordmark({ className, pulse }: { className?: string; pulse?: boolean }) {
  return <LogoLockup className={className} pulse={pulse} />;
}
