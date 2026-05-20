import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { financialColors } from "@/tokens/color-token";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, PlusIcon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { App } from "@/generated/prisma/enums";
import { FormAlert, CurrencyInput } from "@/components/shared";
import { parseDayDate } from "@/lib/date";
import { DayFormInput } from "../types";
import { Apps } from "../constants/apps-label";
import { useUpsertDay } from "../hooks/use-upsert-day";

interface UpsertDayDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  day?: DayFormInput | null;
  onSuccess?: () => void;
}

export default function UpsertDayDialog({
  isOpen,
  onOpenChange,
  day,
  onSuccess,
}: UpsertDayDialogProps) {
  const {
    mode,
    isUpdate,
    isPending,
    COPY,
    form,
    fields,
    earnings,
    date,
    total,
    selectedApps,
    append,
    remove,
    setApp,
    setAmount,
    setDate,
    handleSubmit,
    handleClose,
  } = useUpsertDay({
    day,
    isOpen,
    onOpenChange,
    onSuccess,
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (isPending) return;

        if (!open) {
          handleClose();
          return;
        }

        onOpenChange(open);
      }}
    >
      <DialogContent>
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {COPY[mode].title}
          </DialogTitle>

          <DialogDescription className="text-muted-foreground text-sm">
            {COPY[mode].description}
          </DialogDescription>
        </DialogHeader>

        {/* BODY */}
        <div className="space-y-4 overflow-y-auto">
          {/* TOTAL */}
          <div className="bg-muted/40 rounded-xl border px-4 py-3">
            <span className="text-muted-foreground block text-xs">
              Total do dia
            </span>

            <span
              className={cn(
                "text-3xl font-semibold tracking-tight",
                financialColors.positive.text,
              )}
            >
              R$ {total.toFixed(2)}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* DATE */}
            <div className={cn("space-y-2", isUpdate && "opacity-70")}>
              <label className="text-sm font-medium">Data</label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isUpdate}
                    className="h-11 w-full justify-between"
                  >
                    {date
                      ? format(parseDayDate(date), "PPP", {
                          locale: ptBR,
                        })
                      : "Selecionar data"}
                    <CalendarIcon className="h-4 w-4 opacity-60" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    locale={ptBR}
                    selected={date ? parseDayDate(date) : undefined}
                    disabled={(d) => {
                      if (isUpdate) return true;
                      const today = new Date();
                      today.setHours(23, 59, 59, 999);
                      return d > today;
                    }}
                    onSelect={(value) => {
                      if (!value || isUpdate) return;
                      setDate(value);
                    }}
                  />
                </PopoverContent>
              </Popover>

              {isUpdate && (
                <p className="text-muted-foreground text-xs">
                  A data não pode ser alterada após o registro
                </p>
              )}

              {form.formState.errors.date && (
                <p className="text-destructive text-xs">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>

            {/* HOURS + KM */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="hours" className="text-sm font-medium">
                  Horas trabalhadas
                </label>
                <Input
                  id="hours"
                  className="h-11"
                  type="number"
                  step="1"
                  min="1"
                  max="24"
                  placeholder="Ex: 8"
                  {...form.register("hours", { valueAsNumber: true })}
                />
                {form.formState.errors.hours && (
                  <p className="text-destructive text-xs">
                    {form.formState.errors.hours.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="kilometers" className="text-sm font-medium">
                  Quilometragem
                </label>
                <Input
                  id="kilometers"
                  className="h-11"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Ex: 120"
                  {...form.register("kilometers", { valueAsNumber: true })}
                />
                {form.formState.errors.kilometers && (
                  <p className="text-destructive text-xs">
                    {form.formState.errors.kilometers.message}
                  </p>
                )}
              </div>
            </div>

            {/* EARNINGS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Aplicativos</label>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={append}
                >
                  <PlusIcon className="mr-1 h-3.5 w-3.5" />
                  Adicionar
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
                  Nenhum aplicativo adicionado.
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, index) => {
                    const appError =
                      form.formState.errors.earnings?.[index]?.app;

                    const amountError =
                      form.formState.errors.earnings?.[index]?.amount;

                    return (
                      <div key={field.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          {/* APP */}
                          <div className="flex-1">
                            <Select
                              value={earnings[index]?.app ?? ""}
                              onValueChange={(value) =>
                                setApp(index, value as App)
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  "h-11 w-full",
                                  appError && "border-destructive",
                                )}
                              >
                                <SelectValue placeholder="Aplicativo" />
                              </SelectTrigger>

                              <SelectContent>
                                {Apps.map((app) => {
                                  const isSelected = selectedApps.includes(
                                    app.value,
                                  );

                                  const isCurrent =
                                    earnings[index]?.app === app.value;

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
                          </div>

                          {/* AMOUNT */}
                          <div className="flex-1">
                            <CurrencyInput
                              value={earnings[index]?.amount ?? 0}
                              onChange={(value) => setAmount(index, value)}
                            />
                          </div>

                          {/* REMOVE */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>

                        {(appError || amountError) && (
                          <div className="flex gap-2">
                            <div className="flex-1">
                              {appError && (
                                <p className="text-destructive text-xs">
                                  {appError.message}
                                </p>
                              )}
                            </div>

                            <div className="flex-1">
                              {amountError && (
                                <p className="text-destructive text-xs">
                                  {amountError.message}
                                </p>
                              )}
                            </div>

                            <div className="w-9 shrink-0" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {form.formState.errors.earnings?.root && (
                <p className="text-destructive text-xs">
                  {form.formState.errors.earnings.root.message}
                </p>
              )}
            </div>

            {/* SERVER ERROR */}
            <FormAlert message={form.formState.errors.root?.message} />

            {/* SUBMIT */}
            <Button
              type="submit"
              size="lg"
              disabled={!form.formState.isValid || isPending}
              className="h-12 w-full"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </span>
              ) : (
                `${COPY[mode].submit} • R$ ${total.toFixed(2)}`
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
