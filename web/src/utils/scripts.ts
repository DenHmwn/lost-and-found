export const filterNotelp = (value: string) => {
  return value.replace(/[^0-9]/g, "");
};
export const filterNamaBarang = (value: string) => {
  return value.replace(/[^a-zA-Z0-9&() ]/g, "");
};

export const filterLokasi = (value: string) => {
  return value.replace(/[^a-zA-Z0-9\s.,()\-/#&]/g, "");
};

