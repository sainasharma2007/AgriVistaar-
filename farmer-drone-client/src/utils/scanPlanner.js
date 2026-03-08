// src/utils/scanPlanner.js
import { differenceInCalendarDays, parseISO } from "date-fns";
import { cropScanWindows } from "./cropScanWindows";

export function getScanStatusForField(field) {
  const today = new Date();

  let sowing;
  try {
    sowing = parseISO(String(field.sowingDateIso));
  } catch {
    return {
      daysSinceSowing: 0,
      currentWindow: null,
      nextWindow: null,
      daysUntilNext: null,
      scanDueNow: false,
      scansDone: field.scanHistory?.length ?? 0,
      totalRecommended: 3,
    };
  }

  const daysSinceSowing = differenceInCalendarDays(today, sowing);
  const windows = cropScanWindows[field.cropKey] || [];

  const currentWindow = windows.find(
    (w) => daysSinceSowing >= w.start && daysSinceSowing <= w.end
  );
  const nextWindow = windows.find((w) => daysSinceSowing < w.start);
  const daysUntilNext = nextWindow ? nextWindow.start - daysSinceSowing : null;

  const scansDone = field.scanHistory?.length ?? 0;
  const totalRecommended = 3;

  return {
    daysSinceSowing,
    currentWindow,   // now has .labelKey instead of .label
    nextWindow,      // same here
    daysUntilNext,
    scanDueNow: Boolean(currentWindow),
    scansDone,
    totalRecommended,
  };
}



