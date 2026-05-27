"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DayListItemDto } from "@/modules/earnings/application/dtos/day-list-item.dto";
import DayForm from "../forms/day-form";

interface Props {
  open: boolean;
  onOpenChange(open: boolean): void;
  day?: DayListItemDto;
}

export default function UpsertDayDialog({ open, onOpenChange, day }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar dia</DialogTitle>

          <DialogDescription>
            Adicione os ganhos do seu dia de trabalho.
          </DialogDescription>
        </DialogHeader>

        <DayForm
          dayId={day?.id}
          defaultValues={day}
          onSuccess={async () => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
