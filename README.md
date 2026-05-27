# Migración Completa: Server Actions → React Query + API Routes

## Objetivo

Migrar el módulo `earnings` desde una arquitectura híbrida basada en:

- Server Actions
- Local state
- useEffect
- router.refresh
- revalidatePath

hacia una arquitectura enterprise-ready basada en:

- React Query
- API Routes
- Clean Architecture
- Query Keys centralizadas
- Cache consistente
- Mutations desacopladas
- Domain-driven structure

---

# Arquitectura Final

```txt
UI
 ↓
React Query
 ↓
API Routes
 ↓
Application Services
 ↓
Domain
 ↓
Repositories
 ↓
Prisma
```

---

# Estructura Final de Carpetas

```txt
src/

├── app/
│   ├── api/
│   │   └── earnings/
│   │       ├── route.ts
│   │       ├── [id]/
│   │       │   └── route.ts
│   │       └── summaries/
│   │           └── route.ts
│   │
│   └── (dashboard)/
│       └── earnings/
│           └── page.tsx
│
├── modules/
│   └── earnings/
│
│       ├── application/
│       │
│       │   ├── dto/
│       │   ├── services/
│       │   ├── mappers/
│       │   ├── commands/
│       │   └── queries/
│       │
│       ├── domain/
│       │
│       │   ├── entities/
│       │   ├── services/
│       │   ├── repositories/
│       │   └── value-objects/
│       │
│       ├── infrastructure/
│       │
│       │   ├── prisma/
│       │   │   ├── repositories/
│       │   │   └── transactions/
│       │   │
│       │   ├── auth/
│       │   ├── telemetry/
│       │   └── cache/
│       │
│       ├── presentation/
│       │
│       │   ├── hooks/
│       │   │   ├── queries/
│       │   │   ├── mutations/
│       │   │   └── selectors/
│       │   │
│       │   ├── components/
│       │   │   ├── dialogs/
│       │   │   ├── forms/
│       │   │   ├── table/
│       │   │   ├── cards/
│       │   │   └── states/
│       │   │
│       │   ├── lib/
│       │   └── schemas/
│       │
│       └── shared/
│
├── providers/
│   └── query-provider.tsx
│
├── lib/
│   ├── db/
│   ├── errors/
│   ├── http/
│   └── utils/
│
└── generated/
```

---

# ORDEN PROFESIONAL DE IMPLEMENTACIÓN

---

# FASE 1 — FOUNDATION

---

# 1. INSTALAR DEPENDENCIAS

```bash
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools
```

---

# 2. CREAR QUERY PROVIDER

## NUEVO

```txt
src/providers/query-provider.tsx
```

## RESPONSABILIDAD

- Crear QueryClient
- Configurar cache global
- Configurar retry
- Configurar staleTime
- Exponer ReactQueryDevtools

## IMPLEMENTAR PRIMERO

---

# 3. MODIFICAR ROOT LAYOUT

## MODIFICAR

```txt
src/app/layout.tsx
```

## RESPONSABILIDAD

- Envolver toda la app con QueryProvider

---

# 4. CREAR API CLIENT

## NUEVO

```txt
src/lib/http/api-client.ts
```

## RESPONSABILIDAD

Centralizar:

- fetch
- parse JSON
- headers
- error handling
- auth token
- interceptors futuros

---

# 5. CREAR QUERY KEYS

## NUEVO

```txt
src/modules/earnings/presentation/lib/query-keys.ts
```

## RESPONSABILIDAD

Centralizar TODAS las query keys.

Nunca hardcodear arrays.

---

# FASE 2 — API LAYER

---

# 6. CREAR GET + POST ROUTE

## NUEVO

```txt
src/app/api/earnings/route.ts
```

## RESPONSABILIDAD

### GET

- listar days
- paginación futura
- filtros
- summary

### POST

- crear day

---

# 7. CREAR PATCH + DELETE ROUTE

## NUEVO

```txt
src/app/api/earnings/[id]/route.ts
```

## RESPONSABILIDAD

### PATCH

- update day

### DELETE

- delete day

---

# IMPORTANTE

Las routes:

```txt
NO contienen lógica de negocio
```

Solo:

- auth
- validate body
- invoke service
- return response

---

