import type { Location } from "./types";

export function parseHours(range: string): { opens: string; closes: string } | null {
  const match = range.match(/(\d{1,2}[:.]\d{2})\s*[-–]\s*(\d{1,2}[:.]\d{2})/);
  if (!match) return null;
  return { opens: match[1].replace(".", ":"), closes: match[2].replace(".", ":") };
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function getRigaNow(now: Date): { weekday: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Riga",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return { weekday, minutes: hour * 60 + minute };
}

/**
 * Whether a location is currently open, based on its stored hours text and
 * the real current time in Europe/Riga (not the visitor's local time).
 * Returns null when the stored hours text can't be parsed — callers should
 * treat that the same as "unknown" and just not show a badge.
 */
export function getLocationOpenStatus(location: Location, now: Date = new Date()): boolean | null {
  const { weekday, minutes } = getRigaNow(now);
  const isWeekend = weekday === "Saturday" || weekday === "Sunday";
  const range = parseHours(isWeekend ? location.hours_weekend : location.hours_weekdays);
  if (!range) return null;

  const opens = toMinutes(range.opens);
  let closes = toMinutes(range.closes);
  if (closes <= opens) closes += 24 * 60; // overnight hours, not currently used but safe to handle

  return minutes >= opens && minutes < closes;
}
