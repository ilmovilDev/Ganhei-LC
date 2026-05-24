"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import UpsertDayDialog from "./upsert-day-dialog";

interface Props {
  userCanRegisterDay: boolean;
}

export default function CreateDayButton({ userCanRegisterDay }: Props) {
  const [open, setOpen] = useState(false);

  if (!userCanRegisterDay) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
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

      <UpsertDayDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
