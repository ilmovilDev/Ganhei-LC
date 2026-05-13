export const headingVariants = {
  xs: "text-sm sm:text-base font-semibold tracking-tight",
  sm: "text-lg sm:text-xl font-semibold tracking-tight",
  md: "text-xl sm:text-2xl font-semibold tracking-tight",
  lg: "text-2xl sm:text-3xl font-bold tracking-tight",
  xl: "text-3xl sm:text-4xl font-bold tracking-tight",
} as const;

export const textVariants = {
  sm: "text-xs sm:text-sm",
  md: "text-sm sm:text-base",
  lg: "text-base sm:text-lg",
} as const;

export const textMuted = "text-muted-foreground";

export const textError = "text-destructive";
