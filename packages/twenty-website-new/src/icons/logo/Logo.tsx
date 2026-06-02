interface LogoProps {
  size: number;
  fillColor: string;
  backgroundColor: string;
}

export function Logo({
  size,
  fillColor,
  backgroundColor,
}: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={40} height={40} rx={4} fill={backgroundColor} />
      <path
        d="M11 10h18v4H16.5v5H28v4H16.5v7H11V10z"
        fill={fillColor}
      />
    </svg>
  );
}
