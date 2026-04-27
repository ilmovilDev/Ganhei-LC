"use client";

import { useState } from "react";
import { CreateEarningButtonProps } from "@/modules/interfaces/earning/create-earning-button.props";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import UpsertEarningDialog from "../dialog/upsert-earning-dialog";

export default function CreateEarningButton({
  userCanRegisterDay,
}: CreateEarningButtonProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  return (
    <>
      <Button
        className="w-full md:w-fit"
        variant={"default"}
        size={"default"}
        disabled={!userCanRegisterDay}
        aria-label={
          userCanRegisterDay
            ? "Lançar receita"
            : "Você atingiu o limite de registros. Atualize seu plano para continuar lançando receitas."
        }
        onClick={() => setDialogIsOpen(true)}
      >
        <PlusIcon size={16} className="mr-2" />
        Nova receita
      </Button>

      <UpsertEarningDialog isOpen={dialogIsOpen} setIsOpen={setDialogIsOpen} />
    </>
  );
}
