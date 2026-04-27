import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertDayAction } from "../actions/upsert-day.action";
import { UpsertDayMutationInput } from "../types/day/day-mutation.type";

export function useUpsertDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dayId, data }: UpsertDayMutationInput) => {
      return await upsertDayAction({
        dayId,
        data,
      });
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["days"] });

      const previousDays = queryClient.getQueryData(["days"]);

      return { previousDays };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previousDays) {
        queryClient.setQueryData(["days"], ctx.previousDays);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["days"] });
    },
  });
}
