import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates the number of years since a given date
 * Used for dynamic company age calculation (founded 2006-01-01)
 */
export function getYearsSinceDate(date: Date): number {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 365.25);
}

/**
 * Get company experience years (dynamically calculated from founding date)
 * Company founded: January 1, 2006
 */
export function getCompanyYears(): number {
  return getYearsSinceDate(new Date(2006, 0, 1));
}
