import TimeSelect from "@/components/schared/select/time-select";

interface HeaderMonthSelectorProps {
  month?: string;
}

export default function HeaderMonthSelector({
  month,
}: HeaderMonthSelectorProps) {
  return <TimeSelect month={month} />;
}
