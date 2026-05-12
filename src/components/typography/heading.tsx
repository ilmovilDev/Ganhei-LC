import { cn } from "@/lib/utils";
import { headingVariants } from "@/tokens/typography.token";

type HeadingProps = {
  children: React.ReactNode;
  size?: keyof typeof headingVariants;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
};

export function Heading({
  children,
  size = "md",
  as: Component = "h2",
  className,
}: HeadingProps) {
  return (
    <Component className={cn(headingVariants[size], className)}>
      {children}
    </Component>
  );
}
