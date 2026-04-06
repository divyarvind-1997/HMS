import { BreakPeriod, TimeHHmm } from '../app/models/appointment.model';

export function toMinutes(t: TimeHHmm): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function toHHmm(min: number): TimeHHmm {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
}

export function normalizeBreaks(breaks: BreakPeriod[]): { start: number; end: number }[] {
  return (breaks ?? [])
    .map(b => ({ start: toMinutes(b.start), end: toMinutes(b.end) }))
    .sort((x, y) => x.start - y.start);
}

/** Generates [start,end) slot ranges in minutes */
export function generateSlots(
  startTime: TimeHHmm,
  endTime: TimeHHmm,
  slotMinutes: number,
  breaks: BreakPeriod[]
): { start: TimeHHmm; end: TimeHHmm }[] {
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  const br = normalizeBreaks(breaks);

  const slots: { start: TimeHHmm; end: TimeHHmm }[] = [];
  let cursor = start;

  while (cursor + slotMinutes <= end) {
    const s = cursor;
    const e = cursor + slotMinutes;

    const inBreak = br.some(b => overlaps(s, e, b.start, b.end));
    if (!inBreak) {
      slots.push({ start: toHHmm(s), end: toHHmm(e) });
    }
    cursor += slotMinutes;
  }

  return slots;
}