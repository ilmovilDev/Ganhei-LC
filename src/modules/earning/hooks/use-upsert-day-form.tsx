"use client";

import { useMemo } from "react";
import {
  useForm,
  useFieldArray,
  useWatch,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { daySchema, DayFormData } from "../schemas/day.schema";
import { useUpsertDay } from "./use-upsert-day";
import { UseUpsertEarningFormProps } from "@/modules/interfaces/hooks/use-upsert-earning-form-props.interface";

export function useUpsertEarningForm({
  dayId,
  onSuccess,
  onError,
}: UseUpsertEarningFormProps = {}) {
  const { mutateAsync, isPending } = useUpsertDay();

  const form = useForm<DayFormData>({
    resolver: zodResolver(daySchema),
    mode: "onChange",
    defaultValues: {
      date: new Date(),
      hours: 6,
      kilometers: 150,
      apps: [],
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "apps",
  });

  // ---------------------------------------------
  // WATCH (CONTROLADO)
  // ---------------------------------------------

  const watchedApps = useWatch({
    control: form.control,
    name: "apps",
  });

  const apps = useMemo(() => watchedApps ?? [], [watchedApps]);

  const date = useWatch({
    control: form.control,
    name: "date",
  });

  // ---------------------------------------------
  // DERIVED STATE
  // ---------------------------------------------

  const total = useMemo(() => {
    return apps.reduce((acc, a) => acc + (a.amount || 0), 0);
  }, [apps]);

  const selectedApps = useMemo(() => apps.map((a) => a.name), [apps]);

  const isValidDate = date instanceof Date && !isNaN(date.getTime());

  // ---------------------------------------------
  // SUBMIT (TIPADO CORRECTO)
  // ---------------------------------------------

  const onSubmit: SubmitHandler<DayFormData> = async (data) => {
    const res = await mutateAsync({
      dayId: dayId ?? null,
      data,
    });

    if (!res.success) {
      onError?.(res.error);
      return;
    }

    // ✅ SUCCESS FLOW
    form.reset();
    onSuccess?.();
  };

  // ⚠️ importante: NO redefinir handleSubmit inline en UI
  const handleSubmit = form.handleSubmit(onSubmit);

  // ---------------------------------------------

  return {
    form,
    fieldArray,
    apps,
    selectedApps,
    total,
    isValidDate,
    handleSubmit,
    isPending,
  };
}
