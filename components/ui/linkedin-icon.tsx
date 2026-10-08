import type { AnimatedIconProps } from "./types";

export default function LinkedinIcon({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className = "",
}: AnimatedIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`ai-li cursor-pointer ${className}`}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path className="ai-draw" pathLength={1} d="M8 11v5" />
      <path className="ai-draw" pathLength={1} d="M8 8v.01" />
      <path className="ai-draw" pathLength={1} d="M12 16v-5" />
      <path className="ai-draw" pathLength={1} d="M16 16v-3a2 2 0 1 0 -4 0" />
      <path
        className="ai-pulse"
        d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z"
      />
    </svg>
  );
}
