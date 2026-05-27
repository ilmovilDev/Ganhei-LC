"use client";

import { App } from "@/generated/prisma/enums";
import { CurrencyInput } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XIcon } from "lucide-react";
import { Apps } from "@/modules/earnings/constants/apps-label";

interface Props {
  fields: {
    id: string;
  }[];

  earnings: {
    app: App;
    amount: number;
  }[];

  selectedApps: App[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  onAppend(): void;
  onRemove(index: number): void;
  onAppChange(index: number, app: App): void;
  onAmountChange(index: number, amount: number): void;
}

export default function EarningsFields({
  fields,
  earnings,
  selectedApps,
  errors,
  onAppend,
  onRemove,
  onAppChange,
  onAmountChange,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Aplicativos</label>

        <Button type="button" size="sm" variant="outline" onClick={onAppend}>
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
            const appError = errors?.earnings?.[index]?.app;

            const amountError = errors?.earnings?.[index]?.amount;

            return (
              <div key={field.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  {/* APP */}
                  <div className="flex-1">
                    <Select
                      value={earnings[index]?.app ?? ""}
                      onValueChange={(value) =>
                        onAppChange(index, value as App)
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Aplicativo" />
                      </SelectTrigger>

                      <SelectContent>
                        {Apps.map((app) => {
                          const isSelected = selectedApps.includes(app.value);

                          const isCurrent = earnings[index]?.app === app.value;

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
                      onChange={(value) => onAmountChange(index, value)}
                    />
                  </div>

                  {/* REMOVE */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(index)}
                  >
                    <XIcon className="size-4" />
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
    </div>
  );
}
