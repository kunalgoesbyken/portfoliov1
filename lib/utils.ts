import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export const formatDate = (date: string) => DATE_FORMAT.format(new Date(date));

export const toIsoDate = (value: unknown) => {
  const date = value instanceof Date ? value : new Date(typeof value === "string" ? value : NaN);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
};
