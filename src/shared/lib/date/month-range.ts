export function monthRangeUTC(year: number, month: number) {
  return {
    from: new Date(Date.UTC(year, month - 1, 1)),

    to: new Date(Date.UTC(year, month, 1)),
  };
}
