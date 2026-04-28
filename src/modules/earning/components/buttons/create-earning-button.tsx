"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import UpsertEarningsDialog from "../dialog/upsert-earning-dialog";
import { CreateEarningButtonProps } from "@/modules/interfaces/buttons/create-earning-button.interface";

export default function CreateEarningButton({
  userCanRegisterDay,
}: CreateEarningButtonProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setDialogIsOpen(true)}
        disabled={!userCanRegisterDay}
        size="icon"
        aria-label={
          userCanRegisterDay ? "Adicionar receita" : "Limite do plano atingido"
        }
        className="size-9 md:h-10 md:w-auto md:gap-2 md:px-3"
      >
        <PlusIcon />

        {/* 👇 Texto solo en md+ */}
        <span className="hidden md:inline">Nova receita</span>
      </Button>

      <UpsertEarningsDialog isOpen={dialogIsOpen} setIsOpen={setDialogIsOpen} />
    </>
  );
}
