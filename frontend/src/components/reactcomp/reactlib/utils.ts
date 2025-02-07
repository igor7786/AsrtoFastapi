import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { atom } from 'nanostores';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const count = atom(0);
export const err = atom('');
