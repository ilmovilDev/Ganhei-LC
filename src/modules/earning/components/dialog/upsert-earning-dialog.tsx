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
import { cn } from "@/lib/utils";
import { Apps } from "../../constants/apps";

// ---------------------------------------------

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
          ? "Ganhos atualizados com sucesso"
          : "Ganhos registrados com sucesso",
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
      <DialogContent
        className={cn(
          "p-4 md:p-6", // 🔥 padding responsive
          "gap-0", // control manual de spacing
        )}
      >
        {/* HEADER */}
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg md:text-xl">
            {mode === "update" ? "Editar ganhos" : "Registrar ganhos"}
          </DialogTitle>

          <DialogDescription className="text-sm leading-relaxed">
            {mode === "update"
              ? "Atualize valores e aplicativos deste dia."
              : "Adicione seus ganhos para acompanhar seu desempenho."}
          </DialogDescription>
        </DialogHeader>

        {/* CONTENT WRAPPER */}
        <div className="mt-4 flex flex-col gap-6">
          {/* TOTAL */}
          <div className="bg-muted/40 rounded-xl border p-4 md:p-5">
            <p className="text-muted-foreground text-xs">Total</p>

            <p className="text-2xl font-semibold text-green-600 md:text-3xl">
              R$ {total.toFixed(2)}
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
            {/* DATA */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data</label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="h-10 w-full justify-between"
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
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Horas</label>

                <Input
                  className="h-10"
                  type="number"
                  placeholder="Ex: 8"
                  {...form.register("hours", {
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quilometragem</label>

                <Input
                  className="h-10"
                  type="number"
                  placeholder="Ex: 120"
                  {...form.register("kilometers", {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>

            {/* APPS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Aplicativos</label>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => append({ name: "", amount: 0 })}
                >
                  + Adicionar app
                </Button>
              </div>

              {/* EMPTY */}
              {fields.length === 0 && (
                <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
                  Nenhum aplicativo adicionado.
                  <br />
                  Adicione um app para registrar ganhos.
                </div>
              )}

              {/* LIST */}
              <div className="flex flex-col gap-2">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-2 md:gap-3"
                  >
                    <Select
                      value={apps[index]?.name || ""}
                      onValueChange={(value) =>
                        form.setValue(`apps.${index}.name`, value, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger className="h-10 w-32.5 md:w-37.5">
                        <SelectValue placeholder="Selecionar app" />
                      </SelectTrigger>

                      <SelectContent>
                        {Apps.map((app) => {
                          const isSelected = selectedApps.includes(app.value);
                          const isCurrent = apps[index]?.name === app.value;
                          const Icon = app.icon;

                          return (
                            <SelectItem
                              key={app.value}
                              value={app.value}
                              disabled={isSelected && !isCurrent}
                            >
                              <span className="text-muted-foreground">
                                <Icon className="text-muted-foreground size-4" />
                              </span>
                              <span>{app.label}</span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    <div className="min-w-0 flex-1">
                      <CurrencyInput
                        value={apps[index]?.amount || 0}
                        onChange={(val) =>
                          form.setValue(`apps.${index}.amount`, val, {
                            shouldValidate: true,
                          })
                        }
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remover aplicativo"
                      className="shrink-0"
                      onClick={() => remove(index)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* ERROR */}
            <FormAlert message={form.formState.errors.root?.message} />

            {/* SUBMIT */}
            <Button
              type="submit"
              size="lg"
              disabled={!form.formState.isValid || isPending}
              className="mt-2 h-11 w-full"
            >
              {isPending
                ? "Salvando..."
                : mode === "update"
                  ? `Atualizar ganhos • R$ ${total.toFixed(2)}`
                  : `Salvar ganhos • R$ ${total.toFixed(2)}`}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
