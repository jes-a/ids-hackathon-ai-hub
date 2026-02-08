import * as React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

type IconFactory = (props: IconProps) => JSX.Element;

const baseProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const createIcon = (children: React.ReactNode, viewBox = '0 0 24 24'): IconFactory => {
  const Icon = (props: IconProps) => (
    <svg viewBox={viewBox} aria-hidden="true" {...baseProps} {...props}>
      {children}
    </svg>
  );

  return Icon;
};

export const MessageSquare = createIcon(
  <>
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="M8 18l-4 4v-4" />
  </>
);

export const Upload = createIcon(
  <>
    <path d="M12 16V6" />
    <path d="M8 10l4-4 4 4" />
    <path d="M4 20h16" />
  </>
);

export const BookOpen = createIcon(
  <>
    <path d="M3 6h7a3 3 0 0 1 3 3v11H6a3 3 0 0 0-3 3V6z" />
    <path d="M21 6h-7a3 3 0 0 0-3 3v11h7a3 3 0 0 1 3 3V6z" />
  </>
);

export const Code2 = createIcon(
  <>
    <path d="M8 8l-4 4 4 4" />
    <path d="M16 8l4 4-4 4" />
    <path d="M12 6l-2 12" />
  </>
);

export const Palette = createIcon(
  <>
    <path d="M12 3a9 9 0 1 0 0 18h3a2 2 0 0 0 0-4h-2a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3h4" />
    <circle cx="7.5" cy="10" r="1" />
    <circle cx="9" cy="6.5" r="1" />
    <circle cx="12.5" cy="5" r="1" />
  </>
);

export const BarChart3 = createIcon(
  <>
    <path d="M4 20V10" />
    <path d="M10 20V4" />
    <path d="M16 20v-7" />
    <path d="M22 20V8" />
  </>
);

export const Shield = createIcon(
  <>
    <path d="M12 3l8 4v6c0 4-3.5 7-8 8-4.5-1-8-4-8-8V7l8-4z" />
  </>
);

export const Activity = createIcon(
  <>
    <path d="M3 12h4l2-4 4 8 2-4h4" />
  </>
);

export const TrendingUp = createIcon(
  <>
    <path d="M3 17l7-7 4 4 7-7" />
    <path d="M14 7h7v7" />
  </>
);

export const TrendingDown = createIcon(
  <>
    <path d="M3 7l7 7 4-4 7 7" />
    <path d="M21 17h-7v-7" />
  </>
);

export const Sun = createIcon(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M4.9 4.9l1.4 1.4" />
    <path d="M17.7 17.7l1.4 1.4" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M4.9 19.1l1.4-1.4" />
    <path d="M17.7 6.3l1.4-1.4" />
  </>
);

export const Moon = createIcon(
  <>
    <path d="M21 12.6A8.5 8.5 0 0 1 11.4 3a7 7 0 1 0 9.6 9.6z" />
  </>
);

export const ChevronDown = createIcon(<path d="M6 9l6 6 6-6" />);

export const LogOut = createIcon(
  <>
    <path d="M10 17l-1 4 4-1" />
    <path d="M14 7l5 5-5 5" />
    <path d="M19 12H9" />
    <path d="M5 4h4" />
    <path d="M5 20h4" />
  </>
);

export const Github = createIcon(
  <>
    <path d="M12 2a10 10 0 0 0-3 19.5" />
    <path d="M12 2a10 10 0 0 1 3 19.5" />
    <path d="M9 18v-3" />
    <path d="M15 18v-3" />
    <path d="M8 12c-1 2-3 2-3 2" />
    <path d="M16 12c1 2 3 2 3 2" />
  </>
);

export const Figma = createIcon(
  <>
    <path d="M9 2h3a3 3 0 0 1 0 6H9V2z" />
    <path d="M9 8h3a3 3 0 0 1 0 6H9V8z" />
    <path d="M9 14h3a3 3 0 0 1-3 6v-6z" />
    <path d="M9 8H6a3 3 0 0 0 0 6h3" />
  </>
);

export const FileCode = createIcon(
  <>
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5z" />
    <path d="M14 2v5h5" />
    <path d="M9 13l-2 2 2 2" />
    <path d="M15 13l2 2-2 2" />
  </>
);

export const Send = createIcon(
  <>
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </>
);

export const Sparkles = createIcon(
  <>
    <path d="M12 3l1.6 3.6L17 8l-3.4 1.4L12 13l-1.6-3.6L7 8l3.4-1.4L12 3z" />
    <path d="M5 14l0.8 1.8L8 16.6l-2.2 0.8L5 19l-0.8-1.6L2 16.6l2.2-0.8L5 14z" />
  </>
);

export const ThumbsUp = createIcon(
  <>
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </>
);

export const ThumbsDown = createIcon(
  <>
    <path d="M10 14h5a3 3 0 0 0 3-3V6H9" />
    <path d="M9 6H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3" />
    <path d="M10 14v5a2 2 0 0 0 4 0v-5" />
  </>
);

export const Calendar = createIcon(
  <>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <path d="M3 10h18" />
  </>
);

export const Minus = createIcon(<path d="M5 12h14" />);

export const AlertCircle = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4" />
    <path d="M12 16h0.01" />
  </>
);

export const CheckCircle = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12l2.5 2.5L16 9" />
  </>
);

export const CheckCircle2 = CheckCircle;

export const MessageCircle = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 16l-2 3v-4" />
  </>
);

export const Clock = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </>
);

export const Users = createIcon(
  <>
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="10" r="2.5" />
    <path d="M4 20c0-3 3-5 6-5" />
    <path d="M14 20c0-2.5 2.5-4 5-4" />
  </>
);

export const Layers = createIcon(
  <>
    <path d="M12 3l8 4-8 4-8-4 8-4z" />
    <path d="M4 11l8 4 8-4" />
    <path d="M4 15l8 4 8-4" />
  </>
);

export const AlertTriangle = createIcon(
  <>
    <path d="M12 3l9 16H3l9-16z" />
    <path d="M12 9v4" />
    <path d="M12 17h0.01" />
  </>
);

export const XCircle = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9l6 6" />
    <path d="M15 9l-6 6" />
  </>
);

export const FileImage = createIcon(
  <>
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5z" />
    <path d="M14 2v5h5" />
    <circle cx="9" cy="10" r="1.5" />
    <path d="M7 18l4-4 3 3 3-2 3 3" />
  </>
);

export const AlertTriangleFill = AlertTriangle;
