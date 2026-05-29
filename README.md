# Arquitectura del Módulo — Responsabilidades por Capa

# Flujo General

```txt
UI
↓
Hooks (React Query)
↓
API Services
↓
Route Handlers
↓
Use Cases
↓
Repositories
↓
Prisma
↓
Database
```

---

# 1. UI Layer

## `presentation/components`

# Responsabilidad

Renderizar la interfaz y capturar interacciones del usuario.

# Qué debe hacer

- Mostrar datos
- Mostrar loading/error/empty states
- Manejar eventos UI
- Renderizar tablas, cards, forms, dialogs
- Consumir hooks

# Qué NO debe hacer

- Fetch manual
- Lógica de negocio
- Queries Prisma
- Validaciones complejas
- Cálculos financieros

# Ejemplo

```tsx
const { days } = useDaysByMonth();

return <DaysTable data={days} />;
```

---

# 2. Hooks Layer (React Query)

## `presentation/hooks`

# Responsabilidad

Conectar UI con server-state.

# Qué debe hacer

- useQuery/useMutation
- Cache
- Invalidaciones
- Optimistic updates
- Loading/error state
- Query keys

# Qué NO debe hacer

- Lógica de negocio
- Prisma
- Validaciones Zod
- HTTP manual

# Ejemplo

```ts
useQuery({
  queryKey: ["days", month, year],
  queryFn: () => getDaysApi(month, year),
});
```

---

# 3. API Services

## `presentation/services`

# Responsabilidad

Cliente HTTP frontend.

# Qué debe hacer

- fetch
- parse response
- enviar body
- manejar headers

# Qué NO debe hacer

- Cache
- Lógica de negocio
- Estado UI
- Prisma

# Ejemplo

```ts
return apiClient.get("/api/earnings/days");
```

---

# 4. Route Handlers

## `app/api`

# Responsabilidad

Entrada HTTP del backend.

# Qué debe hacer

- Leer request
- Leer params
- Auth
- Validar input
- Llamar use-case
- Retornar response

# Qué NO debe hacer

- Prisma directo
- Lógica financiera
- Reglas de negocio

# Ejemplo

```ts
const result = await useCase.execute();
```

---

# 5. Use Cases

## `application/use-cases`

# Responsabilidad

Orquestar reglas de negocio.

# Qué debe hacer

- Ejecutar lógica del sistema
- Coordinar repositories
- Manejar transacciones
- Aplicar reglas de negocio

# Qué NO debe hacer

- HTTP
- React
- JSX
- NextResponse

# Ejemplo

```ts
create day
↓
sync earnings
↓
recalculate totals
```

---

# 6. Repositories

## `infrastructure/repositories`

# Responsabilidad

Acceso a datos.

# Qué debe hacer

- Queries Prisma
- CRUD
- where/select/orderBy

# Qué NO debe hacer

- Reglas de negocio
- HTTP
- React Query

# Ejemplo

```ts
prisma.day.findMany();
```

---

# 7. Prisma Layer

## `infrastructure/selects`

# Responsabilidad

Comunicación con la base de datos.

# Qué debe hacer

- Modelos
- Selects
- Includes
- Relaciones
- Optimización de queries

# Qué NO debe hacer

- Lógica de negocio
- UI
- HTTP

# Ejemplo

```ts
export const daySelect = {
  id: true,
  date: true,
};
```

---

# 8. Database

## PostgreSQL

# Responsabilidad

Persistencia real de datos.

# Qué hace

- Guardar datos
- Ejecutar índices
- Constraints
- Relaciones
- Transactions

# Qué NO debe hacer

- Lógica de aplicación
- Reglas frontend

---

# Regla de Oro

# Cada capa debe saber SOLO lo necesario.

---

# Ejemplo Correcto

```txt
UI sabe renderizar
Hooks saben cachear
Services saben hacer HTTP
Routes saben recibir requests
Use-cases saben negocio
Repositories saben consultar
Prisma sabe SQL
DB sabe persistir
```

---

# Señales de Mala Arquitectura

## ❌ Prisma dentro de componentes

## ❌ lógica financiera dentro de hooks

## ❌ fetch manual dentro de UI

## ❌ use-case retornando NextResponse

## ❌ repository calculando negocio

## ❌ context guardando server-state

## ❌ React Query dentro de services

---

# Objetivo Final

Lograr:

- Bajo acoplamiento
- Alta mantenibilidad
- Escalabilidad
- Performance
- Código predecible
- Fácil testing
- Arquitectura limpia
