// Format Date
export const formatDate = (tanggal: string, waktu?: string) => {
  const date = new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (!waktu) return date;
  return `${date} pukul ${waktu}`;
};

const formatDateZero = (angka: number) => angka.toString().padStart(2, "0");
export const formatDateReport = (date: Date) => {
  const dd = formatDateZero(date.getDate());
  const mm = formatDateZero(date.getMonth() + 1);
  const yy = date.getFullYear().toString().slice(-2);

  return `${dd}/${mm}/${yy}`;
};

export const createDate = (date: Date) => {
  if (!date) return "";
  return `${date.getFullYear()}-${formatDateZero(date.getMonth() + 1)}-${formatDateZero(
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

  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return "kemarin";
  return `${diffDays} hari lalu`;
};

export const filterNamaBarang = (value: string) => {
  return value.replace(/[^a-zA-Z0-9&() ]/g, "");
};
