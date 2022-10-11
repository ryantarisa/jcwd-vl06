export const toCurrency = (data) => {
  const locale = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumSignificantDigits: 9,
  });
  return locale.format(data);
};
