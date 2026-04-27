import TimeSelect from "@/components/schared/select/time-select";

interface DashboardHeaderProps {
  month?: string;
}

export default function DashboardHeader({ month }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex flex-col items-start">
        <h3>Dashboard</h3>
        <p>Controle ...</p>
      </div>
      <TimeSelect month={month} />
    </div>
  );
}
