"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import DayForm from "./day-form";

import { useEarningsContext } from "../../providers/earning-provider";

import { DayListItemDto } from "@/modules/earnings/application/dtos/day-list-item.dto";

interface Props {
  open: boolean;
  onOpenChange(open: boolean): void;
  day?: DayListItemDto;
}

export default function UpsertDayDialog({ open, onOpenChange, day }: Props) {
  const { refetch } = useEarningsContext();

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
          mode={day ? "update" : "create"}
          dayId={day?.id}
          initialData={day}
          onSuccess={async () => {
            await refetch();
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
