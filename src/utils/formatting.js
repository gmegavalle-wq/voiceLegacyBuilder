export const formatDuration = (seconds) => {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const rest = String(safeSeconds % 60).padStart(2, '0');
  return `${minutes}:${rest}`;
};

export const shortDate = (isoDate) => {
  if (!isoDate) return 'Sin fecha';
  return new Date(isoDate).toLocaleDateString();
};
