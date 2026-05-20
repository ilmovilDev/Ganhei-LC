"use client";

import { useCallback, useEffect, useMemo, useTransition } from "react";
import { FieldPath, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { App } from "@/generated/prisma/enums";
import { DayFormData, dayFormSchema } from "../schemas";
import { createDayAction, updateDayAction } from "../actions";
import { ErrorCodes } from "@/lib/errors";
import { toDayDate, todayDayDate } from "@/lib/date";
import { DayFormInput, UpsertMode } from "../types";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                       */
/* -------------------------------------------------------------------------- */

interface UseUpsertDayParams {
  day?: DayFormInput | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                   */
/* -------------------------------------------------------------------------- */

// Referencia estable — evita que useMemo de earnings se re-ejecute innecesariamente
const EMPTY_EARNINGS: DayFormData["earnings"] = [];

export const UPSERT_DAY_COPY = {
  create: {
    title: "Registrar dia",
    description: "Adicione os dados para acompanhar seu desempenho.",
    submit: "Salvar",
    toast: "Ganhos registrados com sucesso.",
  },
  update: {
    title: "Editar dia",
    description: "Atualize os dados deste dia.",
    submit: "Atualizar",
    toast: "Ganhos atualizados com sucesso.",
  },
} as const;

// Opciones de setValue reutilizables — evita repetir el objeto en cada llamada
const SET_VALUE_OPTIONS = {
  shouldDirty: true,
  shouldTouch: true,
  shouldValidate: true,
} as const;

/* -------------------------------------------------------------------------- */
/* HELPERS (fuera del hook — funciones puras, no se recrean en cada render)   */
/* -------------------------------------------------------------------------- */

function buildDefaultValues(day?: DayFormInput | null): DayFormData {
  if (day) {
    return {
      date: day.date,
      hours: day.hours,
      kilometers: day.kilometers,
      earnings: day.earnings.map(({ app, amount }) => ({ app, amount })),
    };
  }

  return {
    date: todayDayDate(),
    hours: 8,
    kilometers: 100,
    earnings: [],
  };
}

/* -------------------------------------------------------------------------- */
/* HOOK                                                                        */
/* -------------------------------------------------------------------------- */

export function useUpsertDay({
  day,
  isOpen,
  onOpenChange,
  onSuccess,
}: UseUpsertDayParams) {
  const [isPending, startTransition] = useTransition();

  const mode: UpsertMode = day ? "update" : "create";
  const isUpdate = mode === "update";

  // ── Form ──────────────────────────────────────────────────────────────────
  // defaultValues solo aplica al primer mount — los resets posteriores
  // se manejan en el useEffect de abajo
  const form = useForm<DayFormData>({
    resolver: zodResolver(dayFormSchema),
    mode: "onBlur",
    defaultValues: buildDefaultValues(day),
  });

  // ── Reset al abrir ────────────────────────────────────────────────────────
  // Se omite `form` de las deps intencionalmente: useForm devuelve una
  // referencia estable, incluirla causa un loop infinito en strict mode.
  // `day` se incluye para que al abrir el mismo dialog con un registro
  // diferente (ej. editar fila A → editar fila B) el form se resetee correctamente.
  useEffect(() => {
    if (!isOpen) return;
    form.reset(buildDefaultValues(day));
  }, [isOpen, day]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Field array ───────────────────────────────────────────────────────────
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "earnings",
  });

  // ── Watchers ──────────────────────────────────────────────────────────────
  const earnings =
    useWatch({ control: form.control, name: "earnings" }) ?? EMPTY_EARNINGS;
  const date = useWatch({ control: form.control, name: "date" });

  // ── Derived state ─────────────────────────────────────────────────────────
  const total = useMemo(
    () => earnings.reduce((sum, e) => sum + (e.amount || 0), 0),
    [earnings],
  );

  // App[] de los earnings actuales — usado por el selector para deshabilitar duplicados
  const selectedApps = useMemo(
    () => earnings.map((e) => e.app).filter((app): app is App => app != null),
    [earnings],
  );

  // ── Helpers internos ──────────────────────────────────────────────────────
  const clearRootError = useCallback(() => form.clearErrors("root"), [form]);

  const applyFieldErrors = useCallback(
    (fieldErrors?: Record<string, string[] | undefined>) => {
      if (!fieldErrors) return;

      for (const [field, messages] of Object.entries(fieldErrors)) {
        if (!messages?.length) continue;
        form.setError(field as FieldPath<DayFormData>, {
          type: "server",
          message: messages[0],
        });
      }
    },
    [form],
  );

  // ── Handlers públicos ─────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    if (isPending) return;
    form.clearErrors();
    onOpenChange(false);
  }, [isPending, form, onOpenChange]);

  const addEarning = useCallback(
    () => append({ app: undefined as unknown as App, amount: 0 }),
    [append],
  );

  const setApp = useCallback(
    (index: number, value: App) => {
      clearRootError();
      form.setValue(`earnings.${index}.app`, value, SET_VALUE_OPTIONS);
    },
    [clearRootError, form],
  );

  const setAmount = useCallback(
    (index: number, value: number) => {
      clearRootError();
      form.setValue(`earnings.${index}.amount`, value, SET_VALUE_OPTIONS);
    },
    [clearRootError, form],
  );

  const setDate = useCallback(
    (value: Date) => {
      clearRootError();
      form.setValue("date", toDayDate(value), SET_VALUE_OPTIONS);
    },
    [clearRootError, form],
  );

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = form.handleSubmit((values) => {
    clearRootError();

    startTransition(async () => {
      try {
        const result =
          isUpdate && day
            ? await updateDayAction(day.id, values)
            : await createDayAction(values);

        if (!result.success) {
          if (result.error.code === ErrorCodes.VALIDATION_ERROR) {
            applyFieldErrors(result.error.fieldErrors);
            return;
          }

          form.setError("root", {
            type: "server",
            message: result.error.message,
          });
          return;
        }

        toast.success(UPSERT_DAY_COPY[mode].toast);
        onSuccess?.();
        handleClose();
      } catch {
        form.setError("root", {
          type: "server",
          message: "Ocorreu um erro inesperado. Tente novamente.",
        });
      }
    });
  });

  // ── Return ────────────────────────────────────────────────────────────────
  return {
    // State
    mode,
    isUpdate,
    isPending,
    // Form
    form,
    fields,
    earnings,
    date,
    // Derived
    total,
    selectedApps, // renombrado: selectedAppNames → selectedApps (más conciso)
    COPY: UPSERT_DAY_COPY,
    // Handlers
    append: addEarning,
    remove,
    setApp,
    setAmount,
    setDate,
    handleSubmit,
    handleClose,
  };
}