# FASE 3 — APPLICATION REFACTOR

---

# 8. ELIMINAR SERVER ACTIONS

## ELIMINAR COMPLETAMENTE

```txt
application/actions/
```

---

# 9. CREAR SERVICES

## NUEVOS

```txt
application/services/create-day.service.ts
application/services/update-day.service.ts
application/services/delete-day.service.ts
application/services/get-days.service.ts
```

## RESPONSABILIDAD

Mover lógica desde:

```txt
Server Actions
```

hacia:

```txt
Application Services
```

---

# 10. CREAR DTOs LIMPIOS

## NUEVOS

```txt
application/dto/create-day.dto.ts
application/dto/update-day.dto.ts
application/dto/day-list-item.dto.ts
application/dto/day-summary.dto.ts
```

## RESPONSABILIDAD

- Contratos estables
- Desacoplar Prisma
- Evitar leaking entities

---

# 11. CREAR MAPPERS

## NUEVOS

```txt
application/mappers/day.mapper.ts
application/mappers/earning.mapper.ts
```

## RESPONSABILIDAD

Mapear:

- Prisma → DTO
- DTO → Domain
- Domain → Response

---

# FASE 4 — DOMAIN HARDENING

---

# 12. CREAR DOMAIN SERVICES

## NUEVOS

```txt
domain/services/calculate-net-profit.ts
domain/services/sync-day-financials.ts
domain/services/validate-day.ts
```

## RESPONSABILIDAD

Encapsular:

- reglas financieras
- cálculos
- validaciones

---

# 13. CREAR VALUE OBJECTS

## NUEVOS

```txt
domain/value-objects/money.vo.ts
domain/value-objects/date.vo.ts
```

## RESPONSABILIDAD

Evitar:

- números inválidos
- fechas inválidas
- lógica repetida

---

# 14. CREAR REPOSITORY INTERFACES

## NUEVO

```txt
domain/repositories/day.repository.interface.ts
```

## RESPONSABILIDAD

Inversión de dependencias.

---

# FASE 5 — INFRASTRUCTURE

---

# 15. REFACTOR PRISMA REPOSITORIES

## MODIFICAR

```txt
infrastructure/prisma/repositories/prisma-day.repository.ts
infrastructure/prisma/repositories/prisma-earning.repository.ts
```

## RESPONSABILIDAD

Repositories SOLO persisten.

Nada de:

- cálculos
- validaciones
- mapping
- UI logic

---

# 16. CREAR AUTH WRAPPER

## NUEVO

```txt
infrastructure/auth/require-auth.ts
```

## RESPONSABILIDAD

Centralizar:

- auth
- clerkId
- unauthorized errors

---

# 17. CREAR LOGGER

## NUEVO

```txt
infrastructure/telemetry/logger.ts
```

## RESPONSABILIDAD

- logs
- observabilidad
- métricas futuras

---

# FASE 6 — REACT QUERY LAYER

---

# 18. CREAR QUERY HOOKS

## NUEVOS

```txt
presentation/hooks/queries/use-days.ts
presentation/hooks/queries/use-day-summary.ts
presentation/hooks/queries/use-day.ts
```

## RESPONSABILIDAD

Queries ONLY.

Nunca:

- mutations
- side effects
- toasts

---

# 19. CREAR MUTATION HOOKS

## NUEVOS

```txt
presentation/hooks/mutations/use-create-day.ts
presentation/hooks/mutations/use-update-day.ts
presentation/hooks/mutations/use-delete-day.ts
presentation/hooks/mutations/use-create-expense.ts
```

## RESPONSABILIDAD

Centralizar:

- invalidateQueries
- optimistic updates
- toasts
- rollback
- retry

---

# 20. CREAR SELECTORS

## NUEVOS

```txt
presentation/hooks/selectors/use-total-profit.ts
presentation/hooks/selectors/use-total-expenses.ts
```

## RESPONSABILIDAD

Evitar cálculos repetidos en componentes.

---

# FASE 7 — UI REFACTOR

---

# 21. REFACTOR DAYS VIEW

## MODIFICAR

```txt
presentation/components/table/days-view.tsx
```

## RESPONSABILIDAD

Eliminar:

- useEffect fetching
- local loading state
- manual refresh

