"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import UpsertDayDialog from "./upsert-day-dialog";
import { useEarningsContext } from "../context/earning.provider";

interface CreateEarningButtonProps {
  userCanRegisterDay: boolean;
}

export default function CreateEarningButton({
  userCanRegisterDay,
}: CreateEarningButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { refetch } = useEarningsContext();

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={!userCanRegisterDay}
        aria-label={
          userCanRegisterDay
            ? "Registrar ganhos do dia"
            : "Limite do plano atingido"
        }
        className="size-10 lg:w-fit"
      >
        <PlusIcon className="size-4 shrink-0" />
        <span className="hidden text-sm font-medium lg:inline">
          Registrar ganhos do dia
        </span>
      </Button>
      <UpsertDayDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSuccess={refetch}
      />
    </>
  );
}
