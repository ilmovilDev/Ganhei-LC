export const isTwoDecimalNumber = (value: number) => {
  return Number(value.toFixed(2)) === value;
};