Usar:

```ts
useDays();
```

---

# 22. REFACTOR DAYS TABLE

## MODIFICAR

```txt
presentation/components/table/days-table.tsx
```

## RESPONSABILIDAD

Eliminar:

```txt
Server Actions directas
```

Usar:

```txt
useDeleteDay()
```

---

# 23. REFACTOR DAY FORM

## MODIFICAR

```txt
presentation/components/forms/day-form.tsx
```

## RESPONSABILIDAD

Eliminar:

```txt
createDayAction()
updateDayAction()
```

Usar:

```txt
useCreateDay()
useUpdateDay()
```

---

# 24. REFACTOR DIALOGS

## MODIFICAR

```txt
presentation/components/dialogs/upsert-day-dialog.tsx
```

## RESPONSABILIDAD

Desacoplar loading states.

---

# FASE 8 — CLEANUP

---

# 25. ELIMINAR router.refresh

## ELIMINAR COMPLETAMENTE

```txt
router.refresh()
```

---

# 26. ELIMINAR revalidatePath

## ELIMINAR COMPLETAMENTE

```txt
revalidatePath()
```

---

# 27. ELIMINAR revalidateTag

## ELIMINAR COMPLETAMENTE

```txt
revalidateTag()
```

---

# 28. ELIMINAR useEffect FETCHING

## ELIMINAR

Todos los:

```txt
useEffect(() => fetch())
```

---

# FASE 9 — PERFORMANCE

---

# 29. MEMOIZAR COLUMNAS

## MODIFICAR

```txt
presentation/components/table/columns-day.tsx
```

## RESPONSABILIDAD

Evitar rerenders innecesarios.

---

# 30. OPTIMISTIC UPDATES

## FUTURO

Agregar:

```txt
onMutate()
```

---

# 31. PAGINACIÓN

## FUTURO

Agregar:

```txt
useInfiniteQuery()
```

---

# 32. REALTIME

## FUTURO

Agregar:

- websocket
- Pusher
- Ably
- Supabase Realtime

---

# COMPONENTES VIEJOS A ELIMINAR

---

# ELIMINAR COMPLETAMENTE

```txt
application/actions/create-day.action.ts
application/actions/update-day.action.ts
application/actions/delete-day.action.ts
application/actions/get-days.action.ts
```

---

# ELIMINAR COMPLETAMENTE

```txt
revalidatePath
revalidateTag
router.refresh
```

---

# ELIMINAR useTransition

Cuando React Query ya maneja loading state.

---

# ELIMINAR FETCH LOCAL

```txt
useEffect + fetch
```

---

# PRINCIPIOS IMPORTANTES

---

# 1. QUERY KEYS CENTRALIZADAS

Nunca:

```ts
["earnings"];
```

hardcodeado.

---

# 2. REPOSITORIES SIN LÓGICA

Repositories SOLO persisten.

---

# 3. SERVICES ORQUESTAN

Services contienen:

- transacciones
- validaciones
- cálculos
- orchestration

---

# 4. DOMAIN ES PURO

Sin:

- React
- Prisma
- HTTP
- Next.js

---

# 5. PRESENTATION SOLO UI

Nada de lógica financiera.

---

# INVENTARIO COMPLETO DE ARCHIVOS

## FOUNDATION

### NUEVOS

```txt
src/providers/query-provider.tsx
src/lib/http/api-client.ts
```

### MODIFICAR

```txt
src/app/layout.tsx
```

---

# API ROUTES

## NUEVOS

```txt
src/app/api/earnings/route.ts
src/app/api/earnings/[id]/route.ts
src/app/api/earnings/summaries/route.ts
```

---

# APPLICATION

## ELIMINAR

```txt
src/modules/earnings/application/actions/create-day.action.ts
src/modules/earnings/application/actions/update-day.action.ts
src/modules/earnings/application/actions/delete-day.action.ts
src/modules/earnings/application/actions/get-days.action.ts
```

## NUEVOS

```txt
src/modules/earnings/application/services/create-day.service.ts
src/modules/earnings/application/services/update-day.service.ts
src/modules/earnings/application/services/delete-day.service.ts
src/modules/earnings/application/services/get-days.service.ts
```

---

# DTOS

## NUEVOS

