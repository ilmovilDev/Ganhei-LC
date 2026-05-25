"use client";

import { useCallback, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { App } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { parseDayDate, toDayDate, todayDayDate } from "@/lib/date";
import { DayFormInput, dayFormSchema } from "../../../schemas/day.schema";
import { financialColors } from "@/tokens/color-token";
import { FormAlert } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createDayAction } from "../../../application/actions/create-day.action";
import { updateDayAction } from "../../../application/actions/update-day.action";
import EarningsFields from "./earning-fields";
import { toast } from "sonner";
import { useCreateDay } from "../../hooks/use-create-day";
import { useUpdateDay } from "../../hooks/use-update-day";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */
interface DayFormProps {
  dayId?: string;

  defaultValues?: Partial<DayFormInput>;

  onSuccess?: () => Promise<void> | void;
}

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */
const SET_VALUE_OPTIONS = {
  shouldDirty: true,
  shouldTouch: true,
  shouldValidate: true,
} as const;

const DEFAULT_VALUES: DayFormInput = {
  date: todayDayDate(),
  hours: 8,
  kilometers: 150,
  earnings: [],
};

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */
export default function DayForm({
  dayId,
  defaultValues,
  onSuccess,
}: DayFormProps) {
  const isUpdate = !!dayId;

  const form = useForm<DayFormInput>({
    resolver: zodResolver(dayFormSchema),

    defaultValues: {
      ...DEFAULT_VALUES,
      ...defaultValues,
    },
  });

  const createMutation = useCreateDay();

  const updateMutation = useUpdateDay();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const submitLabel = useMemo(() => {
    if (isPending) {
      return "Salvando...";
    }

    return isUpdate ? "Atualizar Registro" : "Criar Registro";
  }, [isPending, isUpdate]);

  /* ------------------------------------------------------------------------ */
  /* RESET FORM WHEN DATA CHANGES                                             */
  /* ------------------------------------------------------------------------ */
  useEffect(() => {
    if (!defaultValues) return;

    form.reset(defaultValues);
  }, [defaultValues, form]);

  /* ------------------------------------------------------------------------ */
  /* FIELD ARRAY                                                              */
  /* ------------------------------------------------------------------------ */
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "earnings",
  });

  /* ------------------------------------------------------------------------ */
  /* WATCHERS                                                                 */
  /* ------------------------------------------------------------------------ */
  const earnings = useWatch({
    control: form.control,
    name: "earnings",
    defaultValue: [],
  });

  const date = useWatch({
    control: form.control,
    name: "date",
  });

  /* ------------------------------------------------------------------------ */
  /* DERIVED STATE                                                            */
  /* ------------------------------------------------------------------------ */
  const total = useMemo(() => {
    return earnings.reduce(
      (sum, earning) => sum + Number(earning.amount ?? 0),

      0,
    );
  }, [earnings]);

  const selectedApps = useMemo(() => {
    return earnings
      .map((earning) => earning.app)
      .filter((app): app is App => app != null);
  }, [earnings]);

  /* ------------------------------------------------------------------------ */
  /* HELPERS                                                                  */
  /* ------------------------------------------------------------------------ */
  const clearRootError = useCallback(() => {
    form.clearErrors("root");
  }, [form]);

  /* ------------------------------------------------------------------------ */
  /* HANDLERS                                                                 */
  /* ------------------------------------------------------------------------ */
  const handleAddEarning = useCallback(() => {
    clearRootError();

    append({
      app: undefined as never,
      amount: 0,
    });
  }, [append, clearRootError]);

  const handleSetApp = useCallback(
    (index: number, value: App) => {
      clearRootError();

      form.setValue(`earnings.${index}.app`, value, SET_VALUE_OPTIONS);
    },

    [clearRootError, form],
  );

  const handleSetAmount = useCallback(
    (index: number, value: number) => {
      clearRootError();

      form.setValue(`earnings.${index}.amount`, value, SET_VALUE_OPTIONS);
    },

    [clearRootError, form],
  );

  const handleSetDate = useCallback(
    (value: Date) => {
      clearRootError();

      form.setValue(
        "date",
        toDayDate(value),

        SET_VALUE_OPTIONS,
      );
    },

    [clearRootError, form],
  );

  async function onSubmit(values: DayFormInput) {
    try {
      let result;

      if (isUpdate) {
        if (!dayId) {
          form.setError("root", {
            message: "ID do registro não encontrado.",
          });

          return;
        }

        result = await updateMutation.mutateAsync({
          id: dayId,
          data: values,
        });
      } else {
        result = await createMutation.mutateAsync(values);
      }

      if (!result.success) {
        form.setError("root", {
          message: result.error.message ?? "Erro ao salvar registro.",
        });

        return;
      }

      toast.success(
        isUpdate
          ? "Registro atualizado com sucesso."
          : "Registro criado com sucesso.",
      );

      await onSuccess?.();

      if (!isUpdate) {
        form.reset(DEFAULT_VALUES);
      }
    } catch (error) {
      console.error(error);

      form.setError("root", {
        message: "Erro inesperado. Tente novamente.",
      });
    }
  }

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */
  return (
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

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 md:space-y-6"
      >
        {/* DATE */}
        <div className={cn("space-y-2", isUpdate && "opacity-70")}>
          <label className="text-sm font-medium">Data</label>

          <Controller
            control={form.control}
            name="date"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isUpdate}
                    className="h-11 w-full justify-between"
                  >
                    {field.value
                      ? format(
                          parseDayDate(field.value),

                          "PPP",

                          {
                            locale: ptBR,
                          },
                        )
                      : "Selecionar data"}

                    <CalendarIcon className="h-4 w-4 opacity-60" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    locale={ptBR}
                    selected={date ? parseDayDate(date) : undefined}
                    disabled={(currentDate) => {
                      if (isUpdate) {
                        return true;
                      }

                      const today = new Date();

                      today.setHours(23, 59, 59, 999);

                      return currentDate > today;
                    }}
                    onSelect={(value) => {
                      if (!value || isUpdate) {
                        return;
                      }

                      handleSetDate(value);
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          />

          {isUpdate && (
            <p className="text-muted-foreground text-xs">
              A data não pode ser alterada após o registro.
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
          {/* HOURS */}
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
              {...form.register("hours", {
                valueAsNumber: true,
              })}
            />

            {form.formState.errors.hours && (
              <p className="text-destructive text-xs">
                {form.formState.errors.hours.message}
              </p>
            )}
          </div>

          {/* KM */}
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
              {...form.register("kilometers", {
                valueAsNumber: true,
              })}
            />

            {form.formState.errors.kilometers && (
              <p className="text-destructive text-xs">
                {form.formState.errors.kilometers.message}
              </p>
            )}
          </div>
        </div>

        {/* EARNINGS */}
        <EarningsFields
          fields={fields}
          earnings={earnings}
          selectedApps={selectedApps}
          errors={form.formState.errors}
          onAppend={handleAddEarning}
          onRemove={remove}
          onAppChange={handleSetApp}
          onAmountChange={handleSetAmount}
        />

        {/* SERVER ERROR */}
        <FormAlert message={form.formState.errors.root?.message} />

        {/* SUBMIT */}
        <Button
          type="submit"
          size="lg"
          disabled={!form.formState.isValid || isPending}
          className="h-12 w-full"
        >
          {submitLabel}
        </Button>
      </form>
    </div>
  );
}
