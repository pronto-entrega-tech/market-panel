export const moneyString = (value?: string | number, prefix = 'R$') => {
  if (!value) return;

  return `${prefix}${(+value).toFixed(2).replace('.', ',')}`;
};

export const moneyNumber = (value?: string) => {
  if (!value) return;

  return +value.replace(',', '.');
};
