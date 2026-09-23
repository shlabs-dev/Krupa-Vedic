"use client";
export function OmIcon({ size = 30, color = "var(--gold)" }) {
  return (
    <svg viewBox="0 0 60 60" fill={color} style={{ width: size, height: size }}>
      <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fontSize="40" fontFamily="serif">ॐ</text>
    </svg>
  );
}
