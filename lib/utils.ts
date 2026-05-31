import * as z from 'zod';
import { ZodError } from 'zod';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Function to save data to localStorage
export const saveToLocalStorage = (key: string, value: string) => {
  try {
    if (key) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      console.error('key required');
    }
  } catch (error) {
    console.error(error);
  }
};

// Function to get data from localStorage
export const getFromLS = (key: string) => {
  try {
    if (key) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } else {
      console.error('key required');
    }
  } catch (error) {
    console.error(error);
  }
};

export const formatZodErrors = (error: ZodError) => {
  const message = z.prettifyError(error);

  return message;
};
