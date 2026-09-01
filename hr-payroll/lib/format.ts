export type Locale = "en" | "th";

export function formatMoney(value: string | number | null | undefined, locale: Locale = "en") {
  if (value === null || value === undefined || value === "") return null;
  return new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function formatDate(value: string | Date, locale: Locale = "en") {
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(typeof value === "string" ? new Date(`${value}T00:00:00+07:00`) : value);
}

export function monthLabel(month: string, locale: Locale = "en") {
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${month.slice(0, 7)}-01T00:00:00Z`));
}

export function normalizeMonth(value: string) {
  return `${value.slice(0, 7)}-01`;
}

