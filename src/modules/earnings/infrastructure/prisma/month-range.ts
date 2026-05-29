interface MonthRangeParams {
  year: number;
  month: number;
}

export function monthRange({ year, month }: MonthRangeParams) {
  return {
    from: new Date(Date.UTC(year, month - 1, 1)),
    to: new Date(Date.UTC(year, month, 1)),
  };
}
