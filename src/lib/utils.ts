import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PARAMETER_OPTIONS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function findOptionById(id: string) {
  for (const category of PARAMETER_OPTIONS) {
    const foundOption = category.options.find((option) => option.value === id);
    if (foundOption) {
      return foundOption;
    }
  }
  return null;
}
