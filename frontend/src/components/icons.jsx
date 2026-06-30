const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Icon({ children, size = 18, className = "", ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base} {...rest}>
      {children}
    </svg>
  );
}

export const Link2 = (p) => (
  <Icon {...p}>
    <path d="M10 14a4.5 4.5 0 0 0 6.3.4l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.6 1.5" />
    <path d="M14 10a4.5 4.5 0 0 0-6.3-.4l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.5-1.5" />
  </Icon>
);

export const Lock = (p) => (
  <Icon {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2.2" />
    <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
  </Icon>
);

export const EyeOff = (p) => (
  <Icon {...p}>
    <path d="M3 3l18 18" />
    <path d="M10.6 5.1A9.9 9.9 0 0 1 12 5c5 0 8.5 4 9.9 7-0.5 1.1-1.4 2.5-2.7 3.7M6.6 6.7C4.4 8.1 2.8 10 2.1 12c1.4 3 4.9 7 9.9 7 1.4 0 2.6-0.3 3.7-0.8" />
    <path d="M9.9 10a3 3 0 0 0 4.2 4.2" />
  </Icon>
);

export const Zap = (p) => (
  <Icon {...p}>
    <path d="M12.5 3 5 13.5h5.5L11 21l7.5-10.5H13z" />
  </Icon>
);

export const Search = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.3-4.3" />
  </Icon>
);

export const Hourglass = (p) => (
  <Icon {...p}>
    <path d="M6 3h12M6 21h12" />
    <path d="M7 3c0 4 3.2 6 5 8 1.8-2 5-4 5-8M7 21c0-4 3.2-6 5-8 1.8 2 5 4 5 8" />
  </Icon>
);

export const Ban = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M6.5 6.5l11 11" />
  </Icon>
);

export const Compass = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5 13 13l-4.5 2.5L11 11z" />
  </Icon>
);

export const BarChart = (p) => (
  <Icon {...p}>
    <path d="M5 20V10M12 20V4M19 20v-7" />
  </Icon>
);

export const Copy = (p) => (
  <Icon {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
  </Icon>
);

export const Trash = (p) => (
  <Icon {...p}>
    <path d="M4 7h16" />
    <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
    <path d="M9.5 7V4.5A1.5 1.5 0 0 1 11 3h2a1.5 1.5 0 0 1 1.5 1.5V7" />
  </Icon>
);

export const Pencil = (p) => (
  <Icon {...p}>
    <path d="M4 20l.9-4 10.5-10.5a2.1 2.1 0 0 1 3 3L7.9 19 4 20Z" />
  </Icon>
);

export const Power = (p) => (
  <Icon {...p}>
    <path d="M12 3v8" />
    <path d="M6.3 6.3a8 8 0 1 0 11.4 0" />
  </Icon>
);

export const Check = (p) => (
  <Icon {...p}>
    <path d="M4.5 12.5l5 5 10-11" />
  </Icon>
);

export const X = (p) => (
  <Icon {...p}>
    <path d="M5 5l14 14M19 5 5 19" />
  </Icon>
);

export const ChevronDown = (p) => (
  <Icon {...p}>
    <path d="M5.5 8.5 12 15l6.5-6.5" />
  </Icon>
);

export const ChevronLeft = (p) => (
  <Icon {...p}>
    <path d="M14.5 5 8 12l6.5 7" />
  </Icon>
);

export const User = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="8.2" r="3.4" />
    <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
  </Icon>
);

export const QrCode = (p) => (
  <Icon {...p}>
    <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2" />
    <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2" />
    <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2" />
    <path d="M14 14h3v3h-3zM20.5 14v3M14 20.5h3M20.5 17.5v3" />
  </Icon>
);

export const Plus = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const LogOut = (p) => (
  <Icon {...p}>
    <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
    <path d="M15 16l4-4-4-4" />
    <path d="M19 12H9" />
  </Icon>
);

export const Shield = (p) => (
  <Icon {...p}>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" />
  </Icon>
);

export const Globe = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
  </Icon>
);

export const Inbox = (p) => (
  <Icon {...p}>
    <path d="M4 13l2.5-7.5A1.5 1.5 0 0 1 7.9 4.5h8.2a1.5 1.5 0 0 1 1.4 1L20 13" />
    <path d="M4 13h4.7l1 2h4.6l1-2H20v4.5A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5Z" />
  </Icon>
);

export const TrendUp = (p) => (
  <Icon {...p}>
    <path d="M4 16l5.5-6 4 3.5L20 6" />
    <path d="M14.5 6H20v5.5" />
  </Icon>
);
