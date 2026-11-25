import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export const formatDate = (date: string) => DATE_FORMAT.format(new Date(date));

const MONTH_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

const ISO_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

export const isIsoMonth = (value: unknown): value is string => typeof value === "string" && ISO_MONTH.test(value);

const formatMonth = (month: string) => MONTH_FORMAT.format(new Date(`${month}-01T00:00:00Z`));

export const formatPeriod = (start: string, end?: string) => {
  const from = formatMonth(start);
  const to = end ? formatMonth(end) : "Present";
  return from === to ? from : `${from} – ${to}`;
};

export const toIsoDate = (value: unknown) => {
  const date = value instanceof Date ? value : new Date(typeof value === "string" ? value : NaN);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
};

const COMPACT_NUMBER = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export const formatCompact = (value: number) => COMPACT_NUMBER.format(value);

const PLURAL_RULES = new Intl.PluralRules("en-US");

export const countOf = (count: number, singular: string, plural: string) =>
  `${count} ${PLURAL_RULES.select(count) === "one" ? singular : plural}`;

const LIST_FORMAT = new Intl.ListFormat("en-US", { type: "conjunction" });

export const formatList = (items: string[]) => LIST_FORMAT.format(items);
