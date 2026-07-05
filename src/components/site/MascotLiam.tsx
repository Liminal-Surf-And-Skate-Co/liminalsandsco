import React from "react";

type Props = {
  size?: number;
  className?: string;
  title?: string;
};

export function MascotLiam({ size = 32, className = "", title = "Liam the Llama" }: Props) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      {/* Hoodie */}
      <rect x="6" y="20" width="52" height="34" rx="8" fill="#4C1D95" />
      <path d="M10 28c0-8 6-12 18-12s18 4 18 12" fill="#3A1370" opacity="0.9" />

      {/* Head */}
      <ellipse cx="32" cy="22" rx="12" ry="10" fill="#F3E9F8" />

      {/* Ears */}
      <path d="M22 12c-3 0-6 6-4 9" fill="#F3E9F8" />
      <path d="M42 12c3 0 6 6 4 9" fill="#F3E9F8" />

      {/* Sunglasses */}
      <rect x="20" y="18" width="8" height="6" rx="1.5" fill="#111" />
      <rect x="36" y="18" width="8" height="6" rx="1.5" fill="#111" />
      <rect x="28" y="20" width="8" height="2" fill="#111" />

      {/* Nose/mouth */}
      <path d="M28 26c1 1 3 1 4 0" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" />

      {/* Cheeks */}
      <circle cx="24" cy="24" r="1.6" fill="#FFD7E6" opacity="0.9" />
      <circle cx="40" cy="24" r="1.6" fill="#FFD7E6" opacity="0.9" />

      {/* Hoodie drawstring */}
      <path d="M24 30c2 4 6 4 8 0" stroke="#2B0B4A" strokeWidth="1.5" strokeLinecap="round" />

      {/* Sunglasses reflection */}
      <path d="M22 19.2c1-.6 2.2-.6 3.2 0" stroke="#6B6B6B" strokeWidth="0.7" strokeLinecap="round" />
      <path d="M38 19.2c1-.6 2.2-.6 3.2 0" stroke="#6B6B6B" strokeWidth="0.7" strokeLinecap="round" />

      {/* Hoodie shadow */}
      <path d="M6 34c6-8 18-12 26-12s20 4 26 12v6a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8v-6z" fill="#2B0B4A" opacity="0.08" />
    </svg>
  );
}
