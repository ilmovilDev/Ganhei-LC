feat: Nueva funcionalidad.
fix: Corrección de un error.
docs: Cambios en la documentación.
style: Cambios de formato, punto y coma, etc. (no afecta la lógica).
refactor: Cambio de código que no corrige un bug ni añade funcionalidad.
perf: Mejora de rendimiento.
test: Añadir o corregir tests.
chore: Tareas de mantenimiento, actualización de dependencias.

/
├── app/ 👈 routing (Next.js App Router)
│
│ ├── (auth)/
│ │ ├── sign-in/
│ │ │ └── page.tsx
│ │ ├── sign-up/
│ │ │ └── page.tsx
│
│ ├── (dashboard)/ 👈 SaaS protegido
│ │ ├── layout.tsx 👈 sidebar + header + auth guard
│ │
│ │ ├── dashboard/
│ │ │ └── page.tsx
│ │
│ │ ├── earnings/
│ │ │ └── page.tsx
│ │
│ │ ├── expenses/
│ │ │ └── page.tsx
│ │
│ │ ├── subscription/
│ │ │ └── page.tsx
│
│ ├── api/ 👈 opcional (webhooks, etc.)
│
│ ├── lib/ 👈 infraestructura global
│ │ ├── db/
│ │ │ └── prisma.ts
│ │ │
│ │ ├── auth/
│ │ │ └── current-user.ts
│ │ │
│ │ └── utils.ts
│
│ ├── providers/ 👈 providers globales
│ │ ├── query-provider.tsx
│ │ └── theme-provider.tsx
│
│ ├── globals.css
│ ├── layout.tsx 👈 root layout
│ └── page.tsx 👈 landing (opcional)
│
│
├── features/ 👈 🔥 AQUÍ VAN TODAS TUS FEATURES
│
│ ├── earnings/ 👈 FEATURE COMPLETA (TU CASO)
│ │ ├── actions/
│ │ │ ├── create-earning.ts
│ │ │ ├── update-earning.ts
│ │ │ ├── delete-earning.ts
│ │ │ ├── get-earnings.ts
│ │ │ └── get-day-by-id.ts
│ │ │
│ │ ├── hooks/
│ │ │ ├── use-earnings.ts
│ │ │ ├── use-create-earning.ts
│ │ │ ├── use-update-earning.ts
│ │ │ └── use-delete-earning.ts
│ │ │
│ │ ├── components/
│ │ │ ├── earnings-table.tsx
│ │ │ ├── earnings-columns.tsx
│ │ │ ├── earnings-header.tsx
│ │ │ ├── upsert-earning-dialog.tsx
│ │ │ ├── delete-earning-dialog.tsx
│ │ │ └── earnings-view.tsx 👈 👈 IMPORTANTE (entry UI)
│ │ │
│ │ ├── schemas/
│ │ │ └── earning-schema.ts
│ │ │
│ │ ├── types/
│ │ │ └── earning.types.ts
│ │ │
│ │ ├── services/ 👈 🔥 CORE REAL
│ │ │ └── earning.service.ts
│ │
│ │
│ ├── expenses/ 👈 MISMA ESTRUCTURA (ESPEJO)
│ │ ├── actions/
│ │ ├── hooks/
│ │ ├── components/
│ │ ├── schemas/
│ │ ├── types/
│ │ └── services/
│ │
│ │
│ ├── dashboard/ 👈 MÉTRICAS Y AGREGACIONES
│ │ ├── actions/
│ │ ├── hooks/
│ │ ├── components/
│ │ ├── services/
│ │ └── types/
│ │
│ │
│ ├── subscription/
│ │ ├── actions/
│ │ ├── hooks/
│ │ ├── components/
│ │ └── services/
│
│
├── components/ 👈 UI GLOBAL (shadcn/ui)
│ ├── ui/
│ └── shared/
│
├── hooks/ 👈 hooks globales (NO de features)
│
├── types/ 👈 tipos globales
│
├── prisma/
│ └── schema.prisma
│
├── public/
│
├── package.json
├── tsconfig.json
└── next.config.js
