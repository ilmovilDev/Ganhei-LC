"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Apps } from "@/constants/apps";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyInput } from "@/components/schared/inputs/currency-input";
import { FormAlert } from "@/components/schared/form/form-alert";
import { useUpsertEarningForm } from "../../hooks/use-upsert-day-form";
import { UpsertEarningsDialogProps } from "@/modules/interfaces/dialog/upsert-earning-dialog.props";
import { toast } from "sonner";

export default function UpsertEarningsDialog({
  isOpen,
  setIsOpen,
  dayId,
}: UpsertEarningsDialogProps) {
  const mode = dayId ? "update" : "create";

  const {
    form,
    fieldArray,
    apps,
    selectedApps,
    total,
    isValidDate,
    handleSubmit,
    isPending,
  } = useUpsertEarningForm({
    dayId,
    onSuccess: () => {
      toast.success(
        mode === "update"
          ? "Receita atualizada com sucesso"
          : "Receita registrada com sucesso",
      );

      setIsOpen(false);
    },
    onError: (error) => {
      const e = error as { message?: string };

      toast.error(e.message ?? "Erro inesperado");
    },
  });

  const { fields, append, remove } = fieldArray;
  const date = form.getValues("date");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle>
            {mode === "update"
              ? "Editar receita do dia"
              : "Registrar receita do dia"}
          </DialogTitle>

          <DialogDescription>
            {mode === "update"
              ? "Atualize valores, aplicativos e detalhes deste dia."
              : "Adicione os ganhos do dia para acompanhar seu desempenho."}
          </DialogDescription>
        </DialogHeader>

        {/* TOTAL */}
        <div className="bg-muted/40 rounded-xl border p-4">
          <p className="text-muted-foreground text-xs">Total do dia</p>
          <p className="text-2xl font-semibold text-green-600">
            R$ {total.toFixed(2)}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DATA */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full justify-between"
                >
                  {isValidDate
                    ? format(date, "PPP", { locale: ptBR })
                    : "Selecionar data"}

                  <CalendarIcon className="h-4 w-4 opacity-70" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  locale={ptBR}
                  selected={date}
                  onSelect={(value) =>
                    value &&
                    form.setValue("date", value, {
                      shouldValidate: true,
                    })
                  }
                  disabled={(d) => d > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 gap-4">
            {/* HOURS */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Horas trabalhadas</label>

              <Input
                type="number"
                placeholder="Ex: 8"
                {...form.register("hours", {
                  valueAsNumber: true,
                })}
              />
            </div>

            {/* KM */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quilômetros</label>

              <Input
                type="number"
                placeholder="Ex: 120"
                {...form.register("kilometers", {
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>

          {/* APPS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Aplicativos</label>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => append({ name: "", amount: 0 })}
              >
                + Adicionar
              </Button>
            </div>

            {/* EMPTY STATE */}
            {fields.length === 0 && (
              <div className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
                Nenhum aplicativo adicionado ainda.
                <br />
                Clique em <strong>Adicionar</strong> para começar.
              </div>
            )}

            {/* LIST */}
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Select
                  value={apps[index]?.name || ""}
                  onValueChange={(value) =>
                    form.setValue(`apps.${index}.name`, value, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="App" />
                  </SelectTrigger>

                  <SelectContent>
                    {Apps.map((app) => {
                      const isSelected = selectedApps.includes(app.value);

                      const isCurrent = apps[index]?.name === app.value;

                      return (
                        <SelectItem
                          key={app.value}
                          value={app.value}
                          disabled={isSelected && !isCurrent}
                        >
                          {app.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <CurrencyInput
                  value={apps[index]?.amount || 0}
                  onChange={(val) =>
                    form.setValue(`apps.${index}.amount`, val, {
                      shouldValidate: true,
                    })
                  }
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>

          {/* ERROR */}
          <FormAlert message={form.formState.errors.root?.message} />

          {/* SUBMIT */}
          <Button
            type="submit"
            disabled={!form.formState.isValid || isPending}
            className="w-full"
          >
            {isPending
              ? "Salvando..."
              : mode === "update"
                ? `Atualizar • R$ ${total.toFixed(2)}`
                : `Salvar • R$ ${total.toFixed(2)}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
