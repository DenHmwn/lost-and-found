// Format Date
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
export const formatDateReport = (date: Date) => {
  const dd = pad(date.getDate());
  const mm = pad(date.getMonth() + 1);
  const yy = date.getFullYear().toString().slice(-2);

  return `${dd}/${mm}/${yy}`;
};

const pad = (n: number) => n.toString().padStart(2, "0");
export const createDate = (date: Date) => {
  if (!date) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
};

export const filterNotelp = (value: string) => {
  return value.replace(/[^0-9]/g, "");
};

// Format time ago
export const formatTimeAgo = (date: string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} menit sebelum`;
  if (diffHours < 24) return `${diffHours} jam sebelum`;
  if (diffDays === 1) return "1 hari sebelum";
  return `${diffDays} hari lalu`;
};

export const filterNamaBarang = (value: string) => {
  return value.replace(/[^a-zA-Z0-9&() ]/g, "");
};
