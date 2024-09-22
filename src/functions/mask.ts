const createDigitsMask =
  (template: TemplateStringsArray, ...quantities: number[]) =>
  (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    let v = "";

    let lastQuantity = 0;
    const get = (quantity: number) => {
      lastQuantity += quantity;
      return digits.slice(lastQuantity - quantity, lastQuantity);
    };

    template.forEach((text, index) => {
      const quantity = quantities[index - 1] ?? 0;
      const digit = get(quantity);
      const decorator = lastQuantity >= digits.length ? "" : text;

      v += digit + decorator;
    });
    return v;
  };

export const digitsMask = (raw = "") => raw.replace(/\D/g, "");

export const integerMask = (raw = "") => `${+digitsMask(raw)}`;

export const decimalMask = (raw = "", decimalPlaces = 2) => {
  const v = integerMask(raw).padStart(decimalPlaces + 1, "0");

  const negativeDP = decimalPlaces * -1;
  return `${v.slice(0, negativeDP)},${v.slice(negativeDP)}`;
};

export const CNPJMask = createDigitsMask`${2}.${3}.${3}/${4}-${2}`;
