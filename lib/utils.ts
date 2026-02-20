import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const interpolateColor = (val: number) => {
  const r = Math.round(59 + (val / 100) * (139 - 59));
  const g = Math.round(130 + (val / 100) * (92 - 130));
  const b = Math.round(246 + (val / 100) * (246 - 246));
  return `rgb(${r}, ${g}, ${b})`;
};
