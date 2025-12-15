export const normalizeDateUTC = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

export const timeToMinutes = (t) => {
  const [hh, mm] = String(t).split(":").map(Number);
  return hh * 60 + mm;
};

export const minutesToTime = (m) => {
  const hh = String(Math.floor(m / 60)).padStart(2, "0");
  const mm = String(m % 60).padStart(2, "0");
  return `${hh}:${mm}`;
};

export const overlaps = (s1, e1, s2, e2) => s1 < e2 && e1 > s2;