```txt
src/modules/earnings/application/dto/create-day.dto.ts
src/modules/earnings/application/dto/update-day.dto.ts
src/modules/earnings/application/dto/day-list-item.dto.ts
src/modules/earnings/application/dto/day-summary.dto.ts
```

---

# MAPPERS

## NUEVOS

```txt
src/modules/earnings/application/mappers/day.mapper.ts
src/modules/earnings/application/mappers/earning.mapper.ts
```

---

# DOMAIN

## NUEVOS

```txt
src/modules/earnings/domain/services/calculate-net-profit.ts
src/modules/earnings/domain/services/sync-day-financials.ts
src/modules/earnings/domain/services/validate-day.ts
```

---

# VALUE OBJECTS

## NUEVOS

```txt
src/modules/earnings/domain/value-objects/money.vo.ts
src/modules/earnings/domain/value-objects/date.vo.ts
```

---

# REPOSITORY INTERFACES

## NUEVOS

```txt
src/modules/earnings/domain/repositories/day.repository.interface.ts
```

---

# INFRASTRUCTURE

## MODIFICAR

```txt
src/modules/earnings/infrastructure/prisma/repositories/prisma-day.repository.ts
src/modules/earnings/infrastructure/prisma/repositories/prisma-earning.repository.ts
```

## NUEVOS

```txt
src/modules/earnings/infrastructure/auth/require-auth.ts
src/modules/earnings/infrastructure/telemetry/logger.ts
src/modules/earnings/infrastructure/cache/query-keys.ts
```

---

# REACT QUERY HOOKS

## NUEVOS

```txt
src/modules/earnings/presentation/hooks/queries/use-days.ts
src/modules/earnings/presentation/hooks/queries/use-day.ts
src/modules/earnings/presentation/hooks/queries/use-day-summary.ts
```

---

# MUTATIONS

## NUEVOS

```txt
src/modules/earnings/presentation/hooks/mutations/use-create-day.ts
src/modules/earnings/presentation/hooks/mutations/use-update-day.ts
src/modules/earnings/presentation/hooks/mutations/use-delete-day.ts
src/modules/earnings/presentation/hooks/mutations/use-create-expense.ts
```

---

# SELECTORS

## NUEVOS

```txt
src/modules/earnings/presentation/hooks/selectors/use-total-profit.ts
src/modules/earnings/presentation/hooks/selectors/use-total-expenses.ts
```

---

# QUERY LIB

## NUEVOS

```txt
src/modules/earnings/presentation/lib/query-client.ts
src/modules/earnings/presentation/lib/query-keys.ts
```

---

# COMPONENTS

## MODIFICAR

```txt
src/modules/earnings/presentation/components/table/days-view.tsx
src/modules/earnings/presentation/components/table/days-table.tsx
src/modules/earnings/presentation/components/table/columns-day.tsx
src/modules/earnings/presentation/components/forms/day-form.tsx
src/modules/earnings/presentation/components/dialogs/upsert-day-dialog.tsx
```

## NUEVOS

```txt
src/modules/earnings/presentation/components/states/loading-state.tsx
src/modules/earnings/presentation/components/states/error-state.tsx
src/modules/earnings/presentation/components/states/empty-state.tsx
```

---

# CLEANUP

## ELIMINAR COMPLETAMENTE

```txt
router.refresh()
revalidatePath()
revalidateTag()
useTransition()
useEffect(() => fetch())
```

---

# CONTENIDO INTERNO BASE DE CADA ARCHIVO

---

# src/providers/query-provider.tsx

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

