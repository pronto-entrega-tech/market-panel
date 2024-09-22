export const templeteMask =
  (value: string) =>
  (strings: TemplateStringsArray, ...quantities: number[]) =>
    quantities.reduce<[number, string]>(
      ([lastQ, lastV], q, i) => [
        lastQ + q,
        lastV + value.slice(lastQ, lastQ + q) + strings[i + 1],
      ],
      [0, strings[0]],
    )[1];

export const digitsMask = (raw = "") => raw.replace(/\D/g, "");

export const integerMask = (raw = "") => `${+digitsMask(raw)}`;

export const decimalMask = (raw = "", decimalPlaces = 2) => {
  const v = integerMask(raw).padStart(decimalPlaces + 1, "0");

  const negativeDP = decimalPlaces * -1;
  return `${v.slice(0, negativeDP)},${v.slice(negativeDP)}`;
};

export const CNPJMask = (raw = "") =>
  templeteMask(digitsMask(raw))`${2}.${3}.${3}/${4}-${2}`.replace(/\D*$/g, "");
