import { type SVGProps } from "react";

/** Service icons — line icons, currentColor stroke (theme-aware), one accent dot. */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  xmlns: "http://www.w3.org/2000/svg",
} as const;

const A = "var(--accent)";

export const icons: Record<string, (p: IconProps) => React.ReactElement> = {
  ai: (p) => (
    <svg {...base} {...p}>
      <rect x="4" y="7" width="16" height="12" rx="3" />
      <path d="M12 7V4M9 12h.01M15 12h.01" />
      <path d="M8 16h8" />
      <circle cx="12" cy="3.2" r="1.2" fill={A} stroke="none" />
    </svg>
  ),
  cloud: (p) => (
    <svg {...base} {...p}>
      <path d="M7 18a4 4 0 010-8 5 5 0 019.6 1.5A3.5 3.5 0 0116 18z" />
      <circle cx="12" cy="14.5" r="1.1" fill={A} stroke="none" />
    </svg>
  ),
  security: (p) => (
    <svg {...base} {...p}>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9.5 12l1.8 1.8L15 10" stroke={A} />
    </svg>
  ),
  code: (p) => (
    <svg {...base} {...p}>
      <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" />
      <path d="M13 6l-2 12" stroke={A} />
    </svg>
  ),
  mobile: (p) => (
    <svg {...base} {...p}>
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M11 18h2" />
      <circle cx="12" cy="7" r="1" fill={A} stroke="none" />
    </svg>
  ),
  product: (p) => (
    <svg {...base} {...p}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
      <circle cx="12" cy="12" r="1.2" fill={A} stroke="none" />
    </svg>
  ),
  data: (p) => (
    <svg {...base} {...p}>
      <path d="M5 19V10M10 19V5M15 19v-6M20 19v-9" />
      <circle cx="10" cy="5" r="1.3" fill={A} stroke="none" />
    </svg>
  ),
  devops: (p) => (
    <svg {...base} {...p}>
      <path d="M4 12a8 8 0 018-8M20 12a8 8 0 01-8 8" />
      <path d="M12 4l2.5 2L12 8M12 20l-2.5-2L12 16" />
      <circle cx="12" cy="12" r="1.5" fill={A} stroke="none" />
    </svg>
  ),
  digital: (p) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 010 16M8 8l8 8M16 8l-8 8" opacity="0.5" />
      <circle cx="12" cy="12" r="1.4" fill={A} stroke="none" />
    </svg>
  ),
  infra: (p) => (
    <svg {...base} {...p}>
      <rect x="4" y="4" width="16" height="5" rx="1.5" />
      <rect x="4" y="15" width="16" height="5" rx="1.5" />
      <path d="M8 6.5h.01M8 17.5h.01" />
      <circle cx="16" cy="6.5" r="1" fill={A} stroke="none" />
    </svg>
  ),
  enterprise: (p) => (
    <svg {...base} {...p}>
      <path d="M4 20V7l6-3v16M10 20h10V11l-6-2" />
      <path d="M7 9h.01M7 13h.01M14 13h.01M14 16h.01" />
      <circle cx="17" cy="13" r="1" fill={A} stroke="none" />
    </svg>
  ),
  staffing: (p) => (
    <svg {...base} {...p}>
      <circle cx="8" cy="8" r="3" />
      <path d="M2.5 19a5.5 5.5 0 0111 0" />
      <circle cx="17" cy="9" r="2" fill={A} stroke="none" />
      <path d="M14.5 19a4.5 4.5 0 016.8-3.9" />
    </svg>
  ),
  bpo: (p) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="12" cy="12" r="0.8" fill={A} stroke="none" />
    </svg>
  ),
  consulting: (p) => (
    <svg {...base} {...p}>
      <path d="M12 3a6 6 0 00-3 11.2V17h6v-2.8A6 6 0 0012 3z" />
      <path d="M9.5 20h5M10 17v3M14 17v3" />
      <circle cx="12" cy="9" r="1.2" fill={A} stroke="none" />
    </svg>
  ),
  managed: (p) => (
    <svg {...base} {...p}>
      <path d="M12 3l1.8 1.6 2.4-.3.6 2.3 2 1.3-1 2.2 1 2.2-2 1.3-.6 2.3-2.4-.3L12 21l-1.8-1.6-2.4.3-.6-2.3-2-1.3 1-2.2-1-2.2 2-1.3.6-2.3 2.4.3z" />
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="12" cy="12" r="0.8" fill={A} stroke="none" />
    </svg>
  ),
};

export function ServiceIcon({ name, ...props }: IconProps & { name: string }) {
  const Comp = icons[name] ?? icons.consulting;
  return <Comp {...props} />;
}
