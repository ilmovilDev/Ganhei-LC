import { cn } from "@/lib/utils";
import { textVariants } from "@/tokens/typography.token";

type TextProps = {
  children: React.ReactNode;
  size?: keyof typeof textVariants;
  className?: string;
};

export function Text({ children, size = "md", className }: TextProps) {
  return <p className={cn(textVariants[size], className)}>{children}</p>;
}
