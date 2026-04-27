"use server";

import { daySchema } from "../schemas/day.schema";

import { upsertDayService } from "../services/upsert-day.service";
import { UpsertDayActionInputProps } from "@/modules/interfaces/actions/upsert-day-action.interface";
import { handleError } from "@/lib/errors/handle-error";
import { requireUserOrRedirect } from "@/lib/auth/require-user-or-redirect";

export async function upsertDayAction({
  dayId,
  data,
}: UpsertDayActionInputProps) {
  const userId = await requireUserOrRedirect();
  const parsed = daySchema.parse(data);
  return handleError(() =>
    upsertDayService({
      clerkId: userId,
      data: parsed,
      dayId,
    }),
  );
}
