import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (p: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  width: 16,
  height: 16,
  "aria-hidden": true,
  ...p,
});

export const IconGauge = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path d="m13.4 12.6 3.1-3.1" />
    <path d="M20.4 16A9.6 9.6 0 1 0 3.6 16" />
  </svg>
);

export const IconGrid = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
  </svg>
);

export const IconLayers = (p: P) => (
  <svg {...base(p)}>
    <path d="m12 3 8.5 4.6L12 12.2 3.5 7.6 12 3Z" />
    <path d="m3.5 12.4 8.5 4.6 8.5-4.6" />
    <path d="m3.5 16.8 8.5 4.6 8.5-4.6" />
  </svg>
);

export const IconSpark = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3v3.2M12 17.8V21M4.9 4.9l2.3 2.3M16.8 16.8l2.3 2.3M3 12h3.2M17.8 12H21M4.9 19.1l2.3-2.3M16.8 7.2l2.3-2.3" />
    <circle cx="12" cy="12" r="3.2" />
  </svg>
);

export const IconSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="10.6" cy="10.6" r="6.6" />
    <path d="m15.5 15.5 4.2 4.2" />
  </svg>
);

export const IconBell = (p: P) => (
  <svg {...base(p)}>
    <path d="M18 8.6a6 6 0 1 0-12 0c0 5-2 6.4-2 6.4h16s-2-1.4-2-6.4Z" />
    <path d="M10.3 19a2 2 0 0 0 3.4 0" />
  </svg>
);

export const IconMoon = (p: P) => (
  <svg {...base(p)}>
    <path d="M20 14.4A8.5 8.5 0 0 1 9.6 4a8.5 8.5 0 1 0 10.4 10.4Z" />
  </svg>
);

export const IconSun = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </svg>
);

export const IconChevron = (p: P) => (
  <svg {...base(p)}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const IconArrowUp = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 19V5" />
    <path d="m6 11 6-6 6 6" />
  </svg>
);

export const IconArrowDown = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14" />
    <path d="m6 13 6 6 6-6" />
  </svg>
);

export const IconDownload = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3v11" />
    <path d="m7.5 9.5 4.5 4.5 4.5-4.5" />
    <path d="M4 19h16" />
  </svg>
);

export const IconFilter = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 5.5h18l-7 8.2V21l-4-2.4v-4.9L3 5.5Z" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m4.5 12.5 4.8 4.8L19.5 6.9" />
  </svg>
);

export const IconX = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconExternal = (p: P) => (
  <svg {...base(p)}>
    <path d="M14 4h6v6" />
    <path d="M20 4 10.5 13.5" />
    <path d="M19 14v5a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4 19V7a1.5 1.5 0 0 1 1.5-1.5H10" />
  </svg>
);

export const IconCopy = (p: P) => (
  <svg {...base(p)}>
    <rect x="9" y="9" width="11" height="11" rx="2.2" />
    <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-6A3.5 3.5 0 0 0 3 6.5v6A2.5 2.5 0 0 0 5.5 15" />
  </svg>
);

export const IconBookmark = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3.8h12a1 1 0 0 1 1 1V21l-7-4.2L5 21V4.8a1 1 0 0 1 1-1Z" />
  </svg>
);

export const IconPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21v-6" />
    <path d="M9 3h6l-.8 5.2 3 2.9-.4 1.4H15l-1 2.5H10L9 12.5H6.2l-.4-1.4 3-2.9L9 3Z" />
  </svg>
);

export const IconMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 7h17M3.5 12h17M3.5 17h11" />
  </svg>
);

export const IconPanelLeft = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M9.5 4v16" />
  </svg>
);

export const IconShield = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3 5 6v5.5c0 4.4 3 7.6 7 9.5 4-1.9 7-5.1 7-9.5V6l-7-3Z" />
    <path d="m9 12 2.2 2.2L15.4 10" />
  </svg>
);

export const IconType = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 6.5V5h15v1.5" />
    <path d="M12 5v14" />
    <path d="M9 19h6" />
  </svg>
);

export const IconPalette = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.9-.8 1.9-1.8 0-1.4-1.3-1.6-1.3-2.9 0-1 .8-1.8 2-1.8H17a4 4 0 0 0 4-4C21 6.3 17 3 12 3Z" />
    <circle cx="8" cy="9.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="10" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconActivity = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 12h3.5L9 5.5l4 13L16 12h5" />
  </svg>
);

export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 7.6V12l3 1.8" />
  </svg>
);

export const IconCommand = (p: P) => (
  <svg {...base(p)}>
    <path d="M8.5 3A2.5 2.5 0 1 0 11 5.5v13a2.5 2.5 0 1 0 2.5-2.5h-13a2.5 2.5 0 1 0 2.5 2.5v-13A2.5 2.5 0 1 0 8.5 3Z" />
  </svg>
);

export const IconGitBranch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="6.5" cy="5.5" r="2.2" />
    <circle cx="6.5" cy="18.5" r="2.2" />
    <circle cx="17.5" cy="8.5" r="2.2" />
    <path d="M6.5 7.7v8.6" />
    <path d="M17.5 10.7c0 3-2.4 4.3-5 5.1" />
  </svg>
);

export const IconFile = (p: P) => (
  <svg {...base(p)}>
    <path d="M13.5 3H7a1.8 1.8 0 0 0-1.8 1.8v14.4A1.8 1.8 0 0 0 7 21h10a1.8 1.8 0 0 0 1.8-1.8V8.3L13.5 3Z" />
    <path d="M13.2 3.2v5.3h5.3" />
  </svg>
);

export const IconTerminal = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.2" />
    <path d="m7.5 9.5 2.6 2.6-2.6 2.6M12.8 14.7h3.7" />
  </svg>
);

export const IconImage = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.2" />
    <circle cx="8.5" cy="9.5" r="1.4" />
    <path d="m4 17 4.6-4.6a1.6 1.6 0 0 1 2.3 0L16 17.5" />
  </svg>
);

export const IconTarget = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.6" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconTrend = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 17.5 9 11l3.6 3.6L21 6.4" />
    <path d="M15.5 6.4H21v5.5" />
  </svg>
);

export const IconRefresh = (p: P) => (
  <svg {...base(p)}>
    <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
    <path d="M20.7 4v4.6h-4.6" />
  </svg>
);