export function QueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30,
            gcTime: 1000 * 60 * 5,
            retry: 1,
            refetchOnWindowFocus: false,
          },

          mutations: {
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

# src/lib/http/api-client.ts

```ts
export async function apiClient<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, {
    ...init,

    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },

    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Erro na requisição");
  }

  return data;
}
```

---

# src/modules/earnings/presentation/lib/query-keys.ts

```ts
export const earningsKeys = {
  all: ["earnings"] as const,

  lists: () => [...earningsKeys.all, "list"] as const,

  list: (month: number, year: number) =>
    [...earningsKeys.lists(), month, year] as const,

  detail: (id: string) => [...earningsKeys.all, id] as const,
};
```

---

# src/app/api/earnings/route.ts

```ts
import { NextRequest, NextResponse } from "next/server";

import { CreateDayService } from "@/modules/earnings/application/services/create-day.service";
import { GetDaysService } from "@/modules/earnings/application/services/get-days.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const month = Number(searchParams.get("month"));

    const year = Number(searchParams.get("year"));

    const service = new GetDaysService();

    const data = await service.execute({
      month,
      year,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao buscar registros",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const service = new CreateDayService();

    const result = await service.execute(body);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao criar registro",
      },
      {
        status: 500,
      },
    );
  }
}
```

---

# src/app/api/earnings/[id]/route.ts

```ts
import { NextRequest, NextResponse } from "next/server";

import { DeleteDayService } from "@/modules/earnings/application/services/delete-day.service";
import { UpdateDayService } from "@/modules/earnings/application/services/update-day.service";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const body = await request.json();

    const service = new UpdateDayService();

    const result = await service.execute({
      id,
      data: body,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        message: "Erro ao atualizar registro",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const service = new DeleteDayService();

    const result = await service.execute(id);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        message: "Erro ao excluir registro",
      },
      {
        status: 500,
      },
    );
  }
}
```

---

# src/modules/earnings/presentation/hooks/queries/use-days.ts

```ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/http/api-client";

import { earningsKeys } from "../../lib/query-keys";

import type { DayListItemDto } from "@/modules/earnings/application/dtos/day-list-item.dto";

interface Params {
  month: number;
  year: number;
}

export function useDays({ month, year }: Params) {
  return useQuery({
    queryKey: earningsKeys.list(month, year),

    queryFn: async () => {
      return apiClient<DayListItemDto[]>(
        `/api/earnings?month=${month}&year=${year}`,
      );
    },
  });
}
```

---

# src/modules/earnings/presentation/hooks/mutations/use-create-day.ts

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { apiClient } from "@/lib/http/api-client";

import { earningsKeys } from "../../lib/query-keys";

import type { DayFormInput } from "../../schemas/day.schema";

export function useCreateDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DayFormInput) => {
      return apiClient(`/api/earnings`, {
        method: "POST",

        body: JSON.stringify(data),
      });
    },

    onSuccess: async (_, variables) => {
      const date = new Date(variables.date);

      const month = date.getMonth() + 1;

      const year = date.getFullYear();

      await queryClient.invalidateQueries({
        queryKey: earningsKeys.list(month, year),
      });

      toast.success("Registro criado com sucesso");
    },

    onError: () => {
      toast.error("Erro ao criar registro");
    },
  });
}
```

---

# src/modules/earnings/presentation/hooks/mutations/use-update-day.ts

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { apiClient } from "@/lib/http/api-client";

import { earningsKeys } from "../../lib/query-keys";

import type { DayFormInput } from "../../schemas/day.schema";

interface Payload {
  id: string;
  data: DayFormInput;
}

export function useUpdateDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: Payload) => {
      return apiClient(`/api/earnings/${id}`, {
        method: "PATCH",

        body: JSON.stringify(data),
      });
    },

    onSuccess: async (_, variables) => {
      const date = new Date(variables.data.date);

      const month = date.getMonth() + 1;

      const year = date.getFullYear();

      await queryClient.invalidateQueries({
        queryKey: earningsKeys.list(month, year),
      });

      toast.success("Registro atualizado com sucesso");
    },
  });
}
```

---

# src/modules/earnings/presentation/hooks/mutations/use-delete-day.ts

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { apiClient } from "@/lib/http/api-client";

import { earningsKeys } from "../../lib/query-keys";

interface Params {
  month: number;
  year: number;
}

export function useDeleteDay({ month, year }: Params) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient(`/api/earnings/${id}`, {
        method: "DELETE",
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: earningsKeys.list(month, year),
      });

      toast.success("Registro excluído com sucesso");
    },
  });
}
```

---

# RESULTADO FINAL

Tendrás:

- arquitectura enterprise
- cache consistente
- refresh instantáneo
- optimistic updates
- performance estable
- invalidación correcta
- escalabilidad real
- debugging sencillo
- separación clara de responsabilidades
- clean architecture real
- ready para mobile/websocket/realtime
