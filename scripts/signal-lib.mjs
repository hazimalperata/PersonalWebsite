// Pure helpers for the signal collector. No I/O.

/** Count commits per day from newline-separated YYYY-MM-DD lines (blank lines ignored). */
export function countByDay(gitLogDates) {
  const counts = {};
  for (const line of gitLogDates.split(/\r?\n/)) {
    const d = line.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) counts[d] = (counts[d] ?? 0) + 1;
  }
  return counts;
}

/** Build the SignalData shape: days sorted ascending, only { d, n }. */
export function toSignal(lanes, generatedAt) {
  return {
    generatedAt,
    lanes: lanes.map(({ id, counts }) => ({
      id,
      days: Object.entries(counts)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([d, n]) => ({ d, n })),
    })),
  };
}

/** True when at least one lane has at least one commit. Otherwise the collector must not write. */
export function hasCollectedData(lanes) {
  return lanes.some(({ counts }) => Object.values(counts).some((n) => n > 0));
}
