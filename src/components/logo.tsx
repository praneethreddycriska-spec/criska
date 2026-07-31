import { type SVGProps } from "react";

/**
 * Criska "Signal Node" wordmark — open C + single cyan node.
 * Letters use currentColor (theme-aware); the node is always Pulse Cyan.
 */
export function Wordmark({
  className,
  pulse = false,
  ...props
}: SVGProps<SVGSVGElement> & { pulse?: boolean }) {
  return (
    <svg
      viewBox="-6 10 188 44"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CRISKA"
      className={className}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M26.28 19.74 A16 16 0 1 0 26.28 44.26" />
        <g transform="translate(42,0)">
          <path d="M3.5 16 V48" />
          <path d="M3.5 16 H15 A8 8 0 0 1 15 32 H3.5" />
          <path d="M14 32 L24 48" />
        </g>
        <path transform="translate(76,0)" d="M3.5 16 V48" />
        <path
          transform="translate(93,0)"
          d="M17.5 19.5 A10 8 0 1 0 10 32 A10 8 0 1 1 2.5 44.5"
        />
        <g transform="translate(123,0)">
          <path d="M3.5 16 V48" />
          <path d="M19 16 L3.5 33.5" />
          <path d="M9.5 27 L20.5 48" />
        </g>
        <g transform="translate(154,0)">
          <path d="M0 48 L11 16 L22 48" />
          <path d="M4.8 37 H17.2" />
        </g>
      </g>
      <circle
        cx="32"
        cy="32"
        r="4.5"
        fill="var(--accent)"
        className={pulse ? "animate-node" : undefined}
      />
    </svg>
  );
}

/** Compact monogram — open C + node. */
export function Monogram({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Criska"
      className={className}
      {...props}
    >
      <path
        d="M44.86 16.68 A20 20 0 1 0 44.86 47.32"
        fill="none"
        stroke="currentColor"
        strokeWidth={9}
        strokeLinecap="round"
      />
      <circle cx="52" cy="32" r="5" fill="var(--accent)" />
    </svg>
  );
}
