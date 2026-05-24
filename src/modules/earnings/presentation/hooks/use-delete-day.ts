"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { deleteDayAction } from "@/modules/earnings/application/actions/delete-day.action";
import { useEarningsContext } from "../providers/earning-provider";

export function useDeleteDay() {
  const [isDeleting, setIsDeleting] = useState(false);

  const { refetch } = useEarningsContext();

  const remove = useCallback(
    async (id: string) => {
      if (isDeleting) return;

      setIsDeleting(true);

      try {
        const result = await deleteDayAction(id);

        if (!result.success) {
          toast.error(result.error.message);

          return result;
        }

        await refetch();

        toast.success("Registro excluído com sucesso.");

        return result;
      } catch (error) {
        console.error(error);

        toast.error("Erro inesperado ao excluir.");

        return {
          success: false,
          code: "INTERNAL_ERROR",
          error: {
            message: "Erro inesperado.",
          },
        };
      } finally {
        setIsDeleting(false);
      }
    },
    [isDeleting, refetch],
  );

  return {
    remove,
    isDeleting,
  };
}
